import type { CardTone, CardValue } from '../types/card'
import { getNumberTone } from './deck'

export function getCardTone(value: CardValue): CardTone {
  if (typeof value === 'number') return getNumberTone(value)
  if (value.numerator === 0) return 'zero'
  const n = value.numerator / value.denominator
  if (n < 0) return 'negative'
  if (n === 0) return 'zero'
  return 'positive'
}

export function cardValueLength(value: CardValue): number {
  if (typeof value === 'number') return String(value).length
  return String(Math.abs(value.numerator)).length + String(value.denominator).length + 1
}

/** 긴 숫자·분수에 맞춰 글자 크기 조절용 클래스 */
export function getCardValueSizeClass(value: CardValue | null): string {
  if (value === null) return 'current-card-panel__value--size-md'
  const len = cardValueLength(value)
  if (len <= 2) return 'current-card-panel__value--size-xl'
  if (len <= 3) return 'current-card-panel__value--size-lg'
  if (len <= 4) return 'current-card-panel__value--size-md'
  return 'current-card-panel__value--size-sm'
}
