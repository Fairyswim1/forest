import { useMemo } from 'react'
import type { TileId } from '../types/game'
import { getTilePositions } from '../utils/pathLayout'
import { BoardContainer } from './BoardContainer'
import { TrailTile } from './TrailTile'

interface TrailBoardProps {
  board: Record<TileId, number | null>
  selectedTileId: TileId | null
  successTileIds: Set<TileId>
  onSelectTile: (id: TileId) => void
  disabled?: boolean
  tutorialEmptyPulse?: boolean
  forcedSelectedTileId?: TileId | null
  className?: string
}

export function TrailBoard({
  board,
  selectedTileId,
  successTileIds,
  onSelectTile,
  disabled,
  tutorialEmptyPulse = false,
  forcedSelectedTileId,
  className,
}: TrailBoardProps) {
  const positions = useMemo(() => getTilePositions(), [])

  return (
    <BoardContainer className={className}>
      {positions.map((pos) => {
        const value = board[pos.id]
        const effectiveSelectedId = forcedSelectedTileId ?? selectedTileId
        let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
        if (successTileIds.has(pos.id)) state = 'success'
        else if (effectiveSelectedId === pos.id) state = 'selected'
        else if (value !== null) state = 'placed'

        return (
          <TrailTile
            key={pos.id}
            id={pos.id}
            x={pos.x}
            y={pos.y}
            value={value}
            state={state}
            onClick={onSelectTile}
            disabled={disabled}
            tutorialPulse={tutorialEmptyPulse}
            pathIndex={pos.pathIndex}
          />
        )
      })}
    </BoardContainer>
  )
}
