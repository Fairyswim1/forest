import { COMMON_PATH_OVERLAY_HEIGHT } from '../game/pathLayouts/commonPathLayout'

/** 가로 6등분 지점에서 왼쪽 8칸(2%×8) */
const HERO_X_PERCENT = 100 / 6 - 16

/** 하단 잔디 — 위로 약 2줄(70px) */
const HERO_Y = 785

export const PLAY_BOARD_HERO_POSITION = {
  x: HERO_X_PERCENT,
  y: (HERO_Y / COMMON_PATH_OVERLAY_HEIGHT) * 100,
}
