import { TOTAL_ROUNDS } from '../types/game'
import { createIntegerCard, type GameCard } from '../types/card'

const MIN_VALUE = -20
const MAX_VALUE = 20

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

/**
 * 23장 정수 덱 생성 (-20~20, 중복 허용).
 * 각 정수는 동일 확률로 독립 추출한 뒤 셔플한다.
 */
export function createDeck(size = TOTAL_ROUNDS): GameCard[] {
  const values = Array.from({ length: size }, () => randomInt(MIN_VALUE, MAX_VALUE))

  return shuffle(values).map((value, index) =>
    createIntegerCard(`card-${String(index + 1).padStart(2, '0')}`, value),
  )
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
