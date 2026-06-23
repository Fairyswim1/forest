import { ASSETS } from '../../types/game'
import type { StagePathLayout } from './types'

/**
 * 자연수의 숲 오솔길 레이아웃 (forest_playfield_bg / processed board_trail_overlay).
 * 상단 좌→우(1-6), 우측 U턴(7-9), 중단 우→좌(10-14), 좌측 U턴(15-16), 하단 좌→우(17-23).
 */
export const forestPathLayout: StagePathLayout = {
  overlayImageSrc: ASSETS.trailOverlay,
  overlayWidth: 1672,
  overlayHeight: 941,
  tileSize: 155,
  tileAnchors: {
    // 상단 길: 왼쪽 → 오른쪽
    1: { x: 250, y: 183 },
    2: { x: 405, y: 175 },
    3: { x: 560, y: 196 },
    4: { x: 715, y: 197 },
    5: { x: 870, y: 202 },
    6: { x: 1025, y: 194 },

    // 오른쪽 U자 (6 → 9)
    7: { x: 1183, y: 198 },
    8: { x: 1410, y: 280 },
    9: { x: 1330, y: 420 },

    // 가운데 길: 오른쪽 → 왼쪽
    10: { x: 1200, y: 466 },
    11: { x: 1045, y: 466 },
    12: { x: 890, y: 470 },
    13: { x: 735, y: 465 },
    14: { x: 580, y: 461 },

    // 왼쪽 U자 (14 → 16)
    15: { x: 390, y: 455 },
    16: { x: 250, y: 600 },

    // 하단 길: 왼쪽 → 오른쪽
    17: { x: 410, y: 735 },
    18: { x: 565, y: 735 },
    19: { x: 720, y: 735 },
    20: { x: 875, y: 735 },
    21: { x: 1030, y: 735 },
    22: { x: 1185, y: 735 },
    23: { x: 1340, y: 735 },
  },
}
