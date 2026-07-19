import { BGM_URLS, SFX_URLS, type BgmId, type SfxId } from '../assets/audioAssets'
import { isAudioMuted, setAudioMuted } from './audioPreferences'
import type { WorldTheme } from '../types/stage'

const BGM_VOLUME = 0.32
const SFX_VOLUME = 0.5

let unlocked = false
let muted = isAudioMuted()
let bgm: HTMLAudioElement | null = null
let currentBgmId: BgmId | null = null
const sfxCache = new Map<SfxId, HTMLAudioElement>()

function ensureBgm(): HTMLAudioElement {
  if (!bgm) {
    bgm = new Audio(BGM_URLS.map)
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

function trackPathMatches(audioSrc: string, assetPath: string): boolean {
  try {
    return new URL(audioSrc, window.location.href).pathname.endsWith(assetPath)
  } catch {
    return audioSrc.includes(assetPath)
  }
}

function applyMuteToElements(): void {
  if (bgm) {
    bgm.muted = muted
    if (muted) {
      bgm.pause()
    } else if (unlocked && currentBgmId) {
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

  for (const id of Object.keys(SFX_URLS) as SfxId[]) {
    getSfxTemplate(id)
  }

  if (!muted && currentBgmId) {
    void bgmEl.play().catch(() => {})
  }
}

/** 타이틀·월드맵 기본 BGM */
export function playBgm(): void {
  playBgmTrack('map')
}

export function playBgmTrack(id: BgmId): void {
  unlockAudio()
  currentBgmId = id

  const bgmEl = ensureBgm()
  const nextUrl = BGM_URLS[id]

  if (!trackPathMatches(bgmEl.src || '', nextUrl)) {
    bgmEl.pause()
    bgmEl.src = nextUrl
    bgmEl.loop = true
    bgmEl.volume = BGM_VOLUME
  }

  bgmEl.muted = muted
  if (muted) return
  void bgmEl.play().catch(() => {})
}

export function bgmIdForWorldTheme(theme: WorldTheme): BgmId {
  switch (theme) {
    case 'cave':
      return 'cave'
    case 'meadow':
      return 'meadow'
    case 'space':
      return 'space'
    case 'forest':
    default:
      return 'forest'
  }
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
