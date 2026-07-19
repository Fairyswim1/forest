import { useState } from 'react'
import { getMuted, playSfx, toggleMuted } from '../audio/audioManager'
import { FantasyButton } from './ui/FantasyButton'
import { FantasyPanel } from './ui/FantasyPanel'

interface GameMenuModalProps {
  onClose: () => void
  onReplayTutorial: () => void
}

export function GameMenuModal({ onClose, onReplayTutorial }: GameMenuModalProps) {
  const [muted, setMutedState] = useState(() => getMuted())

  return (
    <div className="game-menu-modal" role="dialog" aria-modal="true" aria-label="게임 메뉴">
      <button type="button" className="game-menu-modal__backdrop" onClick={onClose} aria-label="닫기" />
      <FantasyPanel className="game-menu-modal__panel">
        <h2 className="fantasy-panel__title">메뉴</h2>
        <div className="game-menu-modal__actions">
          <FantasyButton
            variant="secondary"
            size="full"
            className="game-menu-modal__item"
            onClick={() => {
              const next = toggleMuted()
              setMutedState(next)
              if (!next) playSfx('click')
            }}
          >
            {muted ? '소리 켜기' : '소리 끄기'}
          </FantasyButton>
          <FantasyButton
            variant="primary"
            size="full"
            className="game-menu-modal__item"
            onClick={() => {
              playSfx('click')
              onReplayTutorial()
              onClose()
            }}
          >
            튜토리얼 다시보기
          </FantasyButton>
          <FantasyButton
            variant="secondary"
            size="full"
            className="game-menu-modal__item"
            onClick={() => {
              playSfx('click')
              onClose()
            }}
          >
            닫기
          </FantasyButton>
        </div>
      </FantasyPanel>
    </div>
  )
}
