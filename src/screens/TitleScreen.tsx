import { useState } from 'react'
import { playSfx } from '../audio/audioManager'
import { ASSETS, GAME_TITLE } from '../types/game'
import { GameRulesModal } from '../components/GameRulesModal'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'

interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div className="title-screen">
      <div
        className="title-screen__bg"
        style={{ backgroundImage: `url(${ASSETS.titleScreenBg})` }}
        aria-hidden
      />
      <div className="title-screen__vignette" aria-hidden />

      <main className="title-screen__main">
        <img
          className="title-screen__logo"
          src={ASSETS.titleLogo}
          alt={GAME_TITLE}
          draggable={false}
        />

        <div className="title-screen__actions">
          <FantasyImageButton
            variant="confirm"
            size="lg"
            className="title-screen__start-btn"
            onClick={() => {
              playSfx('click')
              onStart()
            }}
          >
            모험 시작
          </FantasyImageButton>
          <FantasyImageButton
            variant="undo"
            size="md"
            onClick={() => {
              playSfx('click')
              setRulesOpen(true)
            }}
          >
            게임 방법
          </FantasyImageButton>
        </div>
      </main>

      {rulesOpen && <GameRulesModal onClose={() => setRulesOpen(false)} />}
    </div>
  )
}
