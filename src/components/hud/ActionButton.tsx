import { forwardRef, type ReactNode } from 'react'
import { FantasyButton, type FantasyButtonVariant } from '../ui/FantasyButton'

export type ActionButtonVariant = 'confirm' | 'undo'

interface ActionButtonProps {
  variant: ActionButtonVariant
  label: string
  frameSrc?: string
  disabled?: boolean
  highlighted?: boolean
  onClick: () => void
  icon: ReactNode
}

const VARIANT_MAP: Record<ActionButtonVariant, FantasyButtonVariant> = {
  confirm: 'primary',
  undo: 'secondary',
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { variant, label, frameSrc, disabled = false, highlighted = false, onClick, icon },
  ref,
) {
  return (
    <FantasyButton
      ref={ref}
      variant={VARIANT_MAP[variant]}
      size="md"
      frameSrc={frameSrc}
      disabled={disabled}
      className={[
        'action-btn',
        `action-btn--${variant}`,
        highlighted ? 'action-btn--tutorial-highlight' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      onClick={onClick}
    >
      <span className="action-btn__icon">{icon}</span>
      <span className="action-btn__label">{label}</span>
    </FantasyButton>
  )
})
