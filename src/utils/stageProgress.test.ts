import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    mockLocalStorage()
    vi.stubEnv('DEV', false)
  })

  it('unlocks next stage after previous complete in production', () => {
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

  it('allows dev bypass for locked stages', () => {
    vi.stubEnv('DEV', true)
    expect(getStageProgressStatus('real-1-1')).toBe('locked')
    expect(canEnterStage('real-1-1')).toBe(true)
  })

  it('blocks locked stages in production', () => {
    expect(canEnterStage('rational-1-1')).toBe(false)
    expect(canEnterStage('real-1-1')).toBe(false)
    expect(canEnterStage('natural-1-1')).toBe(true)
  })
})
