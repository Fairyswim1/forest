import type { ReactNode, RefObject } from 'react'
import type { CardValue } from '../types/card'
import { CurrentCardPanel } from './CurrentCardPanel'
import { PlayHud } from './hud/PlayHud'
import { ControlActions } from './hud/ControlActions'

export { PlayHud }

interface CurrentCardProps {
  value: CardValue | null
  phase: 'hidden' | 'center' | 'panel'
  panelClassName?: string
}

export function CurrentCard({ value, phase, panelClassName }: CurrentCardProps) {
  return (
    <>
      {phase === 'center' && value !== null && (
        <div className="card-reveal-layer" aria-hidden>
          <CurrentCardPanel value={value} phase="reveal" variant="reveal" />
        </div>
      )}
      <CurrentCardPanel value={value} phase={phase} variant="panel" className={panelClassName} />
    </>
  )
}

interface ControlBarProps {
  timeLeft: number
  canConfirm: boolean
  canUndo: boolean
  onConfirm: () => void
  onUndo: () => void
  currentCard: ReactNode
  cardContainerRef?: RefObject<HTMLDivElement | null>
  confirmButtonRef?: RefObject<HTMLDivElement | null>
  highlightConfirm?: boolean
}

export function ControlBar({
  timeLeft,
  canConfirm,
  canUndo,
  onConfirm,
  onUndo,
  currentCard,
  cardContainerRef,
  confirmButtonRef,
  highlightConfirm = false,
}: ControlBarProps) {
  const pct = Math.max(0, Math.min(100, (timeLeft / 24) * 100))

  return (
    <div className="control-bar">
      <aside className="control-bar__timer hud-frame hud-frame--timer">
        <div className="control-bar__timer-inner">
          <span className="control-bar__hourglass" aria-hidden>⏳</span>
          <div className="control-bar__timer-text">
            <span>남은 시간</span>
            <strong>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </strong>
            <div className="control-bar__timer-track">
              <div className="control-bar__timer-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <div className="control-bar__center">
        <div ref={cardContainerRef} className="control-bar__card">
          {currentCard}
        </div>
        <ControlActions
          canConfirm={canConfirm}
          canUndo={canUndo}
          onConfirm={onConfirm}
          onUndo={onUndo}
          confirmButtonRef={confirmButtonRef}
          highlightConfirm={highlightConfirm}
        />
      </div>
    </div>
  )
}
