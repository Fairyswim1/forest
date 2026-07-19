import { AUDIO_ASSETS, SFX_URLS, type SfxId } from '../assets/audioAssets'
import { isAudioMuted, setAudioMuted } from './audioPreferences'

const BGM_VOLUME = 0.28
const SFX_VOLUME = 0.55

let unlocked = false
let muted = isAudioMuted()
let bgm: HTMLAudioElement | null = null
const sfxCache = new Map<SfxId, HTMLAudioElement>()

function ensureBgm(): HTMLAudioElement {
  if (!bgm) {
    bgm = new Audio(AUDIO_ASSETS.bgmMain)
    bgm.loop = true
    bgm.preload = 'auto'
    bgm.volume = BGM_VOLUME
  }
  return bgm
}

function getSfxTemplate(id: SfxId): HTMLAudioElement {
  let audio = sfxCache.get(id)
  if (!audio) {
    audio = new Audio(SFX_URLS[id])
    audio.preload = 'auto'
    audio.volume = SFX_VOLUME
    sfxCache.set(id, audio)
  }
  return audio
}

function applyMuteToElements(): void {
  if (bgm) {
    bgm.muted = muted
    if (muted) {
      bgm.pause()
    } else if (unlocked) {
      void bgm.play().catch(() => {})
    }
  }
}

/** 브라우저 autoplay 정책 해제를 위해 사용자 제스처 안에서 호출 */
export function unlockAudio(): void {
  if (unlocked) return
  unlocked = true

  const bgmEl = ensureBgm()
  bgmEl.muted = muted

  // 짧은 무음 재생으로 AudioContext/HTMLAudio unlock
  for (const id of Object.keys(SFX_URLS) as SfxId[]) {
    getSfxTemplate(id)
  }

  if (!muted) {
    void bgmEl.play().catch(() => {})
  }
}

export function playBgm(): void {
  unlockAudio()
  if (muted) return
  const bgmEl = ensureBgm()
  bgmEl.muted = false
  void bgmEl.play().catch(() => {})
}

export function stopBgm(): void {
  if (!bgm) return
  bgm.pause()
  bgm.currentTime = 0
}

export function playSfx(id: SfxId): void {
  if (muted) return
  unlockAudio()

  const template = getSfxTemplate(id)
  const node = template.cloneNode(true) as HTMLAudioElement
  node.volume = SFX_VOLUME
  void node.play().catch(() => {})
}

export function getMuted(): boolean {
  return muted
}

export function setMuted(next: boolean): void {
  muted = next
  setAudioMuted(next)
  applyMuteToElements()
}

export function toggleMuted(): boolean {
  setMuted(!muted)
  return muted
}
