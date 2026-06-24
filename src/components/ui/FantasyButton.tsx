import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  FantasyImageButton,
  type FantasyImageButtonSize,
  type FantasyImageButtonVariant,
} from './FantasyImageButton'

export type FantasyButtonVariant = 'primary' | 'secondary'
export type FantasyButtonSize = FantasyImageButtonSize

interface FantasyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FantasyButtonVariant
  size?: FantasyButtonSize
  frameSrc?: string
  children: ReactNode
}

const LEGACY_VARIANT_MAP: Record<FantasyButtonVariant, FantasyImageButtonVariant> = {
  primary: 'confirm',
  secondary: 'undo',
}

/** @deprecated FantasyImageButton 직접 사용 권장 */
export const FantasyButton = forwardRef<HTMLButtonElement, FantasyButtonProps>(
  function FantasyButton({ variant = 'primary', size = 'md', frameSrc, className = '', children, ...rest }, ref) {
    return (
      <FantasyImageButton
        ref={ref}
        variant={LEGACY_VARIANT_MAP[variant]}
        size={size}
        frameSrc={frameSrc}
        className={['fantasy-btn', `fantasy-btn--${variant}`, `fantasy-btn--${size}`, className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </FantasyImageButton>
    )
  },
)
