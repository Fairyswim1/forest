import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { BUTTON_ASSETS } from '../../assets/uiAssets'

export type FantasyImageButtonVariant = 'confirm' | 'undo' | 'retry' | 'worldMap' | 'secondary'

export type FantasyImageButtonSize = 'sm' | 'md' | 'lg' | 'full'

const VARIANT_FRAMES: Record<FantasyImageButtonVariant, string> = {
  confirm: BUTTON_ASSETS.confirm,
  undo: BUTTON_ASSETS.undo,
  retry: BUTTON_ASSETS.retry,
  worldMap: BUTTON_ASSETS.worldMap,
  secondary: BUTTON_ASSETS.secondary,
}

interface FantasyImageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FantasyImageButtonVariant
  size?: FantasyImageButtonSize
  frameSrc?: string
  children: ReactNode
}

/** public/assets 버튼 PNG 프레임 + HTML 라벨 */
export const FantasyImageButton = forwardRef<HTMLButtonElement, FantasyImageButtonProps>(
  function FantasyImageButton(
    {
      variant = 'confirm',
      size = 'md',
      frameSrc,
      className = '',
      children,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const src = frameSrc ?? VARIANT_FRAMES[variant]

    return (
      <button
        ref={ref}
        type={type}
        className={[
          'fantasy-image-button',
          `fantasy-image-button--${variant}`,
          `fantasy-image-button--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        {...rest}
      >
        <img
          className="fantasy-image-button__frame"
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        <span className="fantasy-image-button__label">{children}</span>
      </button>
    )
  },
)
