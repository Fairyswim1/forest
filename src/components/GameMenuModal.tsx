interface GameMenuModalProps {
  onClose: () => void
  onReplayTutorial: () => void
}

export function GameMenuModal({ onClose, onReplayTutorial }: GameMenuModalProps) {
  return (
    <div className="game-menu-modal" role="dialog" aria-modal="true" aria-label="게임 메뉴">
      <button type="button" className="game-menu-modal__backdrop" onClick={onClose} aria-label="닫기" />
      <div className="game-menu-modal__panel wood-panel">
        <h2 className="game-menu-modal__title">메뉴</h2>
        <button
          type="button"
          className="game-menu-modal__item"
          onClick={() => {
            onReplayTutorial()
            onClose()
          }}
        >
          튜토리얼 다시보기
        </button>
        <button type="button" className="game-menu-modal__item game-menu-modal__item--muted" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}
