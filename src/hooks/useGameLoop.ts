import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  TURN_SECONDS,
  TOTAL_ROUNDS,
  TOTAL_TILES,
  type CardPhase,
  type GamePhase,
  type HistoryEntry,
  type TileId,
} from '../types/game'
import { createDeck } from '../utils/deck'
import { calculateGameResult, countPlacedTiles, type GameResult } from '../utils/scoring'

interface GameState {
  phase: GamePhase
  round: number
  deck: number[]
  board: Record<TileId, number | null>
  selectedTileId: TileId | null
  currentCard: number | null
  cardPhase: CardPhase
  timeLeft: number
  score: number
  successTileIds: Set<TileId>
  gameResult: GameResult | null
  history: HistoryEntry[]
}

type Action =
  | { type: 'START_GAME' }
  | { type: 'CARD_TO_CENTER' }
  | { type: 'CARD_TO_PANEL' }
  | { type: 'SELECT_TILE'; tileId: TileId }
  | { type: 'CONFIRM_PLACEMENT' }
  | { type: 'UNDO' }
  | { type: 'TICK' }
  | { type: 'FINISH_SCORING'; score: number; successTileIds: Set<TileId> }

const emptyBoard = (): Record<TileId, number | null> =>
  Object.fromEntries(Array.from({ length: TOTAL_TILES }, (_, i) => [i + 1, null])) as Record<
    TileId,
    number | null
  >

const initialState: GameState = {
  phase: 'intro',
  round: 0,
  deck: [],
  board: emptyBoard(),
  selectedTileId: null,
  currentCard: null,
  cardPhase: 'hidden',
  timeLeft: TURN_SECONDS,
  score: 0,
  successTileIds: new Set(),
  gameResult: null,
  history: [],
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'playing',
        deck: createDeck(),
        round: 1,
        currentCard: null,
        cardPhase: 'hidden',
      }

    case 'CARD_TO_CENTER':
      if (state.round > TOTAL_ROUNDS) return state
      return {
        ...state,
        currentCard: state.deck[state.round - 1] ?? null,
        cardPhase: 'center',
        selectedTileId: null,
        timeLeft: TURN_SECONDS,
      }

    case 'CARD_TO_PANEL':
      return { ...state, cardPhase: 'panel' }

    case 'SELECT_TILE': {
      if (state.cardPhase !== 'panel' || state.board[action.tileId] !== null) return state
      return { ...state, selectedTileId: action.tileId }
    }

    case 'CONFIRM_PLACEMENT': {
      if (state.selectedTileId === null || state.currentCard === null || state.cardPhase !== 'panel') return state
      const tileId = state.selectedTileId
      const value = state.currentCard
      const board = { ...state.board, [tileId]: value }
      const historyEntry: HistoryEntry = {
        round: state.round,
        tileId,
        value,
        board: { ...state.board },
      }
      const placed = countPlacedTiles(board)
      const nextRound = state.round + 1

      if (placed >= TOTAL_ROUNDS) {
        const gameResult = calculateGameResult(board)
        return {
          ...state,
          board,
          history: [...state.history, historyEntry],
          selectedTileId: null,
          currentCard: null,
          cardPhase: 'hidden',
          phase: 'finished',
          score: gameResult.finalScore,
          successTileIds: gameResult.successTileIds,
          gameResult,
        }
      }

      return {
        ...state,
        board,
        history: [...state.history, historyEntry],
        selectedTileId: null,
        currentCard: null,
        cardPhase: 'hidden',
        round: nextRound,
      }
    }

    case 'UNDO': {
      if (state.history.length === 0 || state.phase === 'finished') return state
      const last = state.history[state.history.length - 1]
      const history = state.history.slice(0, -1)
      return {
        ...state,
        board: { ...last.board },
        history,
        round: last.round,
        selectedTileId: last.tileId,
        currentCard: last.value,
        cardPhase: 'panel',
        phase: 'playing',
        score: 0,
        successTileIds: new Set(),
        gameResult: null,
        timeLeft: TURN_SECONDS,
      }
    }

    case 'TICK':
      if (state.phase !== 'playing' || state.cardPhase !== 'panel') return state
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) }

    case 'FINISH_SCORING':
      return { ...state, score: action.score, successTileIds: action.successTileIds }

    default:
      return state
  }
}

export function useGameLoop() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const revealTimer = useRef<number | null>(null)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])

  const revealCurrentCard = useCallback(() => {
    dispatch({ type: 'CARD_TO_CENTER' })
    if (revealTimer.current) window.clearTimeout(revealTimer.current)
    revealTimer.current = window.setTimeout(() => dispatch({ type: 'CARD_TO_PANEL' }), 800)
  }, [])

  useEffect(() => {
    if (state.phase === 'playing' && state.cardPhase === 'hidden' && state.round <= TOTAL_ROUNDS) {
      revealCurrentCard()
    }
  }, [state.phase, state.cardPhase, state.round, revealCurrentCard])

  useEffect(() => {
    if (state.phase !== 'playing' || state.cardPhase !== 'panel') return
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(id)
  }, [state.phase, state.cardPhase])

  useEffect(() => () => {
    if (revealTimer.current) window.clearTimeout(revealTimer.current)
  }, [])

  const selectTile = useCallback((tileId: TileId) => dispatch({ type: 'SELECT_TILE', tileId }), [])
  const confirmPlacement = useCallback(() => dispatch({ type: 'CONFIRM_PLACEMENT' }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])

  const placedCount = useMemo(() => countPlacedTiles(state.board), [state.board])

  return {
    ...state,
    placedCount,
    startGame,
    selectTile,
    confirmPlacement,
    undo,
  }
}
