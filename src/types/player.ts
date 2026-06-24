import type { CharacterId } from '../data/characters'

export interface PlayerProfile {
  uid: string
  nickname: string
  characterId: CharacterId
  characterName: string
  createdAt?: Date
  updatedAt?: Date
  lastPlayedAt?: Date
}

export interface StageResultEntry {
  uid: string
  stageId: string
  nickname: string
  characterId: CharacterId
  bestScore: number
  bestLongestRun: number
  clearCount: number
  lastScore: number
  lastLongestRun: number
  achievedAt?: Date
  updatedAt?: Date
}

export interface SaveStageResultInput {
  stageId: string
  score: number
  longestRun: number
  profile: Pick<PlayerProfile, 'uid' | 'nickname' | 'characterId'>
}
