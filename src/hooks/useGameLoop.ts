import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { TOTAL_ROUNDS, type TileId } from '../types/game'
import { gameCardToCardValue, getCardDisplayLabel } from '../types/card'
import type { StageConfig } from '../types/stage'
import {
  PLACEMENT_ANIMATION_MS,
  canCommitTurn,
  gameInitialState,
  gameReducer,
  getDisplayBoard,
} from '../utils/gameEngine'
import { countPlacedTiles, hasTemporaryPlacement } from '../utils/placement'
import { canResetCurrentPlacement } from '../utils/undo'

export function useGameLoop(stage: StageConfig, paused = false) {
  const [state, dispatch] = useReducer(gameReducer, gameInitialState)

  const startGame = useCallback(
    () => dispatch({ type: 'START_GAME', stage }),
    [stage],
  )

  const revealCurrentCard = useCallback(() => {
    dispatch({ type: 'CARD_TO_CENTER' })
  }, [])

  const completeCardReveal = useCallback(() => dispatch({ type: 'CARD_TO_PANEL' }), [])

  useEffect(() => {
    if (paused) return
    if (state.phase === 'playing' && state.cardPhase === 'hidden' && state.round <= TOTAL_ROUNDS) {
      revealCurrentCard()
    }
  }, [paused, state.phase, state.cardPhase, state.round, revealCurrentCard])

  useEffect(() => {
    if (paused) return
    if (state.cardPhase !== 'placing') return
    const id = window.setTimeout(
      () => dispatch({ type: 'COMPLETE_PLACE_ANIMATION' }),
      PLACEMENT_ANIMATION_MS,
    )
    return () => window.clearTimeout(id)
  }, [paused, state.cardPhase, state.pendingPlacement])

  useEffect(() => {
    if (paused) return
    if (state.phase !== 'playing' || state.cardPhase !== 'panel') return
    if (state.timeLeft <= 0 && state.turnWarning) return
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(id)
  }, [paused, state.phase, state.cardPhase, state.timeLeft, state.turnWarning])

  const placeOnTile = useCallback(
    (tileId: TileId) => dispatch({ type: 'PLACE_ON_TILE', tileId }),
    [],
  )
  const resetCurrentPlacement = useCallback(
    () => dispatch({ type: 'RESET_CURRENT_PLACEMENT' }),
    [],
  )
  const confirmTurn = useCallback(() => dispatch({ type: 'COMMIT_TURN' }), [])

  const placedCount = useMemo(() => countPlacedTiles(state.board), [state.board])
  const displayBoard = useMemo(() => getDisplayBoard(state), [state])

  const displayCardLabel = useMemo(() => {
    if (state.cardPhase !== 'panel' || !state.currentCard) return undefined
    if (hasTemporaryPlacement(state.currentTurnPlacement)) return undefined
    return getCardDisplayLabel(state.currentCard)
  }, [state.cardPhase, state.currentCard, state.currentTurnPlacement])

  const revealCardLabel = useMemo(() => {
    if (state.cardPhase !== 'center' || !state.currentCard) return undefined
    return getCardDisplayLabel(state.currentCard)
  }, [state.cardPhase, state.currentCard])

  const placingCardLabel = useMemo(() => {
    if (state.cardPhase !== 'placing' || !state.pendingPlacement) return undefined
    return getCardDisplayLabel(state.pendingPlacement.card)
  }, [state.cardPhase, state.pendingPlacement])

  const displayCardValue = useMemo(() => {
    if (state.cardPhase !== 'panel' || !state.currentCard) return null
    if (hasTemporaryPlacement(state.currentTurnPlacement)) return null
    return gameCardToCardValue(state.currentCard)
  }, [state.cardPhase, state.currentCard, state.currentTurnPlacement])

  const revealCardValue = useMemo(() => {
    if (state.cardPhase !== 'center' || !state.currentCard) return null
    return gameCardToCardValue(state.currentCard)
  }, [state.cardPhase, state.currentCard])

  const placingCardValue = useMemo(() => {
    if (state.cardPhase !== 'placing' || !state.pendingPlacement) return null
    return gameCardToCardValue(state.pendingPlacement.card)
  }, [state.cardPhase, state.pendingPlacement])

  const canResetPlacement = useMemo(
    () => canResetCurrentPlacement(state.currentTurnPlacement, state.phase, state.cardPhase),
    [state.currentTurnPlacement, state.phase, state.cardPhase],
  )
  const canCommit = useMemo(() => canCommitTurn(state), [state])

  return {
    ...state,
    placedCount,
    displayBoard,
    displayCardValue,
    displayCardLabel,
    revealCardValue,
    revealCardLabel,
    placingCardValue,
    placingCardLabel,
    canResetPlacement,
    canCommit,
    startGame,
    placeOnTile,
    resetCurrentPlacement,
    confirmTurn,
    completeCardReveal,
  }
}
