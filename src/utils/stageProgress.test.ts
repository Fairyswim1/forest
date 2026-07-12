import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as devUnlock from './devUnlock'
import { canEnterStage, getStageProgressStatus } from './stageProgress'

describe('stageProgress', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubEnv('DEV', false)
    vi.spyOn(devUnlock, 'isUnlockAllMode').mockReturnValue(false)
  })

  it('keeps all four world-map stages open and enterable', () => {
    expect(getStageProgressStatus('natural-1-1')).toBe('open')
    expect(getStageProgressStatus('integer-1-1')).toBe('open')
    expect(getStageProgressStatus('rational-1-1')).toBe('open')
    expect(getStageProgressStatus('real-1-1')).toBe('open')

    expect(canEnterStage('natural-1-1')).toBe(true)
    expect(canEnterStage('integer-1-1')).toBe(true)
    expect(canEnterStage('rational-1-1')).toBe(true)
    expect(canEnterStage('real-1-1')).toBe(true)
  })

  it('keeps non-map follow-up stages locked unless unlock-all is on', () => {
    expect(getStageProgressStatus('real-1-2')).toBe('locked')
    expect(canEnterStage('real-1-2')).toBe(false)

    vi.spyOn(devUnlock, 'isUnlockAllMode').mockReturnValue(true)
    expect(getStageProgressStatus('real-1-2')).toBe('open')
    expect(canEnterStage('real-1-2')).toBe(true)
  })
})
