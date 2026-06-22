import type { ReactNode } from 'react'
import { hideBrokenAsset } from '../../utils/hideBrokenAsset'

export type HudFrameVariant = 'stage' | 'round' | 'score' | 'menu'

interface HudFramePanelProps {
  variant: HudFrameVariant
  frameSrc?: string
  children: ReactNode
  className?: string
  ariaLabel?: string
}

interface HudFrameButtonProps extends HudFramePanelProps {
  onClick: () => void
}

function frameClass(variant: HudFrameVariant, extra?: string) {
  return ['hud-frame', `hud-frame--${variant}`, extra].filter(Boolean).join(' ')
}

function FrameAsset({ src }: { src?: string }) {
  if (!src) return null
  return (
    <img
      className="hud-frame__asset-img"
      src={src}
      alt=""
      draggable={false}
      onError={hideBrokenAsset}
    />
  )
}

export function HudFramePanel({
  variant,
  frameSrc,
  children,
  className,
  ariaLabel,
}: HudFramePanelProps) {
  return (
    <div className={frameClass(variant, className)} aria-label={ariaLabel}>
      <div className="hud-frame__asset-layer" aria-hidden>
        <FrameAsset src={frameSrc} />
      </div>
      <div className="hud-frame__content">{children}</div>
    </div>
  )
}

export function HudFrameButton({
  variant,
  frameSrc,
  children,
  className,
  ariaLabel,
  onClick,
}: HudFrameButtonProps) {
  return (
    <button
      type="button"
      className={frameClass(variant, className)}
      aria-label={ariaLabel ?? '메뉴'}
      onClick={onClick}
    >
      <span className="hud-frame__asset-layer" aria-hidden>
        <FrameAsset src={frameSrc} />
      </span>
      <span className="hud-frame__content">{children}</span>
    </button>
  )
}
