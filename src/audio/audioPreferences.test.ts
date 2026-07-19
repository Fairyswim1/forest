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

  it('defaults to unmuted', () => {
    expect(isAudioMuted()).toBe(false)
  })

  it('persists mute preference', () => {
    setAudioMuted(true)
    expect(isAudioMuted()).toBe(true)
    setAudioMuted(false)
    expect(isAudioMuted()).toBe(false)
  })
})
