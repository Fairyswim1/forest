/**
 * 카드/타일에 표시할 값.
 * - number: 정수·자연수 (그대로 표시)
 * - fraction: 분수 (향후 유리수 스테이지)
 * - label: 표기와 수치가 다른 값 (√2, π 등). text를 그대로 표시하고 numeric으로 톤·비교.
 */
export type CardValue =
  | number
  | { type: 'fraction'; numerator: number; denominator: number }
  | { type: 'label'; text: string; numeric: number }

export type CardTone = 'negative' | 'zero' | 'positive'

export type CardPanelPhase = 'hidden' | 'center' | 'panel' | 'reveal' | 'placing'

/** 월드별 수 체계 — 카드가 다루는 수의 종류 */
export type CardType = 'natural' | 'integer' | 'rational' | 'real'

/**
 * 게임 덱 카드 — displayValue(화면 출력)와 numericValue(점수·대소 비교)를 분리한다.
 * UI는 displayValue만, 점수/비교 로직은 numericValue만 사용한다.
 */
export interface NumberCard {
  id: string
  displayValue: string
  numericValue: number
  type: CardType
}

/** 기존 코드 호환용 별칭 — 엔진 전반에서 NumberCard와 동일하게 사용한다. */
export type GameCard = NumberCard

export function createIntegerCard(id: string, value: number): NumberCard {
  return {
    id,
    displayValue: String(value),
    numericValue: value,
    type: 'integer',
  }
}

export function createNaturalCard(id: string, value: number): NumberCard {
  return {
    id,
    displayValue: String(value),
    numericValue: value,
    type: 'natural',
  }
}

export interface RationalCardSpec {
  displayValue: string
  numericValue: number
}

export function createRationalCard(id: string, spec: RationalCardSpec): NumberCard {
  return {
    id,
    displayValue: spec.displayValue,
    numericValue: spec.numericValue,
    type: 'rational',
  }
}

export function createRealCard(id: string, displayValue: string, numericValue: number): NumberCard {
  return { id, displayValue, numericValue, type: 'real' }
}

const FRACTION_DISPLAY_RE = /^(-?)(\d+)\/(\d+)$/

export function displayValueToCardValue(displayValue: string, numericValue: number): CardValue {
  const fractionMatch = displayValue.match(FRACTION_DISPLAY_RE)
  if (fractionMatch) {
    const sign = fractionMatch[1] === '-' ? -1 : 1
    const numerator = sign * Number(fractionMatch[2])
    const denominator = Number(fractionMatch[3])
    return { type: 'fraction', numerator, denominator }
  }

  if (displayValue.includes('√') || displayValue !== String(numericValue)) {
    return { type: 'label', text: displayValue, numeric: numericValue }
  }

  return numericValue
}

export function gameCardToCardValue(card: NumberCard): CardValue {
  if (card.type === 'integer' || card.type === 'natural') {
    if (card.displayValue === String(card.numericValue)) return card.numericValue
  }
  return displayValueToCardValue(card.displayValue, card.numericValue)
}

export function getCardDisplayLabel(card: NumberCard): string | undefined {
  if (card.type === 'real') return card.displayValue
  if (card.displayValue.includes('√')) return card.displayValue
  return undefined
}
