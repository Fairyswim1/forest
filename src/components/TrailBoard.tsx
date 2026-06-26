import { useMemo } from 'react'
import type { GameBoard } from '../types/board'
import type { TileId } from '../types/game'
import type { StagePathLayout } from '../game/pathLayouts/types'
import { getTilePositions } from '../utils/pathLayout'
import { resolveCharacterStandTile } from '../utils/boardCharacterPosition'
import { BoardContainer } from './BoardContainer'
import { BoardCharacterAvatar } from './board/BoardCharacterAvatar'
import { TrailTile } from './TrailTile'

interface TrailBoardProps {
  layout: StagePathLayout
  board: GameBoard
  selectedTileId: TileId | null
  successTileIds: Set<TileId>
  onSelectTile: (id: TileId) => void
  disabled?: boolean
  tutorialEmptyPulse?: boolean
  forcedSelectedTileId?: TileId | null
  placingTileId?: TileId | null
  placingCell?: GameBoard[TileId]
  className?: string
  characterAssetUrl?: string | null
  characterNickname?: string | null
}

export function TrailBoard({
  layout,
  board,
  selectedTileId,
  successTileIds,
  onSelectTile,
  disabled,
  tutorialEmptyPulse = false,
  forcedSelectedTileId,
  placingTileId = null,
  placingCell = null,
  className,
  characterAssetUrl = null,
  characterNickname = null,
}: TrailBoardProps) {
  const positions = useMemo(() => getTilePositions(layout), [layout])

  const effectiveSelectedId = forcedSelectedTileId ?? selectedTileId
  const characterTileId = useMemo(
    () =>
      resolveCharacterStandTile(board, {
        pendingTileId: placingTileId,
        selectedTileId: effectiveSelectedId,
      }),
    [board, placingTileId, effectiveSelectedId],
  )

  const characterOverlay =
    characterAssetUrl != null ? (
      <BoardCharacterAvatar
        layout={layout}
        tileId={characterTileId}
        assetUrl={characterAssetUrl}
        nickname={characterNickname ?? undefined}
      />
    ) : null

  return (
    <BoardContainer layout={layout} className={className} mapOverlay={characterOverlay}>
      {positions.map((pos) => {
        const effectiveSelectedId = forcedSelectedTileId ?? selectedTileId
        const isPlacing = placingTileId === pos.id && placingCell !== null
        const cell = isPlacing ? placingCell : board[pos.id]

        let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
        if (successTileIds.has(pos.id)) state = 'success'
        else if (isPlacing || (effectiveSelectedId === pos.id && cell !== null)) state = 'placed'
        else if (effectiveSelectedId === pos.id) state = 'selected'
        else if (cell !== null) state = 'placed'

        return (
          <TrailTile
            key={pos.id}
            id={pos.id}
            x={pos.x}
            y={pos.y}
            cell={cell}
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
