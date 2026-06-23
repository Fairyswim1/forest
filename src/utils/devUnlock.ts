import { getStageById } from '../config/stageRegistry'

/**
 * QA 기간 — 로컬·배포 모두 전체 스테이지 오픈.
 * 출시 전 false 로 바꾸면 해금 체인이 다시 적용된다.
 */
export const UNLOCK_ALL_STAGES = true

export function isUnlockAllMode(): boolean {
  return UNLOCK_ALL_STAGES
}

/** ?stage=real-1-1 처럼 스테이지에 바로 진입 */
export function getStageIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  if (!isUnlockAllMode()) return null

  const stageId = new URLSearchParams(window.location.search).get('stage')
  if (!stageId) return null
  return getStageById(stageId) ? stageId : null
}
