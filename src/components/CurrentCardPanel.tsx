import { HUD_ASSETS } from '../assets/hudAssets'
import type { CardPanelPhase, CardValue } from '../types/card'
import { CardValueText } from './CardValueText'

interface CurrentCardPanelProps {
  value: CardValue | null
  displayLabel?: string
  phase?: CardPanelPhase
  variant?: 'panel' | 'reveal'
  className?: string
}

export function CurrentCardPanel({
  value,
  displayLabel,
  phase = 'panel',
  variant = 'panel',
  className,
}: CurrentCardPanelProps) {
  const isEmpty = value === null

  const valueLabel =
    displayLabel ??
    (value === null
      ? ''
      : typeof value === 'number'
        ? String(value)
        : value.type === 'label'
          ? value.text
          : `${value.numerator}/${value.denominator}`)

  return (
    <article
      className={[
        'current-card-panel',
        'current-card-panel--v2',
        variant === 'reveal' ? 'current-card-panel--hero' : 'current-card-panel--dock',
        isEmpty ? 'current-card-panel--empty' : '',
        phase === 'hidden' ? 'current-card-panel--phase-hidden' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-phase={phase}
      aria-label={isEmpty ? '현재 카드 없음' : `현재 카드 ${valueLabel}`}
    >
      <img
        className="current-card-panel__frame"
        src={HUD_ASSETS.currentCardPanel}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div className="current-card-panel__value">
        {isEmpty ? (
          <span className="current-card-panel__placeholder" aria-hidden>
            —
          </span>
        ) : (
          <CardValueText value={value} displayLabel={displayLabel} />
        )}
      </div>
    </article>
  )
}
