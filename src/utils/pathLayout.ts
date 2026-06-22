import { TOTAL_TILES, type TileId } from '../types/game'

export const PATH_ORDER: TileId[] = Array.from({ length: TOTAL_TILES }, (_, i) => i + 1)

/** trail overlay 원본 크기 — board-container aspect-ratio(1672/941)와 동일 */
export const TRAIL_OVERLAY = {
  width: 1672,
  height: 941,
  aspectRatio: 1672 / 941,
} as const

export interface TileAnchorPx {
  x: number
  y: number
}

export interface TileAnchorPercent {
  x: number
  y: number
}

/** overlay 원본 px 좌표 (가로 직선 구간 간격 155px) */
export const TILE_ANCHORS: Record<TileId, TileAnchorPx> = {
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
}

export interface TilePosition {
  id: TileId
  x: number
  y: number
  pathIndex: number
}

export function anchorPxToPercent(anchor: TileAnchorPx): TileAnchorPercent {
  return {
    x: (anchor.x / TRAIL_OVERLAY.width) * 100,
    y: (anchor.y / TRAIL_OVERLAY.height) * 100,
  }
}

export function getAnchorPercent(tileId: TileId): TileAnchorPercent {
  return anchorPxToPercent(TILE_ANCHORS[tileId])
}

/** board-container 내부 % 좌표 — 렌더링 전용 */
export function getTilePositions(): TilePosition[] {
  return PATH_ORDER.map((id) => {
    const { x, y } = getAnchorPercent(id)
    return {
      id,
      pathIndex: id - 1,
      x,
      y,
    }
  })
}

export function getPathNode(tileId: TileId): TileAnchorPercent {
  const node = TILE_ANCHORS[tileId]
  if (!node) throw new Error(`Unknown tile id: ${tileId}`)
  return getAnchorPercent(tileId)
}

export function getBreakMarkerMidpoints(
  breakAfterTileIds: Set<TileId>,
): Array<{ id: TileId; x: number; y: number }> {
  return PATH_ORDER.slice(0, -1)
    .filter((id) => breakAfterTileIds.has(id))
    .map((id) => {
      const nextId = PATH_ORDER[PATH_ORDER.indexOf(id) + 1]!
      const from = getPathNode(id)
      const to = getPathNode(nextId)
      return {
        id,
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2,
      }
    })
}
