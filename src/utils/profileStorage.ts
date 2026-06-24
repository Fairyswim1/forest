const PROFILE_SEEN_KEY = 'forest-profile-seen'

export function hasSeenProfile(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(PROFILE_SEEN_KEY) === '1'
}

export function markProfileSeen(): void {
  window.localStorage.setItem(PROFILE_SEEN_KEY, '1')
}
