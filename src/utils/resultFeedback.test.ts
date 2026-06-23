import { describe, expect, it } from 'vitest'
import { createEmptyBoard } from './placement'
import { calculateGameResult } from './scoring'
import { buildResultFeedback, integerFeedback, naturalFeedback } from './resultFeedback'

function cell(numeric: number, displayValue = String(numeric)) {
  return { displayValue, numericValue: numeric }
}

describe('buildResultFeedback', () => {
  it('praises longest scoring trail and explains zero-to-negative breaks', () => {
    const board = createEmptyBoard()
    board[10] = cell(0)
    board[11] = cell(-3)
    board[12] = cell(-2)
    board[13] = cell(1)

    const result = calculateGameResult(board)
    const messages = buildResultFeedback(result, integerFeedback)

    expect(messages.some((m) => m.includes('칸까지 만들었어요'))).toBe(true)
    expect(messages.some((m) => m.includes('0 다음에 음수'))).toBe(true)
  })

  it('explains negative absolute value ordering', () => {
    const board = createEmptyBoard()
    board[1] = cell(-2)
    board[2] = cell(-5)
    board[3] = cell(1)

    const result = calculateGameResult(board)
    const messages = buildResultFeedback(result, integerFeedback)

    expect(messages.some((m) => m.includes('절댓값'))).toBe(true)
  })

  it('natural feedback stays free of integer-only wording', () => {
    const board = createEmptyBoard()
    board[1] = cell(5)
    board[2] = cell(3)

    const result = calculateGameResult(board)
    const messages = buildResultFeedback(result, naturalFeedback)

    expect(messages.some((m) => m.includes('보다 작은 수'))).toBe(true)
    expect(messages.every((m) => !m.includes('절댓값') && !m.includes('음수'))).toBe(true)
  })
})
