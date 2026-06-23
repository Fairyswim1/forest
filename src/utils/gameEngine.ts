import {
  PLACEMENT_ANIMATION_MS,
  TURN_SECONDS,
  TOTAL_ROUNDS,
  type CardPhase,
  type CurrentTurnPlacement,
  type GamePhase,
  type PendingPlacement,
  type TileId,
} from '../types/game'
import type { GameBoard } from '../types/board'
import type { GameCard } from '../types/card'
import type { StageConfig } from '../types/stage'
import {
  applyPlacement,
  countPlacedTiles,
  createEmptyBoard,
  getAutoPlacementTileId,
  hasTemporaryPlacement,
  isBoardFull,
} from './placement'
import { calculateGameResult, type GameResult } from './scoring'
import { resetTurnTimer } from './undo'

export { PLACEMENT_ANIMATION_MS }
export type { CurrentTurnPlacement }

export interface GameState {
  phase: GamePhase
  round: number
  deck: GameCard[]
  board: GameBoard
  currentCard: GameCard | null
  cardPhase: CardPhase
  currentTurnPlacement: CurrentTurnPlacement | null
  pendingPlacement: PendingPlacement | null
  timeLeft: number
  turnWarning: boolean
  lastCommittedTileId: TileId | null
  score: number
  successTileIds: Set<TileId>
  gameResult: GameResult | null
  stageId: string | null
}

export type GameAction =
  | { type: 'START_GAME'; stage: StageConfig }
  | { type: 'CARD_TO_CENTER' }
  | { type: 'CARD_TO_PANEL' }
  | { type: 'PLACE_ON_TILE'; tileId: TileId }
  | { type: 'COMPLETE_PLACE_ANIMATION' }
  | { type: 'RESET_CURRENT_PLACEMENT' }
  | { type: 'COMMIT_TURN' }
  | { type: 'TICK' }

export const gameInitialState: GameState = {
  phase: 'intro',
  round: 0,
  deck: [],
  board: createEmptyBoard(),
  currentCard: null,
  cardPhase: 'hidden',
  currentTurnPlacement: null,
  pendingPlacement: null,
  timeLeft: TURN_SECONDS,
  turnWarning: false,
  lastCommittedTileId: null,
  score: 0,
  successTileIds: new Set(),
  gameResult: null,
  stageId: null,
}

export function getCardForRound(deck: GameCard[], round: number): GameCard | null {
  return deck[round - 1] ?? null
}

export function getDisplayBoard(state: GameState): GameBoard {
  const display = { ...state.board }

  if (state.pendingPlacement) {
    const { tileId, card } = state.pendingPlacement
    display[tileId] = {
      displayValue: card.displayValue,
      numericValue: card.numericValue,
    }
    return display
  }

  if (hasTemporaryPlacement(state.currentTurnPlacement)) {
    const card = getCardForRound(state.deck, state.round)
    if (card && state.currentTurnPlacement?.tileId) {
      display[state.currentTurnPlacement.tileId] = {
        displayValue: card.displayValue,
        numericValue: card.numericValue,
      }
    }
  }

  return display
}

export function canCommitTurn(state: GameState): boolean {
  return (
    state.phase === 'playing' &&
    state.cardPhase === 'panel' &&
    hasTemporaryPlacement(state.currentTurnPlacement)
  )
}

export function canPlaceOnTile(state: GameState, tileId: TileId): boolean {
  if (state.phase !== 'playing' || state.cardPhase !== 'panel' || !state.currentCard) return false
  if (state.board[tileId] !== null) return false
  if (state.currentTurnPlacement?.tileId === tileId) return false
  return true
}

function createTurnPlacement(card: GameCard, tileId: TileId | null): CurrentTurnPlacement {
  return { cardId: card.id, tileId, isCommitted: false }
}

function commitTurn(state: GameState): GameState {
  const tileId = state.currentTurnPlacement?.tileId
  const card = state.currentCard

  if (!tileId || !card) {
    return { ...state, timeLeft: 0, turnWarning: true }
  }

  const board = applyPlacement(state.board, tileId, card)

  if (state.round >= TOTAL_ROUNDS || isBoardFull(board)) {
    const gameResult = calculateGameResult(board)
    return {
      ...state,
      board,
      currentTurnPlacement: { cardId: card.id, tileId, isCommitted: true },
      currentCard: null,
      pendingPlacement: null,
      cardPhase: 'hidden',
      phase: 'finished',
      score: gameResult.finalScore,
      successTileIds: gameResult.successTileIds,
      gameResult,
      turnWarning: false,
      lastCommittedTileId: tileId,
    }
  }

  return {
    ...state,
    board,
    currentTurnPlacement: null,
    currentCard: null,
    pendingPlacement: null,
    cardPhase: 'hidden',
    round: state.round + 1,
    timeLeft: resetTurnTimer(),
    turnWarning: false,
    lastCommittedTileId: tileId,
  }
}

function autoPlaceAndCommitTurn(state: GameState): GameState {
  const tileId = getAutoPlacementTileId(state.board)
  const card = state.currentCard

  if (!tileId || !card || state.board[tileId] !== null) {
    return { ...state, timeLeft: 0, turnWarning: true }
  }

  return commitTurn({
    ...state,
    timeLeft: 0,
    turnWarning: false,
    currentTurnPlacement: createTurnPlacement(card, tileId),
  })
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...gameInitialState,
        phase: 'playing',
        deck: action.stage.cardGenerator(action.stage.deckSize),
        board: createEmptyBoard(),
        round: 1,
        currentCard: null,
        cardPhase: 'hidden',
        lastCommittedTileId: null,
        stageId: action.stage.id,
      }

    case 'CARD_TO_CENTER': {
      if (state.round > TOTAL_ROUNDS || state.phase !== 'playing') return state
      const card = getCardForRound(state.deck, state.round)
      if (!card) return state
      return {
        ...state,
        currentCard: card,
        cardPhase: 'center',
        currentTurnPlacement: createTurnPlacement(card, null),
        pendingPlacement: null,
        timeLeft: resetTurnTimer(),
        turnWarning: false,
      }
    }

    case 'CARD_TO_PANEL': {
      const card = state.currentCard ?? getCardForRound(state.deck, state.round)
      return {
        ...state,
        cardPhase: 'panel',
        currentTurnPlacement: card ? createTurnPlacement(card, null) : null,
      }
    }

    case 'PLACE_ON_TILE': {
      if (!canPlaceOnTile(state, action.tileId) || !state.currentCard) return state
      return {
        ...state,
        cardPhase: 'placing',
        turnWarning: false,
        pendingPlacement: { tileId: action.tileId, card: state.currentCard },
        currentTurnPlacement: createTurnPlacement(state.currentCard, null),
      }
    }

    case 'COMPLETE_PLACE_ANIMATION': {
      if (!state.pendingPlacement || state.cardPhase !== 'placing') return state
      const { tileId, card } = state.pendingPlacement
      return {
        ...state,
        cardPhase: 'panel',
        pendingPlacement: null,
        currentTurnPlacement: createTurnPlacement(card, tileId),
      }
    }

    case 'RESET_CURRENT_PLACEMENT': {
      if (!hasTemporaryPlacement(state.currentTurnPlacement) || !state.currentCard) return state
      return {
        ...state,
        currentTurnPlacement: createTurnPlacement(state.currentCard, null),
        pendingPlacement: null,
        cardPhase: 'panel',
      }
    }

    case 'COMMIT_TURN':
      if (!canCommitTurn(state)) return state
      return commitTurn(state)

    case 'TICK': {
      if (state.phase !== 'playing' || state.cardPhase !== 'panel') return state
      if (state.timeLeft <= 0) return state
      if (state.timeLeft > 1) return { ...state, timeLeft: state.timeLeft - 1 }
      const expired = { ...state, timeLeft: 0 }
      if (hasTemporaryPlacement(expired.currentTurnPlacement)) return commitTurn(expired)
      return autoPlaceAndCommitTurn(expired)
    }

    default:
      return state
  }
}

export function advanceThroughCardReveal(state: GameState): GameState {
  return gameReducer(gameReducer(state, { type: 'CARD_TO_CENTER' }), { type: 'CARD_TO_PANEL' })
}

export function placeOnTileAndComplete(state: GameState, tileId: TileId): GameState {
  let next = gameReducer(state, { type: 'PLACE_ON_TILE', tileId })
  next = gameReducer(next, { type: 'COMPLETE_PLACE_ANIMATION' })
  return next
}

export { countPlacedTiles }
