import type { TileId } from '../types/game'
import type { GameBoard } from '../types/board'
import { getBoardNumericValue } from '../types/board'
import { PATH_ORDER } from './pathLayout'

export type Run = {
  startIndex: number
  endIndex: number
  length: number
  tileIds: TileId[]
  values: number[]
}

export type BreakInfo = {
  pathIndex: number
  afterTileId: TileId
  beforeTileId: TileId
  leftValue: number
  rightValue: number
}

/** 구간 길이별 점수 — index = 길이 (0·1칸 = 0점) */
export const RUN_LENGTH_SCORE_TABLE: readonly number[] = [
  0, 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 80, 96, 115, 135, 160, 190, 225, 265,
  310, 360, 420,
]

export function scoreRun(length: number): number {
  if (length <= 1) return 0
  if (length >= RUN_LENGTH_SCORE_TABLE.length) {
    return RUN_LENGTH_SCORE_TABLE[RUN_LENGTH_SCORE_TABLE.length - 1]!
  }
  return RUN_LENGTH_SCORE_TABLE[length] ?? 0
}

export const RUN_COLORS = [
  '#ffe566', // gold
  '#4ecdc4', // teal
  '#c084fc', // violet
  '#f87171', // rose
  '#60c4f8', // sky
  '#fb923c', // orange
  '#86efac', // green
] as const

export function getRunColor(scoringRunIndex: number): string {
  return RUN_COLORS[scoringRunIndex % RUN_COLORS.length] ?? '#ffe566'
}

export function calculateScore(runs: Run[]): number {
  return runs.reduce((total, run) => total + scoreRun(run.length), 0)
}

/**
 * PATH_ORDER 순서로 numericValue를 추출한다. null/미배치 칸은 비교 시 구간을 끊는다.
 */
export function extractPathValues(board: GameBoard): Array<number | null> {
  return PATH_ORDER.map((id) => getBoardNumericValue(board, id))
}

/**
 * 비내림차순 연속 구간(run)을 PATH_ORDER 기준으로 분할한다.
 * 비교는 numericValue만 사용한다.
 */
export function findNonDecreasingRuns(pathOrder: TileId[], board: GameBoard): Run[] {
  const runs: Run[] = []
  let startIndex = 0

  for (let i = 1; i <= pathOrder.length; i++) {
    const isEnd = i === pathOrder.length
    const previousValue = getBoardNumericValue(board, pathOrder[i - 1]!)
    const currentValue = isEnd ? null : getBoardNumericValue(board, pathOrder[i]!)

    const continues =
      !isEnd && previousValue !== null && currentValue !== null && previousValue <= currentValue

    if (!continues) {
      const tileIds = pathOrder.slice(startIndex, i)
      const values = tileIds
        .map((id) => getBoardNumericValue(board, id))
        .filter((v): v is number => v !== null)

      runs.push({
        startIndex,
        endIndex: i - 1,
        length: tileIds.length,
        tileIds,
        values,
      })

      startIndex = i
    }
  }

  return runs
}

export function findBreaks(pathOrder: TileId[], board: GameBoard): BreakInfo[] {
  const breaks: BreakInfo[] = []

  for (let i = 0; i < pathOrder.length - 1; i++) {
    const afterTileId = pathOrder[i]!
    const beforeTileId = pathOrder[i + 1]!
    const leftValue = getBoardNumericValue(board, afterTileId)
    const rightValue = getBoardNumericValue(board, beforeTileId)

    if (leftValue !== null && rightValue !== null && leftValue > rightValue) {
      breaks.push({
        pathIndex: i,
        afterTileId,
        beforeTileId,
        leftValue,
        rightValue,
      })
    }
  }

  return breaks
}

export function getScoringRuns(runs: Run[]): Run[] {
  return runs.filter((run) => run.length >= 2)
}

export function getSuccessTileIds(runs: Run[]): Set<TileId> {
  const ids = new Set<TileId>()
  for (const run of getScoringRuns(runs)) {
    for (const tileId of run.tileIds) {
      ids.add(tileId)
    }
  }
  return ids
}

export function getTileRunMap(runs: Run[]): Map<TileId, { runIndex: number; run: Run; scoringRunIndex: number }> {
  const map = new Map<TileId, { runIndex: number; run: Run; scoringRunIndex: number }>()
  let scoringCount = 0
  runs.forEach((run, runIndex) => {
    const isScoring = run.length >= 2
    const scoringRunIndex = isScoring ? scoringCount++ : -1
    for (const tileId of run.tileIds) {
      map.set(tileId, { runIndex, run, scoringRunIndex })
    }
  })
  return map
}

export function getLongestRunLength(runs: Run[]): number {
  return runs.reduce((max, run) => Math.max(max, run.length), 0)
}

export function getLiveBoardScore(board: GameBoard): {
  currentScore: number
  longestRunLength: number
} {
  const runs = findNonDecreasingRuns(PATH_ORDER, board)
  return {
    currentScore: calculateScore(runs),
    longestRunLength: getLongestRunLength(runs),
  }
}

export interface GameResult {
  finalScore: number
  runs: Run[]
  scoringRuns: Run[]
  successTileIds: Set<TileId>
  breakAfterTileIds: Set<TileId>
  breaks: BreakInfo[]
  breakCount: number
  longestSegmentLength: number
  nonDecreasingSegmentCount: number
  successTileCount: number
}

export function calculateGameResult(board: GameBoard): GameResult {
  const runs = findNonDecreasingRuns(PATH_ORDER, board)
  const scoringRuns = getScoringRuns(runs)
  const successTileIds = getSuccessTileIds(runs)
  const breaks = findBreaks(PATH_ORDER, board)
  const breakAfterTileIds = new Set(breaks.map((b) => b.afterTileId))
  const finalScore = calculateScore(runs)
  const longestSegmentLength = scoringRuns.reduce((max, run) => Math.max(max, run.length), 0)

  return {
    finalScore,
    runs,
    scoringRuns,
    successTileIds,
    breakAfterTileIds,
    breaks,
    breakCount: breaks.length,
    longestSegmentLength,
    nonDecreasingSegmentCount: scoringRuns.length,
    successTileCount: successTileIds.size,
  }
}

export function formatRunDebugLines(result: GameResult): string[] {
  return result.runs.map((run, index) => `Run ${index + 1}: [${run.values.join(', ')}]`)
}

export function formatBreakDebugLines(result: GameResult): string[] {
  return result.breaks.map(
    (b) => `${b.leftValue} > ${b.rightValue} : break (after tile ${b.afterTileId})`,
  )
}

export { countPlacedTiles } from './placement'
