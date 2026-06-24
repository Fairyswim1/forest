import { useLayoutEffect, useMemo, useState, type RefObject } from 'react'
import { FantasyButton } from './ui/FantasyButton'
import { FantasyPanel } from './ui/FantasyPanel'

export type PlayTutorialTarget = 'card' | 'board' | 'confirm' | 'reset'

export interface PlayTutorialStep {
  id: PlayTutorialTarget
  message: string
}

export const PLAY_TUTORIAL_STEPS: PlayTutorialStep[] = [
  { id: 'card', message: '이번에 나온 수를 확인하세요!' },
  { id: 'board', message: '빈 칸을 클릭하면 수가 바로 배치됩니다.' },
  { id: 'confirm', message: '배치 완료를 누르면 다음 카드가 나옵니다.' },
  { id: 'reset', message: '다시 놓기로 이번 배치만 취소할 수 있어요.' },
  { id: 'board', message: '작은 수에서 큰 수로 이어지는 길을 길게 만드세요!' },
]

interface PlayTutorialProps {
  step: number
  cardRef: RefObject<HTMLElement | null>
  boardRef: RefObject<HTMLElement | null>
  confirmRef: RefObject<HTMLElement | null>
  resetRef: RefObject<HTMLElement | null>
  onNext: () => void
  onStart: () => void
}

const PANEL_EST_HEIGHT = 132
const VIEWPORT_MARGIN = 16

function getTargetRef(
  stepDef: PlayTutorialStep,
  refs: {
    cardRef: RefObject<HTMLElement | null>
    boardRef: RefObject<HTMLElement | null>
    confirmRef: RefObject<HTMLElement | null>
    resetRef: RefObject<HTMLElement | null>
  },
): RefObject<HTMLElement | null> {
  if (stepDef.id === 'card') return refs.cardRef
  if (stepDef.id === 'confirm') return refs.confirmRef
  if (stepDef.id === 'reset') return refs.resetRef
  return refs.boardRef
}

function spotlightPadding(stepIndex: number, target: PlayTutorialTarget): number {
  if (target === 'board' && stepIndex === 4) return 6
  if (target === 'board') return 10
  if (target === 'confirm' || target === 'reset') return 10
  return 14
}

function computePanelStyle(
  hole: { left: number; top: number; width: number; height: number },
  stepDef: PlayTutorialStep,
  step: number,
): { top: number; left: number; transform: string } {
  const cx = hole.left + hole.width / 2
  const gap = 14

  if (stepDef.id === 'confirm' || stepDef.id === 'reset' || stepDef.id === 'card') {
    const top = Math.max(VIEWPORT_MARGIN + PANEL_EST_HEIGHT, hole.top - gap)
    return { left: cx, top, transform: 'translate(-50%, -100%)' }
  }

  const belowTop = hole.top + hole.height + gap
  const aboveTop = hole.top - gap
  const fitsBelow = belowTop + PANEL_EST_HEIGHT <= window.innerHeight - VIEWPORT_MARGIN
  const fitsAbove = aboveTop - PANEL_EST_HEIGHT >= VIEWPORT_MARGIN

  if (step === 4 || (!fitsBelow && fitsAbove)) {
    const top = Math.max(VIEWPORT_MARGIN + PANEL_EST_HEIGHT, aboveTop)
    return { left: cx, top, transform: 'translate(-50%, -100%)' }
  }

  const top = Math.min(belowTop, window.innerHeight - VIEWPORT_MARGIN - PANEL_EST_HEIGHT)
  return { left: cx, top, transform: 'translate(-50%, 0)' }
}

export function PlayTutorial({
  step,
  cardRef,
  boardRef,
  confirmRef,
  resetRef,
  onNext,
  onStart,
}: PlayTutorialProps) {
  const stepDef = PLAY_TUTORIAL_STEPS[step]!
  const isLast = step >= PLAY_TUTORIAL_STEPS.length - 1
  const [spot, setSpot] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const targetRef = getTargetRef(stepDef, { cardRef, boardRef, confirmRef, resetRef })
      const el = targetRef.current
      setSpot(el ? el.getBoundingClientRect() : null)
    }

    measure()
    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [step, stepDef, cardRef, boardRef, confirmRef, resetRef])

  const pad = spotlightPadding(step, stepDef.id)
  const hole = spot
    ? {
        left: spot.left - pad,
        top: spot.top - pad,
        width: spot.width + pad * 2,
        height: spot.height + pad * 2,
      }
    : null

  const panelStyle = useMemo(() => {
    if (hole) return computePanelStyle(hole, stepDef, step)
    return {
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      transform: 'translate(-50%, -50%)',
    }
  }, [hole, stepDef, step])

  return (
    <div className="play-tutorial" role="dialog" aria-modal="true" aria-label="게임 튜토리얼">
      <div className="play-tutorial__shade" aria-hidden />

      {hole && (
        <div
          className="play-tutorial__spotlight"
          style={{
            left: hole.left,
            top: hole.top,
            width: hole.width,
            height: hole.height,
          }}
          aria-hidden
        />
      )}

      <FantasyPanel key={step} className="play-tutorial__panel" style={panelStyle}>
        <p className="play-tutorial__message">{stepDef.message}</p>
        <div className="play-tutorial__actions">
          <span className="play-tutorial__progress" aria-hidden>
            {step + 1} / {PLAY_TUTORIAL_STEPS.length}
          </span>
          {isLast ? (
            <FantasyButton variant="primary" size="sm" className="play-tutorial__btn" onClick={onStart}>
              시작하기
            </FantasyButton>
          ) : (
            <FantasyButton variant="primary" size="sm" className="play-tutorial__btn" onClick={onNext}>
              다음
            </FantasyButton>
          )}
        </div>
      </FantasyPanel>
    </div>
  )
}
