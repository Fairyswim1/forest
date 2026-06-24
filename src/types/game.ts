import type { GameCard } from './card'

export const GAME_TITLE = '넘버 트레일 : 수의 모험'

export const SHOW_TILE_INDEX = false

/** 타일 anchor(빨간 점) + 번호 — 길 중심 정렬 확인용 */
export const DEBUG_BOARD_PATH = false

export const TOTAL_TILES = 23
export const TOTAL_ROUNDS = 23
export const TURN_SECONDS = 24

/** assets/processed — 체크무늬 제거 후 투명 PNG (public/assets/processed 서빙) */
export const ASSETS = {
  emptyTile: '/assets/processed/tiles/empty_tile.png',
  selectedTile: '/assets/processed/tiles/selected_tile.png',
  /** 스타일 참고용 — 게임 중 HTML 숫자 오버레이 사용 */
  placedTile: '/assets/processed/tiles/placed_tile.png',
  successTile: '/assets/processed/tiles/success_tile.png',
  cardFrame: '/assets/processed/cards/current_card.png',
  actionConfirmFrame: '/assets/processed/actions/confirm_button.png',
  actionUndoFrame: '/assets/processed/actions/undo_button.png',
  playfieldBg: '/assets/forest_playfield_bg.png',
  trailOverlay: '/assets/processed/board_trail_overlay.png',
  hudStageFrame: '/assets/processed/hud/stage_frame.png',
  hudRoundFrame: '/assets/processed/hud/round_frame.png',
  hudScoreFrame: '/assets/processed/hud/score_frame.png',
  hudStarIcon: '/assets/processed/hud/star_icon.png',
  hudMenuFrame: '/assets/processed/hud/menu_button.png',
  worldmapBg: '/assets/worldmap.png',
  stageNodeOpen: '/assets/processed/worldmap/open.png',
  stageNodeDefault: '/assets/processed/worldmap/node.png',
  stageNodeClosed: '/assets/processed/worldmap/close.png',
  // 정수 동굴 전용 지역 노드 (상태별) — 통합 월드맵에서 사용
  caveNodeOpen: '/assets/integer-cave-node-open.png',
  caveNodeLocked: '/assets/integer-cave-node-locked.png',
  caveNodeComplete: '/assets/integer-cave-node-complete.png',
  integerCavePlayfieldBg: '/assets/integer-cave-play-bg.png',
  integerCaveTrailOverlay: '/assets/processed/integer-cave-trail-overlay.png',
  rationalMeadowPlayfieldBg: '/assets/rational-meadow-play-bg.png',
  rationalMeadowTrailOverlay: '/assets/processed/rational-meadow-trail-overlay.png',
  rationalMeadowWorldmapBg: '/assets/rational-meadow-worldmap-bg.png',
  meadowNodeOpen: '/assets/processed/rational-meadow/node-open.png',
  meadowNodeLocked: '/assets/processed/rational-meadow/node-locked.png',
  meadowNodeComplete: '/assets/processed/rational-meadow/node-complete.png',
  starlightPlayfieldBg: '/assets/real-starlight-space-play-bg.png',
  starlightTrailOverlay: '/assets/processed/real-starlight-space-trail-overlay.png',
  starlightNodeOpen: '/assets/processed/real-starlight-space/node-open.png',
  starlightNodeLocked: '/assets/processed/real-starlight-space/node-locked.png',
  starlightNodeComplete: '/assets/processed/real-starlight-space/node-complete.png',
  scoreBreakdownPanel: '/assets/processed/panels/score-breakdown-panel.png',
  // 결과 화면 프레임 (체커보드 배경 제거된 투명 PNG — 콘텐츠는 HTML/CSS로 오버레이)
  resultBannerFrame: '/assets/processed/result/result-completion-banner-frame.png',
  resultScorePanelFrame: '/assets/processed/result/result-run-score-panel-frame.png',
} as const

export type TileId = number
export type TileState = 'empty' | 'selected' | 'placed' | 'success'

export interface TilePlacement {
  tileId: TileId
  value: number
}

export type GamePhase = 'intro' | 'playing' | 'finished'

export type CardPhase = 'hidden' | 'center' | 'panel' | 'placing'

/** 현재 턴 임시 배치 상태 */
export interface CurrentTurnPlacement {
  cardId: string
  tileId: TileId | null
  isCommitted: boolean
}

export interface PendingPlacement {
  tileId: TileId
  card: GameCard
}

export const PLACEMENT_ANIMATION_MS = 650

/** 중앙 공개 유지 시간 */
export const CARD_REVEAL_HOLD_MS = 900

/** 중앙 → 하단 패널 이동 시간 */
export const CARD_REVEAL_FLY_MS = 550
