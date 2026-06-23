import type { TileId } from '../../types/game'

export interface TileAnchorPx {
  x: number
  y: number
}

/**
 * 스테이지(월드)별 오솔길 좌표 레이아웃.
 * PATH_ORDER(타일 순서 1..23)는 모든 스테이지 공통이고,
 * 오버레이 이미지·크기·타일 중심 좌표만 스테이지마다 다르다.
 */
export interface StagePathLayout {
  /** 트레일 오버레이 이미지 (서빙 경로) — 좌표계가 이 이미지에 종속됨 */
  overlayImageSrc: string
  overlayWidth: number
  overlayHeight: number
  /** 타일 기준 크기(px) — 향후 타일 스케일링용 메타데이터 */
  tileSize: number
  /** overlay 원본 px 기준 타일 중심 좌표 */
  tileAnchors: Record<TileId, TileAnchorPx>
}
