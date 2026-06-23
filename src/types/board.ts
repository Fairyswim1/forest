import type { TileId } from './game'

/** 보드 타일에 확정된 카드 표시/비교 값 */
export interface BoardCell {
  displayValue: string
  numericValue: number
}

export type GameBoard = Record<TileId, BoardCell | null>

export function getBoardNumericValue(board: GameBoard, tileId: TileId): number | null {
  return board[tileId]?.numericValue ?? null
}

export function toNumericBoard(board: GameBoard): Record<TileId, number | null> {
  const entries = Object.entries(board).map(([id, cell]) => [
    Number(id),
    cell?.numericValue ?? null,
  ])
  return Object.fromEntries(entries) as Record<TileId, number | null>
}
