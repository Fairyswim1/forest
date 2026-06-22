import { ASSETS } from '../types/game'
import type { CardPanelPhase, CardValue } from '../types/card'
import { CardValueText } from './CardValueText'
import { useAssetLoaded } from '../utils/assetLoad'

interface CurrentCardPanelProps {
  value: CardValue | null
  phase?: CardPanelPhase
  variant?: 'panel' | 'reveal'
  className?: string
}

export function CurrentCardPanel({
  value,
  phase = 'panel',
  variant = 'panel',
  className,
}: CurrentCardPanelProps) {
  const isEmpty = value === null
  const { loaded, onLoad, onError } = useAssetLoaded()

  return (
    <article
      className={[
        'current-card-panel',
        variant === 'reveal' ? 'current-card-panel--hero' : 'current-card-panel--dock',
        isEmpty ? 'current-card-panel--empty' : '',
        phase === 'hidden' ? 'current-card-panel--phase-hidden' : '',
        loaded ? 'current-card-panel--has-asset' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-phase={phase}
      aria-label={
        isEmpty
          ? '현재 카드 없음'
          : `현재 카드 ${typeof value === 'number' ? value : `${value.numerator}/${value.denominator}`}`
      }
    >
      <div className="current-card-panel__frame-wrap" aria-hidden>
        <img
          className="current-card-panel__frame-img"
          src={ASSETS.cardFrame}
          alt=""
          draggable={false}
          onLoad={onLoad}
          onError={onError}
        />
      </div>

      <div className="current-card-panel__content">
        <header className="current-card-panel__ribbon">
          <span className="current-card-panel__ribbon-text">현재 카드</span>
        </header>

        <div className="current-card-panel__face">
          <div className="current-card-panel__face-inner">
            {isEmpty ? (
              <span className="current-card-panel__placeholder" aria-hidden>
                —
              </span>
            ) : (
              <CardValueText value={value} />
            )}
          </div>
        </div>

        <footer className="current-card-panel__ornaments" aria-hidden>
          <span className="current-card-panel__star">✦</span>
          <span className="current-card-panel__star">✦</span>
        </footer>
      </div>
    </article>
  )
}
