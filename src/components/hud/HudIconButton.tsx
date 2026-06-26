import { HUD_ASSETS } from '../../assets/hudAssets'

type HudIconButtonVariant = 'help' | 'settings'

const ASSET_BY_VARIANT: Record<HudIconButtonVariant, string> = {
  help: HUD_ASSETS.helpButton,
  settings: HUD_ASSETS.settingsButton,
}

interface HudIconButtonProps {
  variant: HudIconButtonVariant
  ariaLabel: string
  onClick: () => void
}

export function HudIconButton({ variant, ariaLabel, onClick }: HudIconButtonProps) {
  return (
    <button
      type="button"
      className={`hud-icon-button hud-icon-button--${variant}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <img src={ASSET_BY_VARIANT[variant]} alt="" aria-hidden="true" draggable={false} />
    </button>
  )
}
