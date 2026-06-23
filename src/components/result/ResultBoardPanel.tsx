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
import { RunColorBadge } from './RunColorBadge'

interface ResultBoardPanelProps {
  layout: StagePathLayout
  board: GameBoard
  result: GameResult
  scoringRuns: ScoringRunView[]
}

export function ResultBoardPanel({ layout, board, result, scoringRuns }: ResultBoardPanelProps) {
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
            className="result-board-panel__legend-chip"
            style={{ '--run-color': view.color } as CSSProperties}
          >
            <RunColorBadge label={view.label} color={view.color} size="sm" />
            <span>{view.length}칸 · +{view.score}점</span>
          </span>
        ))}
        <span className="result-board-panel__legend-chip result-board-panel__legend-chip--break">
          ↓ 끊김
        </span>
      </div>

      <div className="result-board-panel__stage">
        <BoardContainer layout={layout} className="board-container--result">
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
                runBadgeLabel={isRunStart ? runView?.label : undefined}
              />
            )
          })}
        </BoardContainer>
      </div>
    </section>
  )
}
