import { useState } from 'react'
import { ASSETS, GAME_TITLE } from '../types/game'
import { CHARACTERS } from '../data/characters'
import { GameRulesModal } from '../components/GameRulesModal'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'

interface TitleScreenProps {
  onStart: () => void
}

const TITLE_HERO = CHARACTERS[0]!

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
      <div className="title-screen__mist" aria-hidden />

      <div className="title-screen__spark title-screen__spark--1" aria-hidden>
        ✦
      </div>
      <div className="title-screen__spark title-screen__spark--2" aria-hidden>
        ✦
      </div>
      <div className="title-screen__spark title-screen__spark--3" aria-hidden>
        ✦
      </div>

      <main className="title-screen__main">
        <header className="title-screen__brand">
          <p className="title-screen__eyebrow">수의 모험</p>
          <h1 className="title-screen__title">
            <span className="title-screen__title-text">{GAME_TITLE}</span>
          </h1>
          <p className="title-screen__subtitle">작은 수에서 큰 수로, 길게 이어가는 길</p>
        </header>

        <div className="title-screen__stage">
          <div className="title-screen__cta">
            <FantasyImageButton
              variant="confirm"
              size="lg"
              className="title-screen__start-btn"
              onClick={onStart}
            >
              모험 시작
            </FantasyImageButton>
            <p className="title-screen__start-hint">모험가 선택부터 시작</p>

            <div className="title-screen__secondary">
              <FantasyImageButton variant="undo" size="md" onClick={() => setRulesOpen(true)}>
                게임 방법
              </FantasyImageButton>
            </div>

            <p className="title-screen__footer-note">첫 모험을 준비해 주세요</p>
          </div>

          <div className="title-screen__hero" aria-hidden>
            <img
              className="title-screen__hero-sprite"
              src={TITLE_HERO.assetUrl}
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </main>

      {rulesOpen && <GameRulesModal onClose={() => setRulesOpen(false)} />}
    </div>
  )
}
