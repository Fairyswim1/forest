/** public/assets/audio — Vite에서 URL 문자열로 참조 (import 금지) */

export type BgmId = 'map' | 'forest' | 'cave' | 'meadow' | 'space'

export const AUDIO_ASSETS = {
  bgmMap: '/assets/audio/bgm-map.mp3',
  bgmForest: '/assets/audio/bgm-forest.mp3',
  bgmCave: '/assets/audio/bgm-cave.mp3',
  bgmMeadow: '/assets/audio/bgm-meadow.ogg',
  bgmSpace: '/assets/audio/bgm-space.ogg',
  sfxClick: '/assets/audio/sfx-click.wav',
  sfxPlace: '/assets/audio/sfx-place.wav',
  sfxConfirm: '/assets/audio/sfx-confirm.wav',
  sfxResult: '/assets/audio/sfx-result.wav',
} as const

export const BGM_URLS: Record<BgmId, string> = {
  map: AUDIO_ASSETS.bgmMap,
  forest: AUDIO_ASSETS.bgmForest,
  cave: AUDIO_ASSETS.bgmCave,
  meadow: AUDIO_ASSETS.bgmMeadow,
  space: AUDIO_ASSETS.bgmSpace,
}

export type SfxId = 'click' | 'place' | 'confirm' | 'result'

export const SFX_URLS: Record<SfxId, string> = {
  click: AUDIO_ASSETS.sfxClick,
  place: AUDIO_ASSETS.sfxPlace,
  confirm: AUDIO_ASSETS.sfxConfirm,
  result: AUDIO_ASSETS.sfxResult,
}
