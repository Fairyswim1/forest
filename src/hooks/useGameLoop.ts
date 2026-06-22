import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { TOTAL_ROUNDS, type TileId } from '../types/game'
import { gameCardToCardValue } from '../types/card'
import {
  PLACEMENT_ANIMATION_MS,
  canCommitTurn,
  gameInitialState,
  gameReducer,
  getDisplayBoard,
} from '../utils/gameEngine'
import { countPlacedTiles, hasTemporaryPlacement } from '../utils/placement'
import { canResetCurrentPlacement } from '../utils/undo'

export function useGameLoop() {
  const [state, dispatch] = useReducer(gameReducer, gameInitialState)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])

  const revealCurrentCard = useCallback(() => {
    dispatch({ type: 'CARD_TO_CENTER' })
  }, [])

  const completeCardReveal = useCallback(() => dispatch({ type: 'CARD_TO_PANEL' }), [])

  useEffect(() => {
    if (state.phase === 'playing' && state.cardPhase === 'hidden' && state.round <= TOTAL_ROUNDS) {
      revealCurrentCard()
    }
  }, [state.phase, state.cardPhase, state.round, revealCurrentCard])

  useEffect(() => {
    if (state.cardPhase !== 'placing') return
    const id = window.setTimeout(
      () => dispatch({ type: 'COMPLETE_PLACE_ANIMATION' }),
      PLACEMENT_ANIMATION_MS,
    )
    return () => window.clearTimeout(id)
  }, [state.cardPhase, state.pendingPlacement])

  useEffect(() => {
    if (state.phase !== 'playing' || state.cardPhase !== 'panel') return
    if (state.timeLeft <= 0 && state.turnWarning) return
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(id)
  }, [state.phase, state.cardPhase, state.timeLeft, state.turnWarning])

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

  const displayCardValue = useMemo(() => {
    if (state.cardPhase !== 'panel' || !state.currentCard) return null
    if (hasTemporaryPlacement(state.currentTurnPlacement)) return null
    return gameCardToCardValue(state.currentCard)
  }, [state.cardPhase, state.currentCard, state.currentTurnPlacement])

  const revealCardValue = useMemo(() => {
    if (state.cardPhase !== 'center' || !state.currentCard) return null
    return gameCardToCardValue(state.currentCard)
  }, [state.cardPhase, state.currentCard])

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
    revealCardValue,
    canResetPlacement,
    canCommit,
    startGame,
    placeOnTile,
    resetCurrentPlacement,
    confirmTurn,
    completeCardReveal,
  }
}
