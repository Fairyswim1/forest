import type { BoardArrowDirection, BoardDirectionMarkerType } from '../../config/boardDirectionMarkers'

interface BoardDirectionMarkerProps {
  type: BoardDirectionMarkerType
  x: number
  y: number
  label?: string
  direction?: BoardArrowDirection
  variant?: 'play' | 'result'
}

function ArrowGlyph({ direction }: { direction: BoardArrowDirection }) {
  const path =
    direction === 'right'
      ? 'M6 14 L26 14 M20 8 L26 14 L20 20'
      : 'M26 14 L6 14 M12 8 L6 14 L12 20'

  return (
    <svg className="board-direction-marker__arrow-svg" viewBox="0 0 32 28" aria-hidden>
      <path d={path} />
    </svg>
  )
}

/** 오솔길 시작·도착·행 방향 표지 — 타일 좌표와 분리된 오버레이 */
export function BoardDirectionMarker({
  type,
  x,
  y,
  label,
  direction = 'right',
  variant = 'play',
}: BoardDirectionMarkerProps) {
  return (
    <div
      className={[
        'board-direction-marker',
        `board-direction-marker--${type}`,
        `board-direction-marker--${variant}`,
      ].join(' ')}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden
    >
      {type === 'arrow' ? (
        <ArrowGlyph direction={direction} />
      ) : (
        <span className="board-direction-marker__badge">
          {type === 'goal' && <span className="board-direction-marker__gem" aria-hidden />}
          <span className="board-direction-marker__label">{label}</span>
        </span>
      )}
    </div>
  )
}
