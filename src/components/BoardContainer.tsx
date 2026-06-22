import type { ReactNode } from 'react'
import { ASSETS, DEBUG_BOARD_PATH } from '../types/game'
import { getTilePositions } from '../utils/pathLayout'

interface BoardContainerProps {
  className?: string
  children?: ReactNode
  /** tiles-layer와 동일 좌표계 (예: 결과 화면 끊김 표시 SVG) */
  overlayLayer?: ReactNode
  trailOverlay?: string
}

export function BoardContainer({ className, children, overlayLayer, trailOverlay }: BoardContainerProps) {
  return (
    <div className={['board-container', className].filter(Boolean).join(' ')}>
      <img
        className="trail-overlay"
        src={trailOverlay ?? ASSETS.trailOverlay}
        alt=""
        draggable={false}
        aria-hidden
      />

      {overlayLayer}

      <div className="tiles-layer">{children}</div>

      {DEBUG_BOARD_PATH && (
        <div className="debug-layer" aria-hidden>
          {getTilePositions().map(({ id, x, y }) => (
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
