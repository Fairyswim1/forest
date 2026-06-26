import {
  COMMON_PATH_OVERLAY_HEIGHT,
  COMMON_PATH_OVERLAY_WIDTH,
  COMMON_TILE_ANCHORS,
} from '../game/pathLayouts/commonPathLayout'

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

/**
 * 공통 path layout 좌표계 기준 방향 표지.
 * 타일 anchor는 변경하지 않는다.
 *
 * 시작·도착·행 화살표는 오솔길 타일 위가 아니라
 * 맵 여백(위·아래 통로, 좌우 가장자리)에 배치해 타일에 가리지 않게 한다.
 *
 * 경로: 1→6 (→), 7→9 (U턴), 10→14 (←), 15→16 (U턴), 17→23 (→)
 */
export const BOARD_DIRECTION_MARKERS: BoardDirectionMarkerConfig[] = [
  {
    id: 'start',
    type: 'start',
    label: '시작',
    /* 1번 타일 왼쪽 위 — 상단 맵 여백 */
    ...toPercent(COMMON_TILE_ANCHORS[1].x - 35, 88),
  },
  {
    id: 'row-1-arrow',
    type: 'arrow',
    direction: 'right',
    /* 1행 위쪽 빈 맵 — 타일 3~4 사이 x, 상단 여백 y */
    ...toPercent(640, 102),
  },
  {
    id: 'row-2-arrow',
    type: 'arrow',
    direction: 'left',
    /* 2행과 3행 사이 통로 — 중단 행 중앙 x, 타일 아래 여백 y */
    ...toPercent(815, 568),
  },
  {
    id: 'row-3-arrow',
    type: 'arrow',
    direction: 'right',
    /* 3행 아래 맵 여백 — 하단 행 중앙 x */
    ...toPercent(960, 872),
  },
  {
    id: 'goal',
    type: 'goal',
    label: '도착',
    /* 23번 타일 오른쪽 아래 — 하단·우측 맵 여백 */
    ...toPercent(COMMON_TILE_ANCHORS[23].x + 118, 868),
  },
]
