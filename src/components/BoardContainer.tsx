import type { ReactNode } from 'react'
import { BoardDirectionOverlay } from './board/BoardDirectionOverlay'
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
  /** tiles-layer 위 맵 오버레이 (플레이어 캐릭터 등) */
  mapOverlay?: ReactNode
  /** 시작·도착·방향 화살표 오버레이 */
  showDirectionMarkers?: boolean
  directionMarkerVariant?: 'play' | 'result'
}

/** dev 모드에서 `?debug=anchors` 일 때 타일 중심 좌표를 점으로 표시한다. */
function isAnchorDebug(): boolean {
  if (DEBUG_BOARD_PATH) return true
  if (!import.meta.env.DEV) return false
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('debug') === 'anchors'
}

export function BoardContainer({
  layout,
  className,
  children,
  overlayLayer,
  mapOverlay,
  showDirectionMarkers = true,
  directionMarkerVariant = 'play',
}: BoardContainerProps) {
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

      {mapOverlay && <div className="board-character-layer">{mapOverlay}</div>}

      {showDirectionMarkers && (
        <BoardDirectionOverlay variant={directionMarkerVariant} />
      )}

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
