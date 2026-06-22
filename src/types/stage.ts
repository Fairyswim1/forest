import type { GameCard, CardType } from './card'

export type { CardType }

export type ScoringMode = 'nonDecreasingRuns'

export interface StageConfig {
  id: string
  worldId: string
  title: string
  subtitle: string
  worldTitle: string
  cardType: CardType
  deckSize: number
  boardSize: number
  backgroundAsset: string
  trailAsset: string
  cardGenerator: () => GameCard[]
  scoringMode: ScoringMode
}

export interface WorldConfig {
  id: string
  title: string
  theme: string
  stages: StageConfig[]
}
