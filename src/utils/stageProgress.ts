import type { StageProgressStatus } from '../types/stage'
import { WORLD_MAP_STAGES } from '../config/stages'
import { isUnlockAllMode } from './devUnlock'

/** 스테이지 목록 — 월드맵 4맵 + 후속 실수 스테이지 */
export const STAGE_UNLOCK_ORDER = [
  'natural-1-1',
  'integer-1-1',
  'rational-1-1',
  'real-1-1',
  'real-1-2',
  'real-1-3',
] as const

export type UnlockableStageId = (typeof STAGE_UNLOCK_ORDER)[number]

const WORLD_MAP_STAGE_IDS = new Set(WORLD_MAP_STAGES.map((stage) => stage.id))

export function isUnlockableStageId(stageId: string): stageId is UnlockableStageId {
  return (STAGE_UNLOCK_ORDER as readonly string[]).includes(stageId)
}

/** 잠금·클리어 시스템 없이 월드맵 4맵은 항상 open */
export function getStageProgressStatus(stageId: string): StageProgressStatus {
  if (WORLD_MAP_STAGE_IDS.has(stageId)) return 'open'
  if (isUnlockAllMode() && isUnlockableStageId(stageId)) return 'open'
  return 'locked'
}

/** 플레이 진입 가능 여부 — 월드맵 4맵은 항상 입장 가능 */
export function canEnterStage(stageId: string): boolean {
  if (WORLD_MAP_STAGE_IDS.has(stageId)) return true
  return isUnlockAllMode() && isUnlockableStageId(stageId)
}
