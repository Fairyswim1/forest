import type { RefObject } from 'react'
import { ActionButton } from './ActionButton'

interface ControlActionsProps {
  canConfirm: boolean
  canReset: boolean
  onConfirm: () => void
  onReset: () => void
  confirmButtonRef?: RefObject<HTMLDivElement | null>
  resetButtonRef?: RefObject<HTMLDivElement | null>
  highlightConfirm?: boolean
}

export function ControlActions({
  canConfirm,
  canReset,
  onConfirm,
  onReset,
  confirmButtonRef,
  resetButtonRef,
  highlightConfirm = false,
}: ControlActionsProps) {
  return (
    <div className="control-bar__actions">
      <div ref={confirmButtonRef}>
        <ActionButton
          variant="confirm"
          label="배치 완료"
          disabled={!canConfirm}
          highlighted={highlightConfirm}
          onClick={onConfirm}
        />
      </div>
      <div ref={resetButtonRef}>
        <ActionButton
          variant="undo"
          label="다시 놓기"
          disabled={!canReset}
          onClick={onReset}
        />
      </div>
    </div>
  )
}
