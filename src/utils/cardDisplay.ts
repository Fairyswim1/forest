import type { CardTone, CardType, CardValue } from '../types/card'
import { getNumberTone } from './deck'
import { realDisplayFor } from '../game/cards/realValues'

export function getCardTone(value: CardValue): CardTone {
  if (typeof value === 'number') return getNumberTone(value)
  if (value.type === 'label') return getNumberTone(value.numeric)
  if (value.numerator === 0) return 'zero'
  const n = value.numerator / value.denominator
  if (n < 0) return 'negative'
  if (n === 0) return 'zero'
  return 'positive'
}

export function cardValueLength(value: CardValue): number {
  if (typeof value === 'number') return String(value).length
  if (value.type === 'label') return value.text.length
  return String(Math.abs(value.numerator)).length + String(value.denominator).length + 1
}

/** 긴 숫자·분수·표기에 맞춰 글자 크기 조절용 클래스 */
export function getCardValueSizeClass(value: CardValue | null): string {
  if (value === null) return 'current-card-panel__value--size-md'
  const len = cardValueLength(value)
  if (len <= 2) return 'current-card-panel__value--size-xl'
  if (len <= 3) return 'current-card-panel__value--size-lg'
  if (len <= 4) return 'current-card-panel__value--size-md'
  return 'current-card-panel__value--size-sm'
}

export function displayValueLength(displayValue: string): number {
  return displayValue.replace('/', '').length
}

export function getDisplayLabelSizeClass(displayLabel: string): string {
  const len = displayValueLength(displayLabel)
  if (len <= 2) return 'current-card-panel__value--size-xl'
  if (len <= 3) return 'current-card-panel__value--size-lg'
  return 'current-card-panel__value--size-md'
}

/** 타일에 표시할 문자열 — 실수는 √n 표기, 그 외는 숫자 그대로 */
export function formatTileValue(value: number, cardType: CardType): string {
  if (cardType === 'real') {
    const display = realDisplayFor(value)
    if (display) return display
  }
  return String(value)
}
