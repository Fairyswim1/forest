import type { CardValue } from '../types/card'
import { getCardTone, getCardValueSizeClass, getDisplayLabelSizeClass } from '../utils/cardDisplay'

interface CardValueTextProps {
  value: CardValue
  displayLabel?: string
  className?: string
  variant?: 'panel' | 'tile'
}

export function CardValueText({
  value,
  displayLabel,
  className = '',
  variant = 'panel',
}: CardValueTextProps) {
  const tone = getCardTone(value)
  const sizeClass =
    variant === 'panel'
      ? displayLabel
        ? getDisplayLabelSizeClass(displayLabel)
        : getCardValueSizeClass(value)
      : ''

  if (displayLabel !== undefined) {
    return (
      <span
        className={`current-card-panel__value current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
        aria-label={displayLabel}
      >
        {displayLabel}
      </span>
    )
  }

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

  if (value.type === 'label') {
    return (
      <span
        className={`current-card-panel__value current-card-panel__value--label current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
        aria-label={value.text}
      >
        {value.text}
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
