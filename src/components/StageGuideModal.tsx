import { useEffect, useRef } from 'react'
import type { StageConfig } from '../types/stage'
import { ASSETS } from '../types/game'
import { GUIDE_ICONS } from '../assets/uiAssets'
import {
  STAGE_GUIDE_OBJECTIVE_MAIN,
  STAGE_GUIDE_OBJECTIVE_SUB,
  STAGE_GUIDE_OBJECTIVE_TITLE,
  STAGE_GUIDE_STRATEGY_DEFAULT,
} from '../config/stageGuideCopy'
import { MathRichText } from './MathRichText'
import { FantasyImageButton } from './ui/FantasyImageButton'
import { GuideSection } from './ui/GuideSection'

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
          </header>

          <div className="stage-guide-body" ref={bodyScrollRef}>
            <GuideSection
              icon={GUIDE_ICONS.flow}
              title="이번 스테이지에서 나오는 수"
              description={<MathRichText text={guide.numberRangeDescription} />}
            >
              <MathRichText text={guide.numberRangeLabel} />
            </GuideSection>

            <GuideSection icon={GUIDE_ICONS.goal} title={STAGE_GUIDE_OBJECTIVE_TITLE}>
              <p>{STAGE_GUIDE_OBJECTIVE_MAIN}</p>
              <p className="guide-section__note">{STAGE_GUIDE_OBJECTIVE_SUB}</p>
            </GuideSection>

            <GuideSection icon={GUIDE_ICONS.tip} title="전략 힌트">
              <MathRichText text={guide.strategyHint ?? STAGE_GUIDE_STRATEGY_DEFAULT} />
            </GuideSection>
          </div>

          <footer className="stage-guide-footer">
            <FantasyImageButton variant="confirm" size="md" onClick={onConfirm}>
              {confirmLabel}
            </FantasyImageButton>
          </footer>
        </div>
      </div>
    </div>
  )
}
