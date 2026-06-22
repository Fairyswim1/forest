import { scoreRun, type Run } from './scoring'

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
