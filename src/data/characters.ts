export type CharacterId =
  | 'explorer-01'
  | 'mage-01'
  | 'fairy-01'
  | 'knight-01'
  | 'alchemist-01'
  | 'starlight-01'

export type CharacterConfig = {
  id: CharacterId
  name: string
  description: string
  assetUrl: string
  accent: string
}

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'explorer-01',
    name: '숲 모험가',
    description: '호기심 많은 기본 모험가',
    assetUrl: '/assets/characters/character-explorer-01.png',
    accent: 'forest',
  },
  {
    id: 'mage-01',
    name: '마법사',
    description: '수의 비밀을 읽는 현자',
    assetUrl: '/assets/characters/character-mage-01.png',
    accent: 'magic',
  },
  {
    id: 'fairy-01',
    name: '초원 요정',
    description: '부드러운 길잡이 요정',
    assetUrl: '/assets/characters/character-fairy-01.png',
    accent: 'meadow',
  },
  {
    id: 'knight-01',
    name: '기사',
    description: '단단한 의지의 수호자',
    assetUrl: '/assets/characters/character-knight-01.png',
    accent: 'knight',
  },
  {
    id: 'alchemist-01',
    name: '연금술사',
    description: '숫자를 조합하는 연구가',
    assetUrl: '/assets/characters/character-alchemist-01.png',
    accent: 'alchemy',
  },
  {
    id: 'starlight-01',
    name: '별빛 탐험가',
    description: '먼 우주를 향한 탐험가',
    assetUrl: '/assets/characters/character-starlight-01.png',
    accent: 'starlight',
  },
]

export function getCharacterById(id: CharacterId): CharacterConfig | undefined {
  return CHARACTERS.find((character) => character.id === id)
}

export function isCharacterId(value: string): value is CharacterId {
  return CHARACTERS.some((character) => character.id === value)
}
