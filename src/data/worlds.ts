import { createDeck } from '../utils/deck'
import type { StageConfig, WorldConfig } from '../types/stage'

export const STAGE_FOREST_1_1: StageConfig = {
  id: '1-1',
  worldId: 'forest',
  title: '수의 숲 1-1',
  subtitle: '정수의 대소관계',
  worldTitle: '수의 숲',
  cardType: 'integer',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: '/assets/forest_playfield_bg.png',
  trailAsset: '/assets/processed/board_trail_overlay.png',
  cardGenerator: () => createDeck(23),
  scoringMode: 'nonDecreasingRuns',
}

/** @deprecated use STAGE_FOREST_1_1 */
export const STAGE_INTEGER_1_1 = STAGE_FOREST_1_1

export const WORLD_NATURAL: WorldConfig = {
  id: 'natural-forest',
  title: '자연수의 숲',
  theme: 'forest',
  stages: [],
}

export const WORLD_INTEGER: WorldConfig = {
  id: 'integer-cave',
  title: '음수 동굴',
  theme: 'cave',
  stages: [STAGE_INTEGER_1_1],
}

export const WORLD_RATIONAL: WorldConfig = {
  id: 'rational-meadow',
  title: '분수 초원',
  theme: 'meadow',
  stages: [],
}

export const WORLD_REAL: WorldConfig = {
  id: 'real-crystal-mountain',
  title: '실수의 수정산',
  theme: 'mountain',
  stages: [],
}

export const ALL_WORLDS: WorldConfig[] = [
  WORLD_NATURAL,
  WORLD_INTEGER,
  WORLD_RATIONAL,
  WORLD_REAL,
]

/** 현재 플레이 가능한 스테이지 */
export const ACTIVE_STAGE = STAGE_FOREST_1_1
