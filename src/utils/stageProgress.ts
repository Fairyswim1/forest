import type { StageProgressStatus } from '../types/stage'
import { isStageComplete } from './gameRecords'

/** 스테이지 잠금 해제 순서 — 이전 스테이지 complete 시 다음 open */
export const STAGE_UNLOCK_ORDER = [
  'natural-1-1',
  'integer-1-1',
  'rational-1-1',
  'real-1-1',
  'real-1-2',
  'real-1-3',
] as const

export type UnlockableStageId = (typeof STAGE_UNLOCK_ORDER)[number]

export function isUnlockableStageId(stageId: string): stageId is UnlockableStageId {
  return (STAGE_UNLOCK_ORDER as readonly string[]).includes(stageId)
}

export function getStageProgressStatus(stageId: string): StageProgressStatus {
  if (!isUnlockableStageId(stageId)) return 'locked'
  if (isStageComplete(stageId)) return 'complete'

  const index = STAGE_UNLOCK_ORDER.indexOf(stageId)
  if (index === 0) return 'open'

  const previousId = STAGE_UNLOCK_ORDER[index - 1]!
  return isStageComplete(previousId) ? 'open' : 'locked'
}

/** 플레이 진입 가능 여부 */
export function canEnterStage(stageId: string): boolean {
  if (!isUnlockableStageId(stageId)) return import.meta.env.DEV
  const status = getStageProgressStatus(stageId)
  if (status !== 'locked') return true
  return import.meta.env.DEV
}
