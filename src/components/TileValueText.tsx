import type { BoardCell } from '../types/board'
import type { CardValue } from '../types/card'
import { displayValueToCardValue } from '../types/card'
import { CardValueText } from './CardValueText'
import { getCardTone } from '../utils/cardDisplay'

function cellToCardValue(cell: BoardCell): CardValue {
  return displayValueToCardValue(cell.displayValue, cell.numericValue)
}

function getTileValueSizeClass(displayValue: string, cardValue: CardValue): string {
  if (displayValue.includes('√')) {
    const len = displayValue.length
    if (len <= 2) return 'trail-tile__value-text--size-lg'
    if (len <= 3) return 'trail-tile__value-text--size-md'
    return 'trail-tile__value-text--size-sm'
  }

  if (typeof cardValue !== 'number') {
    return 'trail-tile__value-text--size-fraction'
  }

  const len = displayValue.replace('/', '').length
  if (len <= 2) return 'trail-tile__value-text--size-lg'
  if (len <= 4) return 'trail-tile__value-text--size-md'
  return 'trail-tile__value-text--size-sm'
}

interface TileValueTextProps {
  cell: BoardCell
  className?: string
}

export function TileValueText({ cell, className = '' }: TileValueTextProps) {
  const cardValue = cellToCardValue(cell)
  const tone = getCardTone(cardValue)
  const sizeClass = getTileValueSizeClass(cell.displayValue, cardValue)
  const needsLatexLabel =
    cell.displayValue.includes('√') || /-?\d+\/\d+/.test(cell.displayValue)
  const displayLabel = needsLatexLabel ? cell.displayValue : undefined

  return (
    <CardValueText
      value={cardValue}
      displayLabel={displayLabel}
      variant="tile"
      className={`trail-tile__value-text trail-tile__value-text--${tone} ${sizeClass} ${className}`.trim()}
    />
  )
}
