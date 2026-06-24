import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { ASSETS } from '../../types/game'
import { useAssetLoaded } from '../../utils/assetLoad'

export type FantasyButtonVariant = 'primary' | 'secondary'
export type FantasyButtonSize = 'sm' | 'md' | 'lg' | 'full'

const DEFAULT_FRAMES: Record<FantasyButtonVariant, string> = {
  primary: ASSETS.actionConfirmFrame,
  secondary: ASSETS.actionUndoFrame,
}

interface FantasyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FantasyButtonVariant
  size?: FantasyButtonSize
  frameSrc?: string
  children: ReactNode
}

/** 프레임 PNG + HTML 라벨 — primary(배치 완료·시작) / secondary(되돌리기·취소) */
export const FantasyButton = forwardRef<HTMLButtonElement, FantasyButtonProps>(
  function FantasyButton(
    {
      variant = 'primary',
      size = 'md',
      frameSrc,
      className = '',
      children,
      disabled,
      ...rest
    },
    ref,
  ) {
    const { loaded, onLoad, onError } = useAssetLoaded()
    const src = frameSrc ?? DEFAULT_FRAMES[variant]

    return (
      <button
        ref={ref}
        type="button"
        className={[
          'fantasy-btn',
          `fantasy-btn--${variant}`,
          `fantasy-btn--${size}`,
          loaded ? 'fantasy-btn--has-asset' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        {...rest}
      >
        <span className="fantasy-btn__frame" aria-hidden>
          <img src={src} alt="" draggable={false} onLoad={onLoad} onError={onError} />
        </span>
        <span className="fantasy-btn__content">{children}</span>
      </button>
    )
  },
)
