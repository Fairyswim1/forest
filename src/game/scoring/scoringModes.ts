import type { GameBoard } from '../../types/board'
import type { ScoringMode } from '../../types/stage'
import { calculateGameResult, type GameResult } from '../../utils/scoring'

export type Scorer = (board: GameBoard) => GameResult

const SCORERS: Record<ScoringMode, Scorer> = {
  nonDecreasingRuns: calculateGameResult,
}

export function resolveScorer(mode: ScoringMode): Scorer {
  return SCORERS[mode] ?? calculateGameResult
}
