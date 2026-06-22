import type { CardValue } from '../types/card'
import { getCardTone, getCardValueSizeClass } from '../utils/cardDisplay'

interface CardValueTextProps {
  value: CardValue
  className?: string
}

export function CardValueText({ value, className = '' }: CardValueTextProps) {
  const tone = getCardTone(value)
  const sizeClass = getCardValueSizeClass(value)

  if (typeof value === 'number') {
    return (
      <span
        className={`current-card-panel__value current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
        aria-label={String(value)}
      >
        {value}
      </span>
    )
  }

  const sign = value.numerator < 0 ? '−' : ''
  const num = Math.abs(value.numerator)

  return (
    <span
      className={`current-card-panel__value current-card-panel__value--fraction current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
      aria-label={`${value.numerator}/${value.denominator}`}
    >
      {sign && <span className="current-card-panel__sign">{sign}</span>}
      <span className="current-card-panel__fraction">
        <span className="current-card-panel__numerator">{num}</span>
        <span className="current-card-panel__fraction-bar" aria-hidden />
        <span className="current-card-panel__denominator">{value.denominator}</span>
      </span>
    </span>
  )
}
