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

export interface StageInfo {
  id: string
  chapter: string
  label: string
  topic: string
  locked: boolean
}

export const STAGE_1_1: StageInfo = {
  id: '1-1',
  chapter: '수의 숲',
  label: '수의 숲 1-1',
  topic: '정수의 대소관계',
  locked: false,
}

export const FOREST_STAGES: StageInfo[] = [
  STAGE_1_1,
  { id: '1-2', chapter: '수의 숲', label: '수의 숲 1-2', topic: '음수의 대소관계', locked: true },
  { id: '1-3', chapter: '수의 숲', label: '수의 숲 1-3', topic: '절댓값 비교', locked: true },
  { id: '1-4', chapter: '수의 숲', label: '수의 숲 1-4', topic: '양수와 음수 비교', locked: true },
  { id: '1-5', chapter: '수의 숲', label: '수의 숲 1-5', topic: '분수의 대소관계', locked: true },
  { id: '1-6', chapter: '수의 숲', label: '수의 숲 1-6', topic: '유리수의 대소관계', locked: true },
]

export const PLACEMENT_ANIMATION_MS = 650

/** 중앙 공개 유지 시간 */
export const CARD_REVEAL_HOLD_MS = 900

/** 중앙 → 하단 패널 이동 시간 */
export const CARD_REVEAL_FLY_MS = 550
