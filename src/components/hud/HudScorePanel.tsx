import { HUD_ASSETS } from '../../assets/hudAssets'

interface HudScorePanelProps {
  score: number
}

export function HudScorePanel({ score }: HudScorePanelProps) {
  return (
    <div className="hud-score" aria-label={`점수 ${score}`}>
      <img className="hud-score__frame" src={HUD_ASSETS.scorePanel} alt="" aria-hidden="true" draggable={false} />
      <span className="hud-score__label">점수</span>
      <strong className="hud-score__value">{score}</strong>
    </div>
  )
}
