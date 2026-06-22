import type { TileId } from '../types/game'
import { PATH_ORDER } from './pathLayout'

/** 성공 타일 1칸당 획득 점수 */
export const SCORE_POINTS_PER_SUCCESS_TILE = 10

export interface ScoreResult {
  score: number
  successTileIds: Set<TileId>
  segments: Array<{ start: TileId; end: TileId; length: number }>
}

export interface GameResult {
  /** 표시용 최종 점수 (성공 타일 수 × 배율) */
  finalScore: number
  /** 비내림차순 구간에 포함된 타일 수 */
  successTileCount: number
  /** 가장 긴 비내림차순 구간 길이 */
  longestSegmentLength: number
  successTileIds: Set<TileId>
  segments: ScoreResult['segments']
  /** 경로상 비내림이 끊기는 직전 타일 id */
  breakAfterTileIds: Set<TileId>
}

export function calculateScore(board: Record<TileId, number | null>): ScoreResult {
  const values = PATH_ORDER.map((id) => board[id] ?? null)
  const successTileIds = new Set<TileId>()
  const segments: ScoreResult['segments'] = []

  let i = 0
  while (i < values.length) {
    let j = i
    while (j + 1 < values.length && values[j] !== null && values[j + 1] !== null && values[j]! <= values[j + 1]!) {
      j++
    }

    const length = j - i + 1
    if (length >= 2) {
      for (let k = i; k <= j; k++) {
        successTileIds.add(PATH_ORDER[k])
      }
      segments.push({ start: PATH_ORDER[i], end: PATH_ORDER[j], length })
    }

    i = j + 1
  }

  const score = successTileIds.size * SCORE_POINTS_PER_SUCCESS_TILE
  return { score, successTileIds, segments }
}

export function findBreakAfterTileIds(board: Record<TileId, number | null>): Set<TileId> {
  const breaks = new Set<TileId>()
  const values = PATH_ORDER.map((id) => board[id] ?? null)

  for (let i = 0; i < values.length - 1; i++) {
    const a = values[i]
    const b = values[i + 1]
    if (a !== null && b !== null && a > b) {
      breaks.add(PATH_ORDER[i])
    }
  }

  return breaks
}

export function calculateGameResult(board: Record<TileId, number | null>): GameResult {
  const { successTileIds, segments } = calculateScore(board)
  const successTileCount = successTileIds.size
  const longestSegmentLength = segments.reduce((max, seg) => Math.max(max, seg.length), 0)
  const finalScore = successTileCount * SCORE_POINTS_PER_SUCCESS_TILE
  const breakAfterTileIds = findBreakAfterTileIds(board)

  return {
    finalScore,
    successTileCount,
    longestSegmentLength,
    successTileIds,
    segments,
    breakAfterTileIds,
  }
}

export function countPlacedTiles(board: Record<TileId, number | null>): number {
  return PATH_ORDER.filter((id) => board[id] !== null).length
}
