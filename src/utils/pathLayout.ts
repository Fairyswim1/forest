import { TOTAL_TILES, type TileId } from '../types/game'
import type { StagePathLayout, TileAnchorPx } from '../game/pathLayouts/types'

/** 타일 순서 — 모든 스테이지 공통 (점수/배치 기준 경로). */
export const PATH_ORDER: TileId[] = Array.from({ length: TOTAL_TILES }, (_, i) => i + 1)

export type { TileAnchorPx }

export interface TileAnchorPercent {
  x: number
  y: number
}

export interface TilePosition {
  id: TileId
  x: number
  y: number
  pathIndex: number
}

export function anchorPxToPercent(anchor: TileAnchorPx, layout: StagePathLayout): TileAnchorPercent {
  return {
    x: (anchor.x / layout.overlayWidth) * 100,
    y: (anchor.y / layout.overlayHeight) * 100,
  }
}

export function getAnchorPercent(layout: StagePathLayout, tileId: TileId): TileAnchorPercent {
  return anchorPxToPercent(layout.tileAnchors[tileId], layout)
}

/** board-container 내부 % 좌표 — 렌더링 전용 */
export function getTilePositions(layout: StagePathLayout): TilePosition[] {
  return PATH_ORDER.map((id) => {
    const { x, y } = getAnchorPercent(layout, id)
    return {
      id,
      pathIndex: id - 1,
      x,
      y,
    }
  })
}

export function getPathNode(layout: StagePathLayout, tileId: TileId): TileAnchorPercent {
  const node = layout.tileAnchors[tileId]
  if (!node) throw new Error(`Unknown tile id: ${tileId}`)
  return getAnchorPercent(layout, tileId)
}

export function getBreakMarkerMidpoints(
  layout: StagePathLayout,
  breakAfterTileIds: Set<TileId>,
): Array<{ id: TileId; x: number; y: number }> {
  return PATH_ORDER.slice(0, -1)
    .filter((id) => breakAfterTileIds.has(id))
    .map((id) => {
      const nextId = PATH_ORDER[PATH_ORDER.indexOf(id) + 1]!
      const from = getPathNode(layout, id)
      const to = getPathNode(layout, nextId)
      return {
        id,
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2,
      }
    })
}
