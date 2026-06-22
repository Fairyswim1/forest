/** 카드에 표시할 값 — 정수 또는 분수(향후 스테이지 확장) */
export type CardValue =
  | number
  | { type: 'fraction'; numerator: number; denominator: number }

export type CardTone = 'negative' | 'zero' | 'positive'

export type CardPanelPhase = 'hidden' | 'center' | 'panel' | 'reveal'
