const STORAGE_KEY = 'number-trail-play-tutorial-v1'

export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'done'
  } catch {
    return false
  }
}

export function markTutorialCompleted(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'done')
  } catch {
    /* ignore quota / privacy mode */
  }
}
