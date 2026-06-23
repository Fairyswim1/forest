import type { ReactNode } from 'react'
import { DEBUG_BOARD_PATH } from '../types/game'
import { getTilePositions } from '../utils/pathLayout'
import type { StagePathLayout } from '../game/pathLayouts/types'

interface BoardContainerProps {
  /** 스테이지별 오솔길 좌표 레이아웃 (오버레이 이미지 + 타일 좌표) */
  layout: StagePathLayout
  className?: string
  children?: ReactNode
  /** tiles-layer와 동일 좌표계 (예: 결과 화면 끊김 표시 SVG) */
  overlayLayer?: ReactNode
}

/** dev 모드에서 `?debug=anchors` 일 때 타일 중심 좌표를 점으로 표시한다. */
function isAnchorDebug(): boolean {
  if (DEBUG_BOARD_PATH) return true
  if (!import.meta.env.DEV) return false
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug') === 'anchors'
}

export function BoardContainer({ layout, className, children, overlayLayer }: BoardContainerProps) {
  const showAnchors = isAnchorDebug()

  return (
    <div className={['board-container', className].filter(Boolean).join(' ')}>
      <img
        className="trail-overlay"
        src={layout.overlayImageSrc}
        alt=""
        draggable={false}
        aria-hidden
      />

      {overlayLayer}

      <div className="tiles-layer">{children}</div>

      {showAnchors && (
        <div className="debug-layer" aria-hidden>
          {getTilePositions(layout).map(({ id, x, y }) => (
            <span
              key={id}
              className="debug-layer__anchor"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="debug-layer__dot" />
              <span className="debug-layer__label">{id}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
