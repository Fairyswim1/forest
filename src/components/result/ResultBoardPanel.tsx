import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { GameBoard } from '../../types/board'
import type { StagePathLayout } from '../../game/pathLayouts/types'
import type { GameResult } from '../../utils/scoring'
import { getTilePositions } from '../../utils/pathLayout'
import {
  buildTileScoringRunMap,
  type ScoringRunView,
} from '../../utils/runDisplay'
import { BoardContainer } from '../BoardContainer'
import { TrailTile } from '../TrailTile'
import { RunBadge } from './RunBadge'

interface ResultBoardPanelProps {
  layout: StagePathLayout
  board: GameBoard
  result: GameResult
  scoringRuns: ScoringRunView[]
  highlightedRunId: number | null
  onHighlightRun: (runId: number | null) => void
}

export function ResultBoardPanel({
  layout,
  board,
  result,
  scoringRuns,
  highlightedRunId,
  onHighlightRun,
}: ResultBoardPanelProps) {
  const positions = useMemo(() => getTilePositions(layout), [layout])
  const tileRunMap = useMemo(() => buildTileScoringRunMap(scoringRuns), [scoringRuns])
  const breakBeforeTileIds = useMemo(
    () => new Set(result.breaks.map((b) => b.beforeTileId)),
    [result.breaks],
  )

  return (
    <section className="result-board-panel result-fantasy-panel" aria-label="오솔길 결과">
      <header className="result-fantasy-panel__tab">
        <span className="result-fantasy-panel__tab-label">오솔길 결과</span>
      </header>

      <div className="result-board-panel__legend" aria-hidden>
        {scoringRuns.map((view) => (
          <span
            key={view.id}
            className={[
              'result-board-panel__legend-chip',
              highlightedRunId === view.id ? 'result-board-panel__legend-chip--highlighted' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--run-color': view.color, '--run-glow': view.glow } as CSSProperties}
            onMouseEnter={() => onHighlightRun(view.id)}
            onMouseLeave={() => onHighlightRun(null)}
          >
            <RunBadge
              src={view.badge}
              label={`구간 ${view.id}`}
              runId={view.id}
              size="row"
              highlighted={highlightedRunId === view.id}
            />
            <span>{view.length}칸 · +{view.score}점</span>
          </span>
        ))}
        {scoringRuns.length === 0 && (
          <span className="result-board-panel__legend-chip result-board-panel__legend-chip--break">
            성공한 구간이 없어요
          </span>
        )}
      </div>

      <div className="result-board-panel__stage">
        <BoardContainer layout={layout} className="board-container--result" directionMarkerVariant="result">
          {positions.map((pos) => {
            const cell = board[pos.id]
            const runView = tileRunMap.get(pos.id)
            const isScoring = runView !== undefined
            const isSuccess = result.successTileIds.has(pos.id)
            const isBreakAfter = result.breakAfterTileIds.has(pos.id)
            const isBreakBefore = breakBeforeTileIds.has(pos.id)
            const isIsolated = cell !== null && !isSuccess
            const runTileIndex = runView ? runView.tileIds.indexOf(pos.id) : -1
            const isRunStart = runTileIndex === 0
            const isHighlighted = runView !== undefined && highlightedRunId === runView.id

            let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
            if (isSuccess) state = 'success'
            else if (cell !== null) state = 'placed'

            return (
              <TrailTile
                key={pos.id}
                id={pos.id}
                x={pos.x}
                y={pos.y}
                cell={cell}
                state={state}
                onClick={() => {}}
                disabled
                dimmed={isIsolated}
                pathIndex={runTileIndex >= 0 ? runTileIndex : pos.pathIndex}
                resultMode
                resultIsolated={isIsolated}
                breakAfter={isBreakAfter}
                breakBefore={isBreakBefore}
                isScoringRun={isScoring}
                isRunStart={isRunStart}
                runColor={runView?.color}
                runGlow={runView?.glow}
                runId={runView?.id}
                runHighlighted={isHighlighted}
                runBadgeSrc={isRunStart ? runView?.badge : undefined}
                runBadgeLabel={isRunStart ? String(runView?.id ?? '') : undefined}
                onRunHover={onHighlightRun}
              />
            )
          })}
        </BoardContainer>
      </div>
    </section>
  )
}
