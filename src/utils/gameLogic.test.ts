import { describe, expect, it } from 'vitest'
import { TOTAL_ROUNDS, TOTAL_TILES } from '../types/game'
import { NATURAL_1_1 } from '../config/stages'
import { createDeck } from './deck'
import { createEmptyBoard, countPlacedTiles } from './placement'
import { scoreForSegmentLength } from './segmentScore'
import { calculateGameResult } from './scoring'
import { PATH_ORDER } from './pathLayout'
import {
  advanceThroughCardReveal,
  gameInitialState,
  gameReducer,
  getCardForRound,
  getDisplayBoard,
  placeOnTileAndComplete,
} from './gameEngine'

describe('createDeck', () => {
  it('generates exactly 23 cards with ids and integer values in range', () => {
    const deck = createDeck()
    expect(deck).toHaveLength(TOTAL_ROUNDS)

    for (const card of deck) {
      expect(card.id).toMatch(/^card-\d{2}$/)
      expect(card.numericValue).toBeGreaterThanOrEqual(-20)
      expect(card.numericValue).toBeLessThanOrEqual(20)
    }
  })
})

describe('scoreForSegmentLength', () => {
  it('uses the configured score table', () => {
    expect(scoreForSegmentLength(1)).toBe(0)
    expect(scoreForSegmentLength(2)).toBe(1)
    expect(scoreForSegmentLength(8)).toBe(28)
    expect(scoreForSegmentLength(23)).toBe(420)
  })
})

describe('instant placement flow', () => {
  function startRound(state: ReturnType<typeof gameReducer>) {
    return advanceThroughCardReveal(state)
  }

  it('places on click, resets only current turn, repositions, commits, and advances', () => {
    let state = gameReducer(gameInitialState, { type: 'START_GAME', stage: NATURAL_1_1 })
    const deckSnapshot = state.deck.map((c) => ({ ...c }))

    state = startRound(state)
    state = placeOnTileAndComplete(state, 1)

    expect(getDisplayBoard(state)[1]).not.toBeNull()
    expect(state.board[1]).toBeNull()
    expect(state.currentTurnPlacement?.tileId).toBe(1)
    expect(state.round).toBe(1)

    state = gameReducer(state, { type: 'RESET_CURRENT_PLACEMENT' })
    expect(getDisplayBoard(state)[1]).toBeNull()
    expect(state.currentTurnPlacement?.tileId).toBeNull()
    expect(state.round).toBe(1)
    expect(getCardForRound(state.deck, state.round)?.id).toBe(deckSnapshot[0]?.id)

    state = placeOnTileAndComplete(state, 1)
    state = placeOnTileAndComplete(state, 2)
    expect(state.currentTurnPlacement?.tileId).toBe(2)
    expect(getDisplayBoard(state)[1]).toBeNull()
    expect(getDisplayBoard(state)[2]).not.toBeNull()

    state = gameReducer(state, { type: 'COMMIT_TURN' })
    expect(state.board[2]).not.toBeNull()
    expect(state.board[1]).toBeNull()
    expect(state.round).toBe(2)

    const committedRound1 = { ...state.board }

    state = startRound(state)
    state = placeOnTileAndComplete(state, 3)
    state = gameReducer(state, { type: 'RESET_CURRENT_PLACEMENT' })

    expect(state.board).toEqual(committedRound1)
    expect(state.board[2]).not.toBeNull()
    expect(state.round).toBe(2)

    state = placeOnTileAndComplete(state, 4)
    state = gameReducer(state, { type: 'COMMIT_TURN' })
    expect(state.round).toBe(3)
  })

  it('auto-places when time expires without manual placement', () => {
    let state = startRound(
      gameReducer(gameInitialState, { type: 'START_GAME', stage: NATURAL_1_1 }),
    )

    for (let t = 0; t < 24; t++) {
      state = gameReducer(state, { type: 'TICK' })
    }

    expect(state.round).toBe(2)
    expect(state.board[23]).not.toBeNull()
  })

  it('finishes after 23 committed turns', () => {
    let state = gameReducer(gameInitialState, { type: 'START_GAME', stage: NATURAL_1_1 })

    for (let round = 1; round <= TOTAL_TILES; round++) {
      state = startRound(state)
      state = placeOnTileAndComplete(state, round)
      state = gameReducer(state, { type: 'COMMIT_TURN' })
    }

    expect(state.phase).toBe('finished')
    expect(countPlacedTiles(state.board)).toBe(23)
    expect(state.gameResult).not.toBeNull()
  })
})

describe('calculateGameResult', () => {
  it('scores monotonic full board as one long segment', () => {
    const board = createEmptyBoard()
    PATH_ORDER.forEach((id, index) => {
      const value = index + 1
      board[id] = { displayValue: String(value), numericValue: value }
    })

    const result = calculateGameResult(board)
    expect(result.longestSegmentLength).toBe(23)
    expect(result.finalScore).toBe(420)
  })
})
