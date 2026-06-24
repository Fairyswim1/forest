import { useEffect, useRef } from 'react'
import type { StageConfig } from '../types/stage'
import { ASSETS } from '../types/game'
import { guideIconFlow, guideIconGoal, guideIconTip } from '../assets/guideIcons'
import { MathRichText } from './MathRichText'
import { FantasyButton } from './ui/FantasyButton'

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
  const bodyScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bodyScrollRef.current
    if (!el) return
    el.scrollTop = 0
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [stage.id])

  return (
    <div
      className="guide-overlay stage-guide-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${stage.title} 스테이지 안내`}
    >
      <div
        className="guide-overlay__bg"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden
      />
      <div className="guide-overlay__dim" aria-hidden />
      {isInplay && (
        <button
          type="button"
          className="guide-overlay__backdrop-close"
          onClick={onConfirm}
          aria-label="닫기"
        />
      )}

      <div className="stage-guide-modal__panel">
        <div className="stage-guide-frame" aria-hidden>
          <img
            className="stage-guide-frame__image"
            src={ASSETS.guideModalFrame}
            alt=""
            draggable={false}
          />
        </div>

        <div className="stage-guide-content">
          <header className="stage-guide-header">
            <p className="world-label">{stage.worldTitle}</p>
            <h2 className="stage-title">{stage.title}</h2>
            <p className="stage-subtitle">{stage.subtitle}</p>
          </header>

          <div className="stage-guide-body" ref={bodyScrollRef}>
            <section className="stage-guide-section">
              <img
                src={guideIconFlow}
                alt=""
                className="stage-guide-section-icon"
                aria-hidden="true"
                draggable={false}
              />
              <h3 className="section-label">이번 스테이지에서 나오는 수</h3>
              <p className="section-main">
                <MathRichText text={guide.numberRangeLabel} />
              </p>
              <p className="section-description">
                <MathRichText text={guide.numberRangeDescription} />
              </p>
            </section>

            <section className="stage-guide-section">
              <img
                src={guideIconGoal}
                alt=""
                className="stage-guide-section-icon"
                aria-hidden="true"
                draggable={false}
              />
              <h3 className="section-label">목표</h3>
              <p className="section-main">
                <MathRichText text={guide.objectiveText} />
              </p>
            </section>

            {guide.strategyHint && (
              <section className="stage-guide-section">
                <img
                  src={guideIconTip}
                  alt=""
                  className="stage-guide-section-icon"
                  aria-hidden="true"
                  draggable={false}
                />
                <h3 className="section-label">전략 힌트</h3>
                <p className="section-main">
                  <MathRichText text={guide.strategyHint} />
                </p>
              </section>
            )}
          </div>

          <footer className="stage-guide-footer">
            <FantasyButton variant="primary" size="full" onClick={onConfirm}>
              {confirmLabel}
            </FantasyButton>
          </footer>
        </div>
      </div>
    </div>
  )
}
