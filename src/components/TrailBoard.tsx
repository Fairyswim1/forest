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
  placingTileId?: TileId | null
  placingValue?: number | null
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
  placingTileId = null,
  placingValue = null,
  className,
}: TrailBoardProps) {
  const positions = useMemo(() => getTilePositions(), [])

  return (
    <BoardContainer className={className}>
      {positions.map((pos) => {
        const value =
          placingTileId === pos.id && placingValue !== null ? placingValue : board[pos.id]
        const effectiveSelectedId = forcedSelectedTileId ?? selectedTileId
        const isPlacing = placingTileId === pos.id && placingValue !== null
        let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
        if (successTileIds.has(pos.id)) state = 'success'
        else if (isPlacing || (effectiveSelectedId === pos.id && value !== null)) state = 'placed'
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
            placing={isPlacing}
          />
        )
      })}
    </BoardContainer>
  )
}
