import { useEffect, useRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { CardValue } from '../types/card'
import { CardValueText } from './CardValueText'
import { CARD_REVEAL_FLY_MS, CARD_REVEAL_HOLD_MS } from '../types/game'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface CardRevealFlightProps {
  value: CardValue | null
  active: boolean
  targetRef: RefObject<HTMLElement | null>
  boardAreaRef?: RefObject<HTMLElement | null>
  revealKey: string
  onComplete: () => void
}

function getScreenCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
}

export function CardRevealFlight({
  value,
  active,
  targetRef,
  boardAreaRef,
  revealKey,
  onComplete,
}: CardRevealFlightProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!active || value === null) return

    const hero = heroRef.current
    if (!hero) return

    const holdMs = reducedMotion ? 180 : CARD_REVEAL_HOLD_MS
    const flyMs = reducedMotion ? 160 : CARD_REVEAL_FLY_MS
    const origin = getScreenCenter()

    hero.getAnimations().forEach((animation) => animation.cancel())
    hero.style.left = `${origin.x}px`
    hero.style.top = `${origin.y}px`
    hero.style.transform = 'translate(-50%, -50%) scale(1)'
    hero.style.opacity = '1'

    if (reducedMotion) {
      const timer = window.setTimeout(() => onCompleteRef.current(), holdMs + flyMs)
      return () => window.clearTimeout(timer)
    }

    const holdTimer = window.setTimeout(() => {
      const target = targetRef.current
      if (!target) {
        onCompleteRef.current()
        return
      }

      hero.getAnimations().forEach((animation) => animation.cancel())

      const heroRect = hero.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const toX = targetRect.left + targetRect.width / 2
      const toY = targetRect.top + targetRect.height / 2
      const scaleEnd = Math.min(1.12, Math.max(0.26, targetRect.width / Math.max(heroRect.width, 1)))

      const animation = hero.animate(
        [
          {
            left: `${origin.x}px`,
            top: `${origin.y}px`,
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
          },
          {
            left: `${toX}px`,
            top: `${toY}px`,
            transform: `translate(-50%, -50%) scale(${scaleEnd})`,
            opacity: 0.2,
          },
        ],
        {
          duration: flyMs,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        },
      )

      animation.onfinish = () => onCompleteRef.current()
      animation.oncancel = () => onCompleteRef.current()
    }, holdMs)

    return () => window.clearTimeout(holdTimer)
  }, [active, value, revealKey, reducedMotion, targetRef, boardAreaRef])

  if (!active || value === null) return null

  return createPortal(
    <div className="card-reveal-flight" aria-hidden>
      <div ref={heroRef} className="card-reveal-flight__hero" key={revealKey}>
        <div className="card-reveal-flight__glow" />
        <CardValueText value={value} className="card-reveal-flight__value" />
        <span className="card-reveal-flight__spark card-reveal-flight__spark--1">✦</span>
        <span className="card-reveal-flight__spark card-reveal-flight__spark--2">✦</span>
      </div>
    </div>,
    document.body,
  )
}
