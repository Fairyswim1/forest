import type { StageConfig } from '../types/stage'
import { ASSETS } from '../types/game'
import { MathRichText } from './MathRichText'
import { FantasyButton } from './ui/FantasyButton'
import { FantasyModalShell } from './ui/FantasyModalShell'

interface StageGuideModalProps {
  stage: StageConfig
  variant: 'start' | 'inplay'
  backgroundUrl: string
  onConfirm: () => void
}

export function StageGuideModal({ stage, variant, backgroundUrl, onConfirm }: StageGuideModalProps) {
  const { guide } = stage
  const isInplay = variant === 'inplay'
  const confirmLabel = isInplay ? '계속하기' : '게임 시작'

  return (
    <FantasyModalShell
      ariaLabel={`${stage.title} 스테이지 안내`}
      backgroundUrl={backgroundUrl}
      onBackdropClose={isInplay ? onConfirm : undefined}
      header={
        <div className="guide-header__banner-wrap guide-header__banner-wrap--stage">
          <img
            className="guide-header__banner"
            src={ASSETS.guideHeaderBanner}
            alt=""
            draggable={false}
          />
          <div className="guide-header__copy">
            <p className="guide-header__stage-world">{stage.worldTitle}</p>
            <h2 className="guide-header__stage-title">{stage.title}</h2>
            <p className="guide-header__stage-sub">{stage.subtitle}</p>
          </div>
        </div>
      }
      footer={
        <FantasyButton variant="primary" size="full" onClick={onConfirm}>
          {confirmLabel}
        </FantasyButton>
      }
    >
      <section className="fantasy-section fantasy-section--range">
        <h3 className="fantasy-section__title">이번 스테이지에서 나오는 수</h3>
        <p className="fantasy-section__range-label">
          <MathRichText text={guide.numberRangeLabel} />
        </p>
        <p className="fantasy-section__range-desc">
          <MathRichText text={guide.numberRangeDescription} />
        </p>
      </section>

      <section className="fantasy-section">
        <h3 className="fantasy-section__title">목표</h3>
        <p className="fantasy-section__text">
          <MathRichText text={guide.objectiveText} />
        </p>
      </section>

      {guide.strategyHint && (
        <section className="fantasy-section">
          <h3 className="fantasy-section__title">전략 힌트</h3>
          <p className="fantasy-section__text">
            <MathRichText text={guide.strategyHint} />
          </p>
        </section>
      )}
    </FantasyModalShell>
  )
}
