import { useMemo } from 'react'
import type { TileId } from '../types/game'
import { getBreakMarkerMidpoints, getTilePositions } from '../utils/pathLayout'
import { BoardContainer } from './BoardContainer'
import { TrailTile } from './TrailTile'

interface ResultBoardSummaryProps {
  board: Record<TileId, number | null>
  successTileIds: Set<TileId>
  breakAfterTileIds: Set<TileId>
}

export function ResultBoardSummary({ board, successTileIds, breakAfterTileIds }: ResultBoardSummaryProps) {
  const positions = useMemo(() => getTilePositions(), [])
  const breakMarkers = useMemo(
    () => getBreakMarkerMidpoints(breakAfterTileIds),
    [breakAfterTileIds],
  )

  const overlayLayer = (
    <svg className="board-overlay-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {breakMarkers.map((marker) => (
        <g key={marker.id}>
          <line
            x1={marker.x - 1.2}
            y1={marker.y - 0.9}
            x2={marker.x + 1.2}
            y2={marker.y + 0.9}
            className="board-overlay-layer__break-line"
          />
          <line
            x1={marker.x - 1.2}
            y1={marker.y + 0.9}
            x2={marker.x + 1.2}
            y2={marker.y - 0.9}
            className="board-overlay-layer__break-line"
          />
        </g>
      ))}
    </svg>
  )

  return (
    <div className="result-board-summary" aria-label="보드 결과 요약">
      <BoardContainer className="board-container--summary" overlayLayer={overlayLayer}>
        {positions.map((pos) => {
          const value = board[pos.id]
          let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
          if (successTileIds.has(pos.id)) state = 'success'
          else if (value !== null) state = 'placed'

          const dimmed = value !== null && !successTileIds.has(pos.id)

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
              dimmed={dimmed}
              pathIndex={pos.pathIndex}
              staggerStars
            />
          )
        })}
      </BoardContainer>
    </div>
  )
}
