import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as devUnlock from './devUnlock'
import { markStageComplete } from './gameRecords'
import { canEnterStage, getStageProgressStatus } from './stageProgress'

function mockLocalStorage() {
  const store = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
  })
}

describe('stageProgress', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    mockLocalStorage()
    vi.stubEnv('DEV', false)
  })

  describe('unlock chain (UNLOCK_ALL_STAGES off)', () => {
    beforeEach(() => {
      vi.spyOn(devUnlock, 'isUnlockAllMode').mockReturnValue(false)
    })

    it('unlocks next stage after previous complete', () => {
      expect(getStageProgressStatus('integer-1-1')).toBe('locked')

      markStageComplete('natural-1-1')
      expect(getStageProgressStatus('natural-1-1')).toBe('complete')
      expect(getStageProgressStatus('integer-1-1')).toBe('open')
      expect(getStageProgressStatus('rational-1-1')).toBe('locked')

      markStageComplete('integer-1-1')
      expect(getStageProgressStatus('rational-1-1')).toBe('open')
      expect(getStageProgressStatus('real-1-1')).toBe('locked')

      markStageComplete('rational-1-1')
      expect(getStageProgressStatus('real-1-1')).toBe('open')

      markStageComplete('real-1-1')
      expect(getStageProgressStatus('real-1-2')).toBe('open')
    })

    it('blocks locked stages', () => {
      expect(canEnterStage('rational-1-1')).toBe(false)
      expect(canEnterStage('real-1-1')).toBe(false)
      expect(canEnterStage('natural-1-1')).toBe(true)
    })
  })

  describe('unlock all (UNLOCK_ALL_STAGES on)', () => {
    beforeEach(() => {
      vi.spyOn(devUnlock, 'isUnlockAllMode').mockReturnValue(true)
    })

    it('shows all stages as open before any progress', () => {
      expect(getStageProgressStatus('real-1-1')).toBe('open')
      expect(canEnterStage('real-1-1')).toBe(true)
      expect(canEnterStage('rational-1-1')).toBe(true)
    })
  })
})
