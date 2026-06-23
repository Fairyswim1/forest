const STORAGE_KEY = 'number-trail-rules-seen-v1'

/** 첫 방문 시 게임 방법 안내를 자동으로 한 번 띄우기 위한 플래그. */
export function hasSeenRules(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'seen'
  } catch {
    return false
  }
}

export function markRulesSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'seen')
  } catch {
    /* ignore quota / privacy mode */
  }
}
