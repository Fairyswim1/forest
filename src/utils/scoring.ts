import type { TileId } from '../types/game'
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

export function scoreRun(length: number): number {
  if (length <= 1) return 0
  if (length === 2) return 1
  if (length === 3) return 3
  if (length === 4) return 6
  if (length === 5) return 10
  if (length === 6) return 15
  if (length === 7) return 21
  return length * 3
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
 * PATH_ORDER 순서로 값을 추출한다. null/미배치 칸은 비교 시 구간을 끊는다.
 */
export function extractPathValues(board: Record<TileId, number | null>): Array<number | null> {
  return PATH_ORDER.map((id) => board[id] ?? null)
}

/**
 * 비내림차순 연속 구간(run)을 PATH_ORDER 기준으로 분할한다.
 * 각 타일은 정확히 하나의 run에만 속한다.
 */
export function findNonDecreasingRuns(
  pathOrder: TileId[],
  board: Record<TileId, number | null>,
): Run[] {
  const runs: Run[] = []
  let startIndex = 0

  for (let i = 1; i <= pathOrder.length; i++) {
    const isEnd = i === pathOrder.length
    const previousValue = board[pathOrder[i - 1]!] ?? null
    const currentValue = isEnd ? null : (board[pathOrder[i]!] ?? null)

    const continues =
      !isEnd && previousValue !== null && currentValue !== null && previousValue <= currentValue

    if (!continues) {
      const tileIds = pathOrder.slice(startIndex, i)
      const values = tileIds.map((id) => board[id] ?? null).filter((v): v is number => v !== null)

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

export function findBreaks(
  pathOrder: TileId[],
  board: Record<TileId, number | null>,
): BreakInfo[] {
  const breaks: BreakInfo[] = []

  for (let i = 0; i < pathOrder.length - 1; i++) {
    const afterTileId = pathOrder[i]!
    const beforeTileId = pathOrder[i + 1]!
    const leftValue = board[afterTileId]
    const rightValue = board[beforeTileId]

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

export function calculateGameResult(board: Record<TileId, number | null>): GameResult {
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
