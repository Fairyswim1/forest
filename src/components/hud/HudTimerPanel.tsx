import { HUD_ASSETS } from '../../assets/hudAssets'

interface HudTimerPanelProps {
  timeLeft: number
  totalSeconds: number
}

type TimerProgressTier = 'high' | 'mid' | 'low'

function getProgressTier(progress: number): TimerProgressTier {
  if (progress >= 0.6) return 'high'
  if (progress >= 0.3) return 'mid'
  return 'low'
}

export function HudTimerPanel({ timeLeft, totalSeconds }: HudTimerPanelProps) {
  const safeTotal = Math.max(1, totalSeconds)
  const clampedTime = Math.max(0, timeLeft)
  const progress = clampedTime / safeTotal
  const progressPercent = Math.max(0, Math.min(100, progress * 100))
  const tier = getProgressTier(progress)
  const formattedTime = `${String(Math.floor(clampedTime / 60)).padStart(2, '0')}:${String(clampedTime % 60).padStart(2, '0')}`

  return (
    <div className="hud-timer" aria-label={`남은 시간 ${formattedTime}`}>
      <img
        className="hud-timer__frame"
        src={HUD_ASSETS.timerFrame}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <span className="hud-timer__label">남은 시간</span>
      <strong className={`hud-timer__value hud-timer__value--${tier}`}>{formattedTime}</strong>
      <div className="hud-timer__bar-track" aria-hidden="true">
        <div
          className={`hud-timer__bar-fill hud-timer__bar-fill--${tier}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
