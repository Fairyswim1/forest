const STORAGE_KEY = 'number-trail-play-tutorial-v1'
let completedInTab = false
export function isTutorialCompleted(): boolean {
  if (completedInTab) return true
  try { if (localStorage.getItem(STORAGE_KEY) === 'done') return true } catch {}
  try { return sessionStorage.getItem(STORAGE_KEY) === 'done' } catch { return false }
}
export function markTutorialCompleted(): void {
  completedInTab = true
  try { localStorage.setItem(STORAGE_KEY, 'done'); return } catch {}
  try { sessionStorage.setItem(STORAGE_KEY, 'done') } catch {}
}
