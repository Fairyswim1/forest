import { describe, expect, it } from 'vitest'
import type { GameBoard } from '../types/board'
import { createEmptyBoard } from './placement'
import {
  calculateGameResult,
  calculateScore,
  findBreaks,
  findNonDecreasingRuns,
  getSuccessTileIds,
  scoreRun,
} from './scoring'
import { PATH_ORDER } from './pathLayout'

function cell(numeric: number, displayValue = String(numeric)) {
  return { displayValue, numericValue: numeric }
}

function fillBoard(values: number[]): GameBoard {
  const board = createEmptyBoard()
  PATH_ORDER.forEach((id, index) => {
    board[id] = cell(values[index] ?? 0)
  })
  return board
}

describe('findNonDecreasingRuns', () => {
  it('splits at 13 > -15 on consecutive path tiles', () => {
    const board = createEmptyBoard()
    PATH_ORDER.forEach((id) => {
      board[id] = cell(0)
    })
    board[10] = cell(-17)
    board[11] = cell(13)
    board[12] = cell(-15)
    board[13] = cell(-14)

    const runs = findNonDecreasingRuns(PATH_ORDER, board)
    const runWith13 = runs.find((run) => run.values.includes(13))
    const runWithNeg15 = runs.find((run) => run.values.includes(-15))

    expect(runWith13?.values).toEqual([-17, 13])
    expect(runWithNeg15?.values[0]).toBe(-15)
    expect(runWithNeg15?.values[1]).toBe(-14)
    expect(runWith13).not.toBe(runWithNeg15)
    expect(runWith13?.values.includes(-15)).toBe(false)

    const breaks = findBreaks(PATH_ORDER, board)
    expect(breaks.some((b) => b.leftValue === 13 && b.rightValue === -15)).toBe(true)
  })

  it('assigns each tile to exactly one run', () => {
    const board = fillBoard(PATH_ORDER.map((_, i) => i - 5))
    const runs = findNonDecreasingRuns(PATH_ORDER, board)
    const seen = new Set<number>()

    for (const run of runs) {
      for (const tileId of run.tileIds) {
        expect(seen.has(tileId)).toBe(false)
        seen.add(tileId)
      }
    }

    expect(seen.size).toBe(PATH_ORDER.length)
  })

  it('includes length-1 runs with zero score', () => {
    const board = createEmptyBoard()
    board[1] = cell(5)
    board[2] = cell(3)

    const runs = findNonDecreasingRuns(PATH_ORDER, board)
    expect(runs[0]?.values).toEqual([5])
    expect(runs[1]?.values).toEqual([3])
    expect(calculateScore(runs)).toBe(0)
  })
})

describe('findBreaks', () => {
  it('marks only previous > current boundaries', () => {
    const board = createEmptyBoard()
    board[10] = cell(-17)
    board[11] = cell(13)
    board[12] = cell(-15)
    board[13] = cell(-14)
    board[14] = cell(-14)

    const breaks = findBreaks(PATH_ORDER, board)
    expect(breaks.map((b) => `${b.leftValue} > ${b.rightValue}`)).toContain('13 > -15')
    expect(breaks.some((b) => b.leftValue === -15 && b.rightValue === -14)).toBe(false)
  })
})

describe('scoreRun', () => {
  it('matches the score table', () => {
    expect(scoreRun(1)).toBe(0)
    expect(scoreRun(2)).toBe(1)
    expect(scoreRun(8)).toBe(28)
    expect(scoreRun(23)).toBe(420)
  })
})

describe('calculateGameResult', () => {
  it('derives stats from the same run array', () => {
    const board = createEmptyBoard()
    PATH_ORDER.forEach((id) => {
      board[id] = cell(0)
    })
    board[10] = cell(-17)
    board[11] = cell(13)
    board[12] = cell(-15)
    board[13] = cell(-14)
    board[14] = cell(0)

    const result = calculateGameResult(board)

    const runWith13 = result.runs.find((run) => run.values.includes(13))
    const runWithNeg15 = result.runs.find((run) => run.values.includes(-15))

    expect(runWith13?.values).toEqual([-17, 13])
    expect(runWithNeg15?.values[0]).toBe(-15)
    expect(runWith13).not.toBe(runWithNeg15)
    expect(result.breaks.some((b) => b.leftValue === 13 && b.rightValue === -15)).toBe(true)
    expect(result.successTileIds.has(11)).toBe(true)
    expect(result.successTileIds.has(12)).toBe(true)
    expect(runWith13?.tileIds.includes(12)).toBe(false)
    expect(result.finalScore).toBe(calculateScore(result.runs))
    expect(result.successTileIds).toEqual(getSuccessTileIds(result.runs))
  })

  it('scores monotonic full board as one long segment', () => {
    const board = fillBoard(PATH_ORDER.map((_, index) => index + 1))
    const result = calculateGameResult(board)

    expect(result.longestSegmentLength).toBe(23)
    expect(result.nonDecreasingSegmentCount).toBe(1)
    expect(result.breakCount).toBe(0)
    expect(result.finalScore).toBe(420)
  })
})
