import type { RefObject } from 'react'
import { ASSETS } from '../../types/game'
import { ActionButton } from './ActionButton'
import { CheckIcon, UndoIcon } from './ActionIcons'

interface ControlActionsProps {
  canConfirm: boolean
  canUndo: boolean
  onConfirm: () => void
  onUndo: () => void
  confirmButtonRef?: RefObject<HTMLDivElement | null>
  highlightConfirm?: boolean
}

export function ControlActions({
  canConfirm,
  canUndo,
  onConfirm,
  onUndo,
  confirmButtonRef,
  highlightConfirm = false,
}: ControlActionsProps) {
  return (
    <div ref={confirmButtonRef} className="control-bar__actions">
      <ActionButton
        variant="confirm"
        label="배치 완료"
        frameSrc={ASSETS.actionConfirmFrame}
        disabled={!canConfirm && !highlightConfirm}
        highlighted={highlightConfirm}
        onClick={onConfirm}
        icon={<CheckIcon />}
      />
      <ActionButton
        variant="undo"
        label="실행 취소"
        frameSrc={ASSETS.actionUndoFrame}
        disabled={!canUndo}
        onClick={onUndo}
        icon={<UndoIcon />}
      />
    </div>
  )
}
