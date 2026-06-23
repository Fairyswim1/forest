import type { StageConfig } from '../types/stage'
import { MathRichText } from './MathRichText'

interface StageGuideModalProps {
  stage: StageConfig
  /** 'start' = 시작 전 안내(게임 시작 버튼) / 'inplay' = 플레이 중 재확인(계속하기) */
  variant: 'start' | 'inplay'
  /** 흐릿하게 깔 배경 이미지 URL (플레이/월드맵 배경 재사용) */
  backgroundUrl: string
  /** 시작 모달: 게임 시작 / 플레이 중: 계속하기(닫기) */
  onConfirm: () => void
}

export function StageGuideModal({ stage, variant, backgroundUrl, onConfirm }: StageGuideModalProps) {
  const { guide } = stage
  const isInplay = variant === 'inplay'
  const confirmLabel = isInplay ? '계속하기' : '게임 시작'

  return (
    <div
      className={`stage-guide stage-guide--${variant}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${stage.title} 스테이지 안내`}
    >
      <div
        className="stage-guide__backdrop"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden
      />
      {/* 플레이 중에는 바깥 클릭으로도 닫을 수 있게 한다 */}
      {isInplay && (
        <button
          type="button"
          className="stage-guide__backdrop-close"
          onClick={onConfirm}
          aria-label="안내 닫기"
        />
      )}

      <div className="stage-guide__panel wood-panel">
        <div className="stage-guide__sheet">
          <header className="stage-guide__header">
            <p className="stage-guide__world">{stage.worldTitle}</p>
            <h2 className="stage-guide__title">{stage.title}</h2>
            <p className="stage-guide__subtitle">{stage.subtitle}</p>
          </header>

          <section className="stage-guide__section stage-guide__section--range">
            <h3 className="stage-guide__section-title">이번 스테이지에서 나오는 수</h3>
            <p className="stage-guide__range-label">
              <MathRichText text={guide.numberRangeLabel} />
            </p>
            <p className="stage-guide__range-desc">
              <MathRichText text={guide.numberRangeDescription} />
            </p>
          </section>

          <section className="stage-guide__section">
            <h3 className="stage-guide__section-title">목표</h3>
            <p className="stage-guide__text">
              <MathRichText text={guide.objectiveText} />
            </p>
          </section>

          {guide.strategyHint && (
            <section className="stage-guide__section stage-guide__section--hint">
              <h3 className="stage-guide__section-title">전략 힌트</h3>
              <p className="stage-guide__text">
                <MathRichText text={guide.strategyHint} />
              </p>
            </section>
          )}

          <button
            type="button"
            className="game-button game-button--confirm stage-guide__confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
