/** public/assets/audio — Vite에서 URL 문자열로 참조 (import 금지) */

export const AUDIO_ASSETS = {
  bgmMain: '/assets/audio/bgm-main.mp3',
  sfxClick: '/assets/audio/sfx-click.wav',
  sfxPlace: '/assets/audio/sfx-place.wav',
  sfxConfirm: '/assets/audio/sfx-confirm.wav',
  sfxResult: '/assets/audio/sfx-result.wav',
} as const

export type SfxId = 'click' | 'place' | 'confirm' | 'result'

export const SFX_URLS: Record<SfxId, string> = {
  click: AUDIO_ASSETS.sfxClick,
  place: AUDIO_ASSETS.sfxPlace,
  confirm: AUDIO_ASSETS.sfxConfirm,
  result: AUDIO_ASSETS.sfxResult,
}
