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
