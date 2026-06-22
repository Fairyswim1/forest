import type { CurrentTurnPlacement } from '../types/game'
import { TURN_SECONDS, type CardPhase, type GamePhase } from '../types/game'
import { hasTemporaryPlacement } from './placement'

export function canResetCurrentPlacement(
  placement: CurrentTurnPlacement | null,
  phase: GamePhase,
  cardPhase: CardPhase,
): boolean {
  return phase === 'playing' && cardPhase === 'panel' && hasTemporaryPlacement(placement)
}

export function resetTurnTimer(): number {
  return TURN_SECONDS
}
