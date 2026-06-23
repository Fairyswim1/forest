import type { StageConfig } from '../types/stage'
import { STAGES, NATURAL_1_1, WORLD_MAP_STAGES } from './stages'

export const ACTIVE_STAGE_ID = 'natural-1-1'

export function getStageById(id: string): StageConfig | undefined {
  return STAGES.find((stage) => stage.id === id)
}

/** 월드맵 노드용 — 월드당 첫 스테이지 */
export function getStageByWorldId(worldId: string): StageConfig | undefined {
  return WORLD_MAP_STAGES.find((stage) => stage.worldId === worldId)
}

export function getPlayableStages(): StageConfig[] {
  return WORLD_MAP_STAGES
}

export function getActiveStage(): StageConfig {
  return getStageById(ACTIVE_STAGE_ID) ?? NATURAL_1_1
}
