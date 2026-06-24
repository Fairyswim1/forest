/** 성공 구간 번호 배지 — processed PNG 경로 (public/assets/processed/result/) */
export const RUN_BADGE_ASSETS = {
  1: '/assets/processed/result/run-badge-01-gold.png',
  2: '/assets/processed/result/run-badge-02-mint.png',
  3: '/assets/processed/result/run-badge-03-sky.png',
  4: '/assets/processed/result/run-badge-04-pink.png',
  5: '/assets/processed/result/run-badge-05-purple.png',
  6: '/assets/processed/result/run-badge-06-coral.png',
  7: '/assets/processed/result/run-badge-07-emerald.png',
  8: '/assets/processed/result/run-badge-08-sapphire.png',
  9: '/assets/processed/result/run-badge-09-aurora.png',
} as const

export const RUN_BADGE_COUNT = 9

export type RunColorToken =
  | 'gold'
  | 'mint'
  | 'sky'
  | 'pink'
  | 'purple'
  | 'coral'
  | 'emerald'
  | 'sapphire'
  | 'aurora'

export interface ScoringRunTheme {
  id: number
  token: RunColorToken
  color: string
  glow: string
  badge: string
}

/**
 * 성공 구간 색상·배지 — 보드 외곽선·시작 배지·점수판 행이 동일 토큰을 공유한다.
 * badge 이미지 색감에 맞춘 CSS color token.
 */
export const SCORING_RUN_THEMES: readonly ScoringRunTheme[] = [
  { id: 1, token: 'gold', color: '#e8b84a', glow: 'rgba(232, 184, 74, 0.55)', badge: RUN_BADGE_ASSETS[1] },
  { id: 2, token: 'mint', color: '#5ecfaa', glow: 'rgba(94, 207, 170, 0.5)', badge: RUN_BADGE_ASSETS[2] },
  { id: 3, token: 'sky', color: '#5eb8f0', glow: 'rgba(94, 184, 240, 0.5)', badge: RUN_BADGE_ASSETS[3] },
  { id: 4, token: 'pink', color: '#f08ac8', glow: 'rgba(240, 138, 200, 0.5)', badge: RUN_BADGE_ASSETS[4] },
  { id: 5, token: 'purple', color: '#a878e8', glow: 'rgba(168, 120, 232, 0.5)', badge: RUN_BADGE_ASSETS[5] },
  { id: 6, token: 'coral', color: '#f07868', glow: 'rgba(240, 120, 104, 0.5)', badge: RUN_BADGE_ASSETS[6] },
  { id: 7, token: 'emerald', color: '#3cb878', glow: 'rgba(60, 184, 120, 0.5)', badge: RUN_BADGE_ASSETS[7] },
  { id: 8, token: 'sapphire', color: '#4a7fd4', glow: 'rgba(74, 127, 212, 0.5)', badge: RUN_BADGE_ASSETS[8] },
  { id: 9, token: 'aurora', color: '#b878f0', glow: 'rgba(184, 120, 240, 0.5)', badge: RUN_BADGE_ASSETS[9] },
] as const

/** 1-based 구간 번호 → 배지 URL. 10번째부터는 1~9 순환. */
export function getRunBadgeAsset(runNumber: number): string {
  const normalized = ((runNumber - 1) % RUN_BADGE_COUNT) + 1
  return RUN_BADGE_ASSETS[normalized as keyof typeof RUN_BADGE_ASSETS]
}

/** scoringRunIndex(0-based) → 테마. 9개 초과 시 순환. */
export function getScoringRunTheme(scoringRunIndex: number): ScoringRunTheme {
  return SCORING_RUN_THEMES[scoringRunIndex % SCORING_RUN_THEMES.length]!
}

/** 1-based run id → 테마 */
export function getScoringRunThemeById(runId: number): ScoringRunTheme {
  return getScoringRunTheme(runId - 1)
}
