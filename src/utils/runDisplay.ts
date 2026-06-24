import {
  getScoringRunTheme,
  type RunColorToken,
  type ScoringRunTheme,
} from '../config/runBadges'
import type { TileId } from '../types/game'
import type { GameBoard } from '../types/board'
import { scoreRun, type Run } from './scoring'

export { getScoringRunTheme, type RunColorToken, type ScoringRunTheme }
export { RUN_BADGE_ASSETS, getRunBadgeAsset } from '../config/runBadges'

export const CIRCLED_RUN_LABELS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'] as const

export function getScoringRunLabel(scoringRunIndex: number): string {
  return CIRCLED_RUN_LABELS[scoringRunIndex] ?? `${scoringRunIndex + 1}`
}

/** 값 목록을 화살표로 연결. 6개 초과 시 앞 3개 + … + 뒤 2개 */
export function formatRunValuesArrow(values: number[]): string {
  if (values.length === 0) return '—'
  if (values.length <= 5) return values.join(' → ')
  const head = values.slice(0, 3).join(' → ')
  const tail = values.slice(-2).join(' → ')
  return `${head} → … → ${tail}`
}

export function formatRunDisplayValuesArrow(values: string[]): string {
  if (values.length === 0) return '—'
  if (values.length <= 5) return values.join(' → ')
  const head = values.slice(0, 3).join(' → ')
  const tail = values.slice(-2).join(' → ')
  return `${head} → … → ${tail}`
}

export interface RunDisplayMeta {
  run: Run
  runIndex: number
  isScoring: boolean
  scoringRunIndex: number
  points: number
}

/** 보드·점수판이 동일한 runs 배열 기준으로 번호를 매기도록 공유 */
export function buildRunDisplayMeta(runs: Run[]): RunDisplayMeta[] {
  let scoringCount = 0
  return runs.map((run, runIndex) => {
    const isScoring = run.length >= 2
    const scoringRunIndex = isScoring ? scoringCount++ : -1
    return {
      run,
      runIndex,
      isScoring,
      scoringRunIndex,
      points: scoreRun(run.length),
    }
  })
}

/** 결과 화면용 — 점수 있는 구간만 색상·배지·표시값을 묶는다 */
export interface ScoringRunView {
  id: number
  runIndex: number
  scoringRunIndex: number
  colorToken: RunColorToken
  color: string
  glow: string
  /** 구간 번호 배지 PNG — 보드 시작 타일·점수판 행에서 동일 이미지 사용 */
  badge: string
  label: string
  displayValues: string[]
  numericValues: number[]
  length: number
  score: number
  tileIds: TileId[]
}

export function buildScoringRunViews(runs: Run[], board: GameBoard): ScoringRunView[] {
  return buildRunDisplayMeta(runs)
    .filter((meta) => meta.isScoring)
    .map((meta) => {
      const theme = getScoringRunTheme(meta.scoringRunIndex)
      const displayValues = meta.run.tileIds
        .map((id) => board[id]?.displayValue)
        .filter((value): value is string => value !== undefined)

      return {
        id: meta.scoringRunIndex + 1,
        runIndex: meta.runIndex,
        scoringRunIndex: meta.scoringRunIndex,
        colorToken: theme.token,
        color: theme.color,
        glow: theme.glow,
        badge: theme.badge,
        label: getScoringRunLabel(meta.scoringRunIndex),
        displayValues,
        numericValues: meta.run.values,
        length: meta.run.length,
        score: meta.points,
        tileIds: meta.run.tileIds,
      }
    })
}

export function buildTileScoringRunMap(
  views: ScoringRunView[],
): Map<TileId, ScoringRunView> {
  const map = new Map<TileId, ScoringRunView>()
  for (const view of views) {
    for (const tileId of view.tileIds) {
      map.set(tileId, view)
    }
  }
  return map
}
