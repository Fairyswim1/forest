import { TOTAL_ROUNDS } from '../types/game'
import type { GameCard } from '../types/card'
import { generateIntegerDeck } from '../game/cards/generators'

/**
 * 정수 덱 생성 — 실제 규칙은 game/cards/generators 의 generateIntegerDeck 로 분리되었다.
 * 기존 import 경로(`./deck`) 호환을 위해 얇은 위임 함수로 유지한다.
 */
export function createDeck(size = TOTAL_ROUNDS): GameCard[] {
  return generateIntegerDeck(size)
}

export function getNumberTone(value: number): 'negative' | 'zero' | 'positive' {
  if (value < 0) return 'negative'
  if (value === 0) return 'zero'
  return 'positive'
}

export function formatTimer(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
