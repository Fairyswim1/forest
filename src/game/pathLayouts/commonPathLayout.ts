import type { StagePathLayout, TileAnchorPx } from './types'
import type { TileId } from '../../types/game'

/**
 * 자연수의 숲 / 정수 동굴 공통 오솔길 좌표.
 * trail overlay는 동일한 1672×941 캔버스에 같은 경로 형태로 재스킨된다.
 * 상단 좌→우(1-6), 우측 U턴(7-9), 중단 우→좌(10-14), 좌측 U턴(15-16), 하단 좌→우(17-23).
 */
export const COMMON_PATH_OVERLAY_WIDTH = 1672
export const COMMON_PATH_OVERLAY_HEIGHT = 941
export const COMMON_TILE_SIZE = 155

export const COMMON_TILE_ANCHORS: Record<TileId, TileAnchorPx> = {
  1: { x: 250, y: 183 },
  2: { x: 405, y: 175 },
  3: { x: 560, y: 196 },
  4: { x: 715, y: 197 },
  5: { x: 870, y: 202 },
  6: { x: 1025, y: 194 },

  7: { x: 1183, y: 198 },
  8: { x: 1410, y: 280 },
  9: { x: 1330, y: 420 },

  10: { x: 1200, y: 466 },
  11: { x: 1045, y: 466 },
  12: { x: 890, y: 470 },
  13: { x: 735, y: 465 },
  14: { x: 580, y: 461 },

  15: { x: 390, y: 455 },
  16: { x: 250, y: 600 },

  17: { x: 410, y: 735 },
  18: { x: 565, y: 735 },
  19: { x: 720, y: 735 },
  20: { x: 875, y: 735 },
  21: { x: 1030, y: 735 },
  22: { x: 1185, y: 735 },
  23: { x: 1340, y: 735 },
}

/** 스테이지 trailAsset 경로에 맞춰 overlay만 바꾼 공통 레이아웃 */
export function resolvePathLayout(overlayImageSrc: string): StagePathLayout {
  return {
    overlayImageSrc,
    overlayWidth: COMMON_PATH_OVERLAY_WIDTH,
    overlayHeight: COMMON_PATH_OVERLAY_HEIGHT,
    tileSize: COMMON_TILE_SIZE,
    tileAnchors: COMMON_TILE_ANCHORS,
  }
}
