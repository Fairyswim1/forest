import { HUD_ASSETS } from '../../assets/hudAssets'

interface HudTimerPanelProps {
  timeLeft: number
  totalSeconds: number
}

export function HudTimerPanel({ timeLeft, totalSeconds }: HudTimerPanelProps) {
  const safeTotal = Math.max(1, totalSeconds)
  const clampedTime = Math.max(0, timeLeft)
  const timeProgressPercent = Math.max(0, Math.min(100, (clampedTime / safeTotal) * 100))
  const urgent = timeProgressPercent <= 25 && clampedTime > 0
  const formattedTime = `${String(Math.floor(clampedTime / 60)).padStart(2, '0')}:${String(clampedTime % 60).padStart(2, '0')}`

  return (
    <div className="hud-timer" aria-label={`남은 시간 ${formattedTime}`}>
      <img className="hud-timer__frame" src={HUD_ASSETS.timerPanel} alt="" aria-hidden="true" draggable={false} />
      <span className="hud-timer__label">남은 시간</span>
      <strong className={`hud-timer__value${urgent ? ' hud-timer__value--urgent' : ''}`}>{formattedTime}</strong>
      <div className="hud-timer__progress-track" aria-hidden>
        <div className="hud-timer__progress-fill" style={{ width: `${timeProgressPercent}%` }} />
      </div>
    </div>
  )
}
