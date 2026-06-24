import { useEffect } from 'react'
import { GUIDE_RULE_SECTIONS } from '../config/guideRules'
import { ASSETS, GAME_TITLE } from '../types/game'
import { FantasyImageButton } from './ui/FantasyImageButton'
import { FantasyModalShell } from './ui/FantasyModalShell'
import { GuideSection } from './ui/GuideSection'

interface GameRulesModalProps {
  onClose: () => void
}

function GuideHeaderBanner() {
  return (
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
  )
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
    <FantasyModalShell
      ariaLabel="게임 방법"
      onBackdropClose={onClose}
      header={<GuideHeaderBanner />}
      footer={
        <FantasyImageButton variant="confirm" size="md" onClick={onClose}>
          알겠어요!
        </FantasyImageButton>
      }
    >
      {GUIDE_RULE_SECTIONS.map((section) => (
        <GuideSection key={section.id} icon={section.icon} title={section.title}>
          {section.body}
        </GuideSection>
      ))}
    </FantasyModalShell>
  )
}
