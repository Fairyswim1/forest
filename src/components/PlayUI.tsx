import { TURN_SECONDS } from '../types/game'
import type { ReactNode, RefObject } from 'react'
import { CurrentCardPanel } from './CurrentCardPanel'
import { PlayHud } from './hud/PlayHud'
import { ControlActions } from './hud/ControlActions'

export { PlayHud }

interface CurrentCardProps {
  value: import('../types/card').CardValue | null
  displayLabel?: string
  phase: 'hidden' | 'panel'
  panelClassName?: string
  showHint?: boolean
  turnWarning?: boolean
}

export function CurrentCard({ value, displayLabel, phase, panelClassName, showHint, turnWarning }: CurrentCardProps) {
  return (
    <div className="control-bar__card-stack">
      <div className="current-card-wrapper">
        <CurrentCardPanel
          value={value}
          displayLabel={displayLabel}
          phase={phase}
          variant="panel"
          className={panelClassName}
        />
      </div>
      {showHint && (
        <p className="control-bar__card-hint">빈 칸을 클릭해 배치한 뒤, 배치 완료를 누르세요.</p>
      )}
      {turnWarning && (
        <p className="control-bar__turn-warning" role="status">
          시간이 끝났습니다. 배치 후 배치 완료를 누르세요.
        </p>
      )}
    </div>
  )
}

interface ControlBarProps {
  timeLeft: number
  canConfirm: boolean
  canReset: boolean
  onConfirm: () => void
  onReset: () => void
  currentCard: ReactNode
  cardContainerRef?: RefObject<HTMLDivElement | null>
  confirmButtonRef?: RefObject<HTMLDivElement | null>
  resetButtonRef?: RefObject<HTMLDivElement | null>
  highlightConfirm?: boolean
}

export function ControlBar({
  timeLeft,
  canConfirm,
  canReset,
  onConfirm,
  onReset,
  currentCard,
  cardContainerRef,
  confirmButtonRef,
  resetButtonRef,
  highlightConfirm = false,
}: ControlBarProps) {
  const pct = Math.max(0, Math.min(100, (timeLeft / TURN_SECONDS) * 100))

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

      <div ref={cardContainerRef} className="control-bar__card control-bar__card-wrapper">
        {currentCard}
      </div>

      <ControlActions
        canConfirm={canConfirm}
        canReset={canReset}
        onConfirm={onConfirm}
        onReset={onReset}
        confirmButtonRef={confirmButtonRef}
        resetButtonRef={resetButtonRef}
        highlightConfirm={highlightConfirm}
      />
    </div>
  )
}
