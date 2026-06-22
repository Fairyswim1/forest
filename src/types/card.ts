/** 카드에 표시할 값 — 정수 또는 분수(향후 스테이지 확장) */
export type CardValue =
  | number
  | { type: 'fraction'; numerator: number; denominator: number }

export type CardTone = 'negative' | 'zero' | 'positive'

export type CardPanelPhase = 'hidden' | 'center' | 'panel' | 'reveal' | 'placing'

export type CardType = 'natural' | 'integer' | 'rational' | 'real'

/** @deprecated CardType 으로 대체 */
export type CardKind = CardType

/** 게임 덱 카드 — displayValue와 numericValue 분리 (향후 분수·유리수 확장) */
export interface GameCard {
  id: string
  displayValue: string
  numericValue: number
  type: CardType
}

export function createIntegerCard(id: string, value: number): GameCard {
  return {
    id,
    displayValue: String(value),
    numericValue: value,
    type: 'integer',
  }
}

export function gameCardToCardValue(card: GameCard): CardValue {
  if (card.type === 'integer') return card.numericValue
  return card.numericValue
}
