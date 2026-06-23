import type { TileId } from '../types/game'
import type { GameBoard } from '../types/board'
import type { GameCard } from '../types/card'
import { PATH_ORDER } from './pathLayout'

export function countPlacedTiles(board: GameBoard): number {
  return PATH_ORDER.filter((id) => board[id] !== null).length
}

export function isBoardFull(board: GameBoard): boolean {
  return countPlacedTiles(board) >= PATH_ORDER.length
}

export function createEmptyBoard(): GameBoard {
  return Object.fromEntries(PATH_ORDER.map((id) => [id, null])) as GameBoard
}

export function applyPlacement(board: GameBoard, tileId: TileId, card: GameCard): GameBoard {
  return {
    ...board,
    [tileId]: {
      displayValue: card.displayValue,
      numericValue: card.numericValue,
    },
  }
}

export function hasTemporaryPlacement(
  placement: { tileId: TileId | null; isCommitted: boolean } | null,
): boolean {
  return placement !== null && placement.tileId !== null && !placement.isCommitted
}

/** 시간 초과 자동 배치 — PATH_ORDER 끝(23번)부터 역순으로 첫 빈 칸 */
export function getAutoPlacementTileId(board: GameBoard): TileId | null {
  for (let i = PATH_ORDER.length - 1; i >= 0; i--) {
    const id = PATH_ORDER[i]!
    if (board[id] === null) return id
  }
  return null
}
