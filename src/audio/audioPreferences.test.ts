import { beforeEach, describe, expect, it } from 'vitest'
import { isAudioMuted, setAudioMuted } from './audioPreferences'

function installMemoryLocalStorage() {
  const store = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
    },
  })
}

describe('audioPreferences', () => {
  beforeEach(() => {
    installMemoryLocalStorage()
  })

  it('defaults to unmuted and ignores legacy muted key', () => {
    localStorage.setItem('forest-audio-muted', '1')
    expect(isAudioMuted()).toBe(false)
    expect(localStorage.getItem('forest-audio-muted')).toBeNull()
  })

  it('persists mute preference on v2 key', () => {
    setAudioMuted(true)
    expect(isAudioMuted()).toBe(true)
    expect(localStorage.getItem('forest-audio-muted-v2')).toBe('1')
    setAudioMuted(false)
    expect(isAudioMuted()).toBe(false)
  })
})
