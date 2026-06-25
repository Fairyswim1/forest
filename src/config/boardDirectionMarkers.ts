import {
  COMMON_PATH_OVERLAY_HEIGHT,
  COMMON_PATH_OVERLAY_WIDTH,
  COMMON_TILE_ANCHORS,
} from '../game/pathLayouts/commonPathLayout'
import type { TileId } from '../types/game'

export type BoardDirectionMarkerType = 'start' | 'goal' | 'arrow'
export type BoardArrowDirection = 'left' | 'right'

export interface BoardDirectionMarkerConfig {
  id: string
  type: BoardDirectionMarkerType
  /** board-container % 좌표 */
  x: number
  y: number
  label?: string
  direction?: BoardArrowDirection
}

function toPercent(x: number, y: number): { x: number; y: number } {
  return {
    x: (x / COMMON_PATH_OVERLAY_WIDTH) * 100,
    y: (y / COMMON_PATH_OVERLAY_HEIGHT) * 100,
  }
}

function anchor(tileId: TileId) {
  return COMMON_TILE_ANCHORS[tileId]
}

function midpoint(tileA: TileId, tileB: TileId) {
  const a = anchor(tileA)
  const b = anchor(tileB)
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/**
 * 공통 path layout 좌표계 기준 방향 표지.
 * 타일 anchor 좌표는 변경하지 않고, 오프셋·중점만 사용한다.
 *
 * 경로: 1→6 (→), 7→9 (U턴), 10→14 (←), 15→16 (U턴), 17→23 (→)
 */
export const BOARD_DIRECTION_MARKERS: BoardDirectionMarkerConfig[] = [
  {
    id: 'start',
    type: 'start',
    label: '시작',
    ...toPercent(anchor(1).x - 58, anchor(1).y - 52),
  },
  {
    id: 'row-1-arrow',
    type: 'arrow',
    direction: 'right',
    ...toPercent(midpoint(3, 4).x, midpoint(3, 4).y - 28),
  },
  {
    id: 'row-2-arrow',
    type: 'arrow',
    direction: 'left',
    ...toPercent(midpoint(12, 13).x, midpoint(12, 13).y - 24),
  },
  {
    id: 'row-3-arrow',
    type: 'arrow',
    direction: 'right',
    ...toPercent(midpoint(20, 21).x, midpoint(20, 21).y - 22),
  },
  {
    id: 'goal',
    type: 'goal',
    label: '도착',
    ...toPercent(anchor(23).x + 52, anchor(23).y + 38),
  },
]
