import { COMMON_PATH_OVERLAY_HEIGHT } from '../game/pathLayouts/commonPathLayout'

/** 가로 5등분 — 왼쪽 1/5 칸 중앙(10%)에서 살짝 왼쪽 */
const HERO_X_PERCENT = 0

const HERO_Y = 855

export const PLAY_BOARD_HERO_POSITION = {
  x: HERO_X_PERCENT,
  y: (HERO_Y / COMMON_PATH_OVERLAY_HEIGHT) * 100,
}
