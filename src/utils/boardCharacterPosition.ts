import { PATH_ORDER } from './pathLayout'
import type { GameBoard } from '../types/board'
import type { TileId } from '../types/game'

/** 보드 위 캐릭터가 서 있을 타일 — 진행 중 배치 > 임시 선택 > 마지막 확정 칸 > 1번 */
export function resolveCharacterStandTile(
  board: GameBoard,
  options: {
    pendingTileId?: TileId | null
    selectedTileId?: TileId | null
  } = {},
): TileId {
  if (options.pendingTileId) return options.pendingTileId
  if (options.selectedTileId) return options.selectedTileId

  let stand: TileId = 1
  for (const id of PATH_ORDER) {
    if (board[id] !== null) stand = id
  }
  return stand
}
