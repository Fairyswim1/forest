import { useEffect } from 'react'
import { GUIDE_RULE_SECTIONS } from '../config/guideRules'
import { ASSETS, GAME_TITLE } from '../types/game'

interface GameRulesModalProps {
  onClose: () => void
}

export function GameRulesModal({ onClose }: GameRulesModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="guide-overlay" role="dialog" aria-modal="true" aria-label="게임 방법">
      <div
        className="guide-overlay__bg"
        style={{ backgroundImage: `url(${ASSETS.worldmapBg})` }}
        aria-hidden
      />
      <div className="guide-overlay__dim" aria-hidden />
      <button
        type="button"
        className="guide-overlay__backdrop-close"
        onClick={onClose}
        aria-label="닫기"
      />

      <div className="guide-modal">
        <img
          className="guide-modal__frame"
          src={ASSETS.guideModalFrame}
          alt=""
          draggable={false}
        />

        <div className="guide-modal__content">
          <header className="guide-header">
            <div className="guide-header__banner-wrap">
              <img
                className="guide-header__banner"
                src={ASSETS.guideHeaderBanner}
                alt=""
                draggable={false}
              />
              <div className="guide-header__copy">
                <p className="guide-header__label">게임 방법</p>
                <h2 className="guide-header__title">{GAME_TITLE}</h2>
              </div>
            </div>
          </header>

          <div className="guide-scroll-content">
            {GUIDE_RULE_SECTIONS.map((section) => (
              <section key={section.id} className="guide-section">
                <div className="guide-section__heading">
                  <img
                    className="guide-section__icon"
                    src={section.icon}
                    alt=""
                    draggable={false}
                  />
                  <h3 className="guide-section__title">{section.title}</h3>
                </div>
                <p className="guide-section__body">{section.body}</p>
              </section>
            ))}
          </div>

          <footer className="guide-footer">
            <button
              type="button"
              className="game-button game-button--confirm guide-footer__confirm"
              onClick={onClose}
            >
              알겠어요!
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
