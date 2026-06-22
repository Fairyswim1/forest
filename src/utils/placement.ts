import type { TileId } from '../types/game'
import type { GameCard } from '../types/card'
import { PATH_ORDER } from './pathLayout'

export function countPlacedTiles(board: Record<TileId, number | null>): number {
  return PATH_ORDER.filter((id) => board[id] !== null).length
}

export function isBoardFull(board: Record<TileId, number | null>): boolean {
  return countPlacedTiles(board) >= PATH_ORDER.length
}

export function createEmptyBoard(): Record<TileId, number | null> {
  return Object.fromEntries(PATH_ORDER.map((id) => [id, null])) as Record<TileId, number | null>
}

export function applyPlacement(
  board: Record<TileId, number | null>,
  tileId: TileId,
  card: GameCard,
): Record<TileId, number | null> {
  return { ...board, [tileId]: card.numericValue }
}

export function hasTemporaryPlacement(
  placement: { tileId: TileId | null; isCommitted: boolean } | null,
): boolean {
  return placement !== null && placement.tileId !== null && !placement.isCommitted
}
