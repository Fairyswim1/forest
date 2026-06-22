import { describe, expect, it } from 'vitest'
import { createEmptyBoard } from './placement'
import { calculateGameResult } from './scoring'
import { buildResultFeedback } from './resultFeedback'

describe('buildResultFeedback', () => {
  it('praises longest scoring trail and explains zero-to-negative breaks', () => {
    const board = createEmptyBoard()
    board[10] = 0
    board[11] = -3
    board[12] = -2
    board[13] = 1

    const result = calculateGameResult(board)
    const messages = buildResultFeedback(result)

    expect(messages.some((m) => m.includes('칸까지 만들었어요'))).toBe(true)
    expect(messages.some((m) => m.includes('0 다음에 더 작은 수'))).toBe(true)
  })

  it('explains negative absolute value ordering', () => {
    const board = createEmptyBoard()
    board[1] = -2
    board[2] = -5
    board[3] = 1

    const result = calculateGameResult(board)
    const messages = buildResultFeedback(result)

    expect(messages.some((m) => m.includes('절댓값'))).toBe(true)
  })
})
