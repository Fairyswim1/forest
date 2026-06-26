import { HUD_ASSETS } from '../../assets/hudAssets'

interface HudStageInfoPanelProps {
  title: string
  subtitle: string
}

export function HudStageInfoPanel({ title, subtitle }: HudStageInfoPanelProps) {
  return (
    <div className="hud-stage-info play-hud__stage" aria-label={`스테이지 ${title}, ${subtitle}`}>
      <img
        className="hud-stage-info__frame"
        src={HUD_ASSETS.stageInfoPanel}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div className="hud-stage-info__content">
        <strong className="hud-stage-info__title">{title}</strong>
        <span className="hud-stage-info__subtitle">{subtitle}</span>
      </div>
    </div>
  )
}
