import { useMemo } from 'react'
import type { TileId } from '../types/game'
import type { GameResult } from '../utils/scoring'
import { getTileRunMap } from '../utils/scoring'
import { getBreakMarkerMidpoints, getTilePositions } from '../utils/pathLayout'
import { BoardContainer } from './BoardContainer'
import { TrailTile } from './TrailTile'

interface ResultBoardSummaryProps {
  board: Record<TileId, number | null>
  result: GameResult
}

function BreakMarker({ marker }: { marker: { id: TileId; x: number; y: number } }) {
  const { x, y } = marker
  const crackPath = `M ${x - 1.4} ${y - 1.1} L ${x - 0.5} ${y - 0.2} L ${x - 1.1} ${y + 0.3} L ${x - 0.2} ${y + 1.2} L ${x + 0.6} ${y + 0.1} L ${x + 1.3} ${y + 1.1}`

  return (
    <g className="board-overlay-layer__break-group">
      <path d={crackPath} className="board-overlay-layer__break-crack" />
      <circle cx={x} cy={y - 2.2} r={1.35} className="board-overlay-layer__break-badge" />
      <text x={x} y={y - 1.75} className="board-overlay-layer__break-warn" textAnchor="middle">
        !
      </text>
      <text x={x} y={y + 2.8} className="board-overlay-layer__break-arrow" textAnchor="middle">
        ↓
      </text>
    </g>
  )
}

export function ResultBoardSummary({ board, result }: ResultBoardSummaryProps) {
  const positions = useMemo(() => getTilePositions(), [])
  const tileRunMap = useMemo(() => getTileRunMap(result.runs), [result.runs])
  const breakBeforeTileIds = useMemo(
    () => new Set(result.breaks.map((b) => b.beforeTileId)),
    [result.breaks],
  )

  const breakMarkers = useMemo(
    () => getBreakMarkerMidpoints(result.breakAfterTileIds),
    [result.breakAfterTileIds],
  )

  const overlayLayer = (
    <svg className="board-overlay-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {breakMarkers.map((marker) => (
        <BreakMarker key={marker.id} marker={marker} />
      ))}
    </svg>
  )

  return (
    <div className="result-board-summary" aria-label="보드 결과 요약">
      <div className="result-board-summary__legend" aria-hidden>
        <span className="result-board-summary__legend-item result-board-summary__legend-item--success">
          ✦ 성공 구간 (2칸+)
        </span>
        <span className="result-board-summary__legend-item result-board-summary__legend-item--break">
          ↓ 끊긴 지점
        </span>
      </div>
      <BoardContainer className="board-container--summary" overlayLayer={overlayLayer}>
        {positions.map((pos) => {
          const value = board[pos.id]
          const runInfo = tileRunMap.get(pos.id)
          const run = runInfo?.run
          const isScoringRun = (run?.length ?? 0) >= 2
          const isSuccess = result.successTileIds.has(pos.id)
          const isBreakAfter = result.breakAfterTileIds.has(pos.id)
          const isBreakBefore = breakBeforeTileIds.has(pos.id)
          const isIsolated = value !== null && !isSuccess

          let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
          if (isSuccess) state = 'success'
          else if (value !== null) state = 'placed'

          const runTileIndex = run ? run.tileIds.indexOf(pos.id) : -1

          return (
            <TrailTile
              key={pos.id}
              id={pos.id}
              x={pos.x}
              y={pos.y}
              value={value}
              state={state}
              onClick={() => {}}
              disabled
              dimmed={isIsolated}
              pathIndex={runTileIndex >= 0 ? runTileIndex : pos.pathIndex}
              staggerStars={isScoringRun}
              resultMode
              resultIsolated={isIsolated}
              breakAfter={isBreakAfter}
              breakBefore={isBreakBefore}
              runIndex={runInfo?.runIndex}
              isRunStart={runTileIndex === 0}
              isRunEnd={run !== undefined && runTileIndex === run.length - 1}
              isScoringRun={isScoringRun}
            />
          )
        })}
      </BoardContainer>
    </div>
  )
}
