import type { WorldConfig } from '../types/stage'
import { ASSETS } from '../types/game'

/** 통합 월드맵 — natural-forest · integer-cave · rational-meadow · real-starlight-space */
export const WORLDS: WorldConfig[] = [
  {
    id: 'natural-forest',
    title: '자연수의 숲',
    subtitle: '자연수의 대소관계',
    theme: 'forest',
  },
  {
    id: 'integer-cave',
    title: '정수 동굴',
    subtitle: '정수의 대소관계',
    theme: 'cave',
  },
  {
    id: 'rational-meadow',
    title: '유리수 초원',
    subtitle: '유리수의 대소관계',
    theme: 'meadow',
    mapBackgroundAsset: ASSETS.rationalMeadowWorldmapBg,
  },
  {
    id: 'real-starlight-space',
    title: '실수의 별빛 우주',
    subtitle: '제곱근의 대소관계',
    theme: 'space',
  },
]

export function getWorldById(id: string): WorldConfig | undefined {
  return WORLDS.find((world) => world.id === id)
}
