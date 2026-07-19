import {
  COMMON_PATH_OVERLAY_HEIGHT,
  COMMON_PATH_OVERLAY_WIDTH,
} from '../game/pathLayouts/commonPathLayout'
import type { WorldTheme } from '../types/stage'

/**
 * 플레이 보드 **왼쪽 아래** 잔디 여백 (하단 행·좌측 U턴 서쪽).
 * 공통 path layout 1672×941 — x는 캐릭터 가로 중앙(translate -50%).
 *
 * 유리수의 초원 BG만 왼쪽 아래에 시냇물·울타리가 있어,
 * 같은 좌표면 물 위에 서 있는 것처럼 보이므로 meadow만 잔디 쪽으로 보정한다.
 */
const DEFAULT_HERO = { x: 11, y: 785 }
const MEADOW_HERO = { x: 140, y: 800 }

function toPercent(px: { x: number; y: number }) {
  return {
    x: (px.x / COMMON_PATH_OVERLAY_WIDTH) * 100,
    y: (px.y / COMMON_PATH_OVERLAY_HEIGHT) * 100,
  }
}

export const PLAY_BOARD_HERO_POSITION = toPercent(DEFAULT_HERO)

export function getPlayBoardHeroPosition(theme: WorldTheme = 'forest') {
  return toPercent(theme === 'meadow' ? MEADOW_HERO : DEFAULT_HERO)
}
