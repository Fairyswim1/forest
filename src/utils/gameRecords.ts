const STORAGE_KEY = 'number-trail-best-scores'

function readAll(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

function writeAll(scores: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export function getStageBestScore(stageId: string): number | null {
  const scores = readAll()
  return scores[stageId] ?? null
}

export function updateStageBestScore(
  stageId: string,
  score: number,
): { isNewRecord: boolean; bestScore: number } {
  const scores = readAll()
  const prev = scores[stageId] ?? null
  const isNewRecord = prev === null || score > prev

  if (isNewRecord) {
    scores[stageId] = score
    writeAll(scores)
    return { isNewRecord: true, bestScore: score }
  }

  return { isNewRecord: false, bestScore: prev }
}

/* ── 스테이지 완료 상태 (complete) — localStorage 기반 ─────────────────── */

const PROGRESS_KEY = 'number-trail-stage-progress'

function readProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return {}
  }
}

export function isStageComplete(stageId: string): boolean {
  return readProgress()[stageId] === true
}

export function markStageComplete(stageId: string): void {
  const progress = readProgress()
  if (progress[stageId]) return
  progress[stageId] = true
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* 저장 실패는 무시 (진행 상태는 보조 정보) */
  }
}
