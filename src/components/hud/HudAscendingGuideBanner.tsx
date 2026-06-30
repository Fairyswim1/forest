import { HUD_ASSETS } from '../../assets/hudAssets'

interface Props {
  className?: string
}

/** 오름차순 점수 규칙 배너 */
export function HudAscendingGuideBanner({ className }: Props) {
  return (
    <div
      className={['hud-ascending-banner', className].filter(Boolean).join(' ')}
      role="img"
      aria-label="작은 수에서 큰 수로 이어야 점수가 올라갑니다"
    >
      <img
        className="hud-ascending-banner__image"
        src={HUD_ASSETS.ascendingGuideBanner}
        alt=""
        draggable={false}
      />
    </div>
  )
}
