import { ASSETS } from '../../types/game'
import { resolvePathLayout } from './commonPathLayout'
import { forestPathLayout } from './forestPathLayout'
import type { StagePathLayout } from './types'

export type { StagePathLayout, TileAnchorPx } from './types'
export {
  COMMON_PATH_OVERLAY_HEIGHT,
  COMMON_PATH_OVERLAY_WIDTH,
  COMMON_TILE_ANCHORS,
  COMMON_TILE_SIZE,
  resolvePathLayout,
} from './commonPathLayout'
export { forestPathLayout }

const STAGE_TRAIL_ASSETS: Record<string, string> = {
  'natural-1-1': ASSETS.trailOverlay,
  'integer-1-1': ASSETS.integerCaveTrailOverlay,
  'rational-1-1': ASSETS.rationalMeadowTrailOverlay,
  'real-1-1': ASSETS.starlightTrailOverlay,
  'real-1-2': ASSETS.starlightTrailOverlay,
  'real-1-3': ASSETS.starlightTrailOverlay,
}

export function getStagePathLayout(stageId: string): StagePathLayout {
  const trailAsset = STAGE_TRAIL_ASSETS[stageId] ?? ASSETS.trailOverlay
  return resolvePathLayout(trailAsset)
}

/** trailAsset URL 기준 공통 anchor 레이아웃 */
export function getPathLayoutForTrailAsset(trailAsset: string): StagePathLayout {
  return resolvePathLayout(trailAsset)
}
