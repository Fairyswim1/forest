import { HUD_ASSETS } from '../../assets/hudAssets'

interface HudRoundPanelProps {
  round: number
  totalRounds: number
}

export function HudRoundPanel({ round, totalRounds }: HudRoundPanelProps) {
  return (
    <div className="hud-round" aria-label={`라운드 ${round} / ${totalRounds}`}>
      <img className="hud-round__frame" src={HUD_ASSETS.roundPill} alt="" aria-hidden="true" draggable={false} />
      <span className="hud-round__label">
        Round {round} / {totalRounds}
      </span>
    </div>
  )
}
