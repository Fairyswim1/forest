import { BOARD_DIRECTION_MARKERS } from '../../config/boardDirectionMarkers'
import { BoardDirectionMarker } from './BoardDirectionMarker'

interface BoardDirectionOverlayProps {
  variant?: 'play' | 'result'
}

export function BoardDirectionOverlay({ variant = 'play' }: BoardDirectionOverlayProps) {
  return (
    <div
      className={['board-direction-layer', `board-direction-layer--${variant}`].join(' ')}
      aria-hidden
    >
      {BOARD_DIRECTION_MARKERS.map((marker) => (
        <BoardDirectionMarker
          key={marker.id}
          type={marker.type}
          x={marker.x}
          y={marker.y}
          label={marker.label}
          direction={marker.direction}
          variant={variant}
        />
      ))}
    </div>
  )
}
