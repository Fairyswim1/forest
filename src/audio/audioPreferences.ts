/** v2 — 이전 forest-audio-muted 설정은 무시하고 기본값 소리 켜짐 */
const STORAGE_KEY = 'forest-audio-muted-v2'
const LEGACY_KEY = 'forest-audio-muted'

function clearLegacyMutePreference(): void {
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
}

export function isAudioMuted(): boolean {
  clearLegacyMutePreference()
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setAudioMuted(muted: boolean): void {
  clearLegacyMutePreference()
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  } catch {
    // ignore quota / private mode
  }
}
