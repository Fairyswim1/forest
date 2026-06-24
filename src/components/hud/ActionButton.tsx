import { forwardRef } from 'react'
import { FantasyImageButton } from '../ui/FantasyImageButton'

export type ActionButtonVariant = 'confirm' | 'undo'

interface ActionButtonProps {
  variant: ActionButtonVariant
  label: string
  disabled?: boolean
  highlighted?: boolean
  onClick: () => void
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { variant, label, disabled = false, highlighted = false, onClick },
  ref,
) {
  const imageVariant = variant === 'confirm' ? 'confirm' : 'undo'

  return (
    <FantasyImageButton
      ref={ref}
      variant={imageVariant}
      size="md"
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
      {label}
    </FantasyImageButton>
  )
})
