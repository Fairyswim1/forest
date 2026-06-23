import { ASSETS } from '../types/game'
import {
  generateBasicSqrtDeck,
  generateIntegerDeck,
  generateNaturalDeck,
  generateRationalDeck,
  generateRealDeck,
} from '../game/cards/generators'
import { integerFeedback, naturalFeedback } from '../utils/resultFeedback'
import { rationalFeedback, sqrtFeedback } from './stageFeedback'
import type { StageConfig } from '../types/stage'

export const NATURAL_1_1: StageConfig = {
  id: 'natural-1-1',
  worldId: 'natural-forest',
  title: '자연수의 숲 1-1',
  subtitle: '자연수의 대소관계',
  worldTitle: '자연수의 숲',
  cardType: 'natural',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.playfieldBg,
  trailAsset: ASSETS.trailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '1부터 30까지의 자연수',
    numberRangeDescription: '0, 음수, 분수는 나오지 않습니다.',
    objectiveText: '작은 수에서 큰 수로 이어지는 길을 길게 만드세요.',
    strategyHint: '작은 수는 앞쪽, 큰 수는 뒤쪽에 둘 자리를 남겨 두세요.',
  },
  feedback: naturalFeedback,
  cardGenerator: generateNaturalDeck,
}

export const INTEGER_1_1: StageConfig = {
  id: 'integer-1-1',
  worldId: 'integer-cave',
  title: '정수 동굴 1-1',
  subtitle: '정수의 대소관계',
  worldTitle: '정수 동굴',
  cardType: 'integer',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.integerCavePlayfieldBg,
  trailAsset: ASSETS.integerCaveTrailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '-20부터 20까지의 정수',
    numberRangeDescription: '음수, 0, 양수가 모두 나올 수 있습니다.',
    objectiveText: '작은 수에서 큰 수로 이어지는 길을 길게 만드세요.',
    strategyHint: '음수는 절댓값이 클수록 더 작은 수입니다.',
  },
  feedback: integerFeedback,
  cardGenerator: generateIntegerDeck,
}

export const RATIONAL_1_1: StageConfig = {
  id: 'rational-1-1',
  worldId: 'rational-meadow',
  title: '유리수 초원 1-1',
  subtitle: '유리수의 대소관계',
  worldTitle: '유리수 초원',
  cardType: 'rational',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.rationalMeadowPlayfieldBg,
  trailAsset: ASSETS.rationalMeadowTrailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '-3부터 3 사이의 유리수',
    numberRangeDescription: '정수, 분수, 소수가 함께 나올 수 있습니다.',
    objectiveText: '작은 수부터 큰 수까지 이어지는 길을 길게 만드세요.',
    strategyHint: '분수와 소수는 서로 다른 모습이어도 같은 값일 수 있습니다.',
  },
  feedback: rationalFeedback,
  cardGenerator: generateRationalDeck,
}

export const REAL_1_1: StageConfig = {
  id: 'real-1-1',
  worldId: 'real-starlight-space',
  title: '실수의 별빛 우주 1-1',
  subtitle: '제곱근의 대소관계',
  worldTitle: '실수의 별빛 우주',
  cardType: 'real',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.starlightPlayfieldBg,
  trailAsset: ASSETS.starlightTrailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '0부터 √10까지의 수',
    numberRangeDescription: '정수와 제곱근이 함께 나옵니다.',
    objectiveText: '작은 수부터 큰 수까지 이어지는 길을 길게 만드세요.',
    strategyHint: '√n의 크기는 n이 어떤 두 완전제곱수 사이에 있는지 생각하면 알 수 있습니다.',
  },
  feedback: sqrtFeedback,
  cardGenerator: generateBasicSqrtDeck,
}

export const REAL_1_2: StageConfig = {
  id: 'real-1-2',
  worldId: 'real-starlight-space',
  title: '실수의 별빛 우주 1-2',
  subtitle: '음의 제곱근의 대소관계',
  worldTitle: '실수의 별빛 우주',
  cardType: 'real',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.starlightPlayfieldBg,
  trailAsset: ASSETS.starlightTrailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '-√7부터 √5까지의 수',
    numberRangeDescription: '음의 제곱근까지 포함한 실수가 나옵니다.',
    objectiveText: '작은 수부터 큰 수까지 이어지는 길을 길게 만드세요.',
    strategyHint: '음의 제곱근은 절댓값이 클수록 더 작은 수입니다.',
  },
  feedback: integerFeedback,
  cardGenerator: generateRealDeck,
}

export const REAL_1_3: StageConfig = {
  id: 'real-1-3',
  worldId: 'real-starlight-space',
  title: '실수의 별빛 우주 1-3',
  subtitle: '무리수의 대소관계',
  worldTitle: '실수의 별빛 우주',
  cardType: 'real',
  deckSize: 23,
  boardSize: 23,
  backgroundAsset: ASSETS.starlightPlayfieldBg,
  trailAsset: ASSETS.starlightTrailOverlay,
  scoringMode: 'nonDecreasingRuns',
  guide: {
    numberRangeLabel: '√2, √3, π 등의 무리수',
    numberRangeDescription: '제곱근과 원주율을 유리수 기준점과 함께 비교합니다.',
    objectiveText: '작은 수부터 큰 수까지 이어지는 길을 길게 만드세요.',
    strategyHint: 'π ≈ 3.14, √2 ≈ 1.41처럼 어림값을 기준점과 비교해 보세요.',
  },
  feedback: integerFeedback,
  cardGenerator: generateRealDeck,
}

/** 월드맵에 노드로 표시되는 스테이지 — 월드당 첫 스테이지 */
export const WORLD_MAP_STAGES: StageConfig[] = [
  NATURAL_1_1,
  INTEGER_1_1,
  RATIONAL_1_1,
  REAL_1_1,
]

export const STAGES: StageConfig[] = [
  NATURAL_1_1,
  INTEGER_1_1,
  RATIONAL_1_1,
  REAL_1_1,
  REAL_1_2,
  REAL_1_3,
]
