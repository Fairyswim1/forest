import { useEffect, useRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { CardValue } from '../types/card'
import type { TileId } from '../types/game'
import { CardValueText } from './CardValueText'
import { PLACEMENT_ANIMATION_MS } from '../types/game'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface CardPanelPlacementFlightProps {
  value: CardValue | null
  displayLabel?: string
  tileId: TileId | null
  active: boolean
  sourceRef: RefObject<HTMLElement | null>
  flightKey: string
}

export function CardPanelPlacementFlight({
  value,
  displayLabel,
  tileId,
  active,
  sourceRef,
  flightKey,
}: CardPanelPlacementFlightProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!active || value === null || tileId === null) return

    const hero = heroRef.current
    const source = sourceRef.current
    const target = document.querySelector<HTMLElement>(`[data-tile-id="${tileId}"]`)
    if (!hero || !source || !target) return

    const sourceRect = source.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const fromX = sourceRect.left + sourceRect.width / 2
    const fromY = sourceRect.top + sourceRect.height * 0.42
    const toX = targetRect.left + targetRect.width / 2
    const toY = targetRect.top + targetRect.height * 0.44

    hero.style.left = `${fromX}px`
    hero.style.top = `${fromY}px`
    hero.style.opacity = '1'

    if (reducedMotion) return

    hero.getAnimations().forEach((animation) => animation.cancel())

    hero.animate(
      [
        {
          left: `${fromX}px`,
          top: `${fromY}px`,
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1,
        },
        {
          left: `${toX}px`,
          top: `${toY}px`,
          transform: 'translate(-50%, -50%) scale(0.72)',
          opacity: 0.15,
        },
      ],
      {
        duration: PLACEMENT_ANIMATION_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    )
  }, [active, value, tileId, flightKey, reducedMotion, sourceRef])

  if (!active || value === null || tileId === null) return null

  return createPortal(
    <div className="card-panel-flight" aria-hidden>
      <div ref={heroRef} className="card-panel-flight__hero" key={flightKey}>
        <CardValueText value={value} displayLabel={displayLabel} className="card-panel-flight__value" />
      </div>
    </div>,
    document.body,
  )
}
