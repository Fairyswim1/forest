import type { CardValue } from '../types/card'
import { getCardTone, getCardValueSizeClass, getDisplayLabelSizeClass } from '../utils/cardDisplay'
import { displayValueToLatex } from '../utils/mathLatex'
import { MathLatex } from './MathLatex'

interface CardValueTextProps {
  value: CardValue
  displayLabel?: string
  className?: string
  variant?: 'panel' | 'tile'
}

function renderLatexValue(
  label: string,
  tone: ReturnType<typeof getCardTone>,
  sizeClass: string,
  className: string,
  variant: 'panel' | 'tile',
) {
  const latex = displayValueToLatex(label)
  if (!latex) return null

  const latexVariant = variant === 'tile' ? 'math-latex--tile' : 'math-latex--panel'

  return (
    <span
      className={`current-card-panel__value current-card-panel__value--latex current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
    >
      <MathLatex latex={latex} className={latexVariant} ariaLabel={label} />
    </span>
  )
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
    const latexMarkup = renderLatexValue(displayLabel, tone, sizeClass, className, variant)
    if (latexMarkup) return latexMarkup

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
    const latexMarkup = renderLatexValue(value.text, tone, sizeClass, className, variant)
    if (latexMarkup) return latexMarkup

    return (
      <span
        className={`current-card-panel__value current-card-panel__value--label current-card-panel__value--${tone} ${sizeClass} ${className}`.trim()}
        aria-label={value.text}
      >
        {value.text}
      </span>
    )
  }

  const fractionLabel = `${value.numerator}/${value.denominator}`
  const fractionMarkup = renderLatexValue(fractionLabel, tone, sizeClass, className, variant)
  if (fractionMarkup) return fractionMarkup

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
