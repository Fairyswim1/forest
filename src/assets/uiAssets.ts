/** public/assets — Vite에서 URL 문자열로 참조 (import 금지) */

export const GUIDE_ICONS = {
  goal: '/assets/guide-icon-goal.png',
  flow: '/assets/guide-icon-flow.png',
  score: '/assets/guide-icon-score.png',
  undoTime: '/assets/guide-icon-undo-time.png',
  world: '/assets/guide-icon-world.png',
  tip: '/assets/guide-icon-tip.png',
} as const

const CONFIRM_FRAME = '/assets/processed/actions/confirm_button.png'
const UNDO_FRAME = '/assets/processed/actions/undo_button.png'

/**
 * 버튼 역할별 에셋 — public/assets/processed/actions 실측 결과:
 * - confirm_button.png (2091×637, RGBA) — 유일한 primary/confirm 에셋
 * - undo_button.png (2083×600, RGBA) — 유일한 secondary/undo 에셋
 * retry_button / worldmap_button / secondary_button 등 전용 파일 없음
 */
export const BUTTON_ASSETS = {
  /** Confirm / Proceed — 계속하기, 알겠어요!, 배치 완료, 모험 시작 */
  confirm: CONFIRM_FRAME,

  /** Undo / Back / Cancel — 다시 놓기, 뒤로 가기, 취소 */
  undo: UNDO_FRAME,

  /**
   * Retry — 다시 도전
   * TODO: retry_button.png 없음 → 우선순위 4 fallback으로 confirm_button 사용
   * (undo_button은 되돌리기 의미이므로 retry에 사용하지 않음)
   */
  retry: CONFIRM_FRAME,

  /**
   * Navigate — 월드맵으로, 월드 선택, 홈
   * TODO: worldmap_button.png / map_button.png 없음 → 우선순위 4 fallback으로 undo(secondary) 사용
   * (confirm은 primary 진행 액션이므로 navigate에 사용하지 않음)
   */
  worldMap: UNDO_FRAME,

  /** secondary_button.png 없음 — undo_button과 동일 */
  secondary: UNDO_FRAME,
} as const

export type ButtonAssetKey = keyof typeof BUTTON_ASSETS
