import { forwardRef, type ReactNode } from 'react'
import { useAssetLoaded } from '../../utils/assetLoad'

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

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { variant, label, frameSrc, disabled = false, highlighted = false, onClick, icon },
  ref,
) {
  const { loaded, onLoad, onError } = useAssetLoaded()

  return (
    <button
      ref={ref}
      type="button"
      className={[
        'action-btn',
        `action-btn--${variant}`,
        loaded ? 'action-btn--has-asset' : '',
        highlighted ? 'action-btn--tutorial-highlight' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      <span className="action-btn__asset-layer" aria-hidden>
        {frameSrc && (
          <img
            className="action-btn__asset-img"
            src={frameSrc}
            alt=""
            draggable={false}
            onLoad={onLoad}
            onError={onError}
          />
        )}
      </span>
      <span className="action-btn__content">
        {icon}
        <span className="action-btn__label">{label}</span>
      </span>
    </button>
  )
})
