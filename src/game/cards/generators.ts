import {
  createIntegerCard,
  createNaturalCard,
  createRationalCard,
  createRealCard,
  type NumberCard,
} from '../../types/card'
import { REAL_VALUE_POOL, realValueByDisplay, type RealValueDef } from './realValues'

const INTEGER_MAX = 20
const INTEGER_DECK_SIZE = 23

const NATURAL_MIN = 1
const NATURAL_MAX = 30
const NATURAL_DECK_SIZE = 23

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

/** dev 모드 + URL 쿼리 `?deck=fixed` 일 때만 고정 덱을 쓴다. 그 외에는 항상 랜덤. */
function isFixedDeckMode(): boolean {
  if (!import.meta.env.DEV) return false
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('deck') === 'fixed'
}

/* ── 정수 덱 (정수 동굴 1-1 / integer-1-1) ───────────────────────────── */

/**
 * 정수 고정 덱 (개발/검증용) — -20~20, 23장, 음수·0·양수 골고루.
 * dev 모드에서 `?deck=fixed` 일 때 사용된다.
 */
export const INTEGER_FIXED_DECK = [
  -12, 6, -3, 14, -18, 0, 9, -7, 17, -1, 4, -15, 11, -5, 20, 2, -10, 8, -20, 13, -2, 5, 16,
]

function toIntegerCards(values: number[]): NumberCard[] {
  return values.map((value, index) =>
    createIntegerCard(`card-${String(index + 1).padStart(2, '0')}`, value),
  )
}

/**
 * 정수 덱 생성 (정수 동굴 1-1 / integer-1-1).
 * -20~20 정수만, 23장, 중복 허용.
 * 규칙: 최소 1장의 0을 포함하고, 음수/양수 개수의 균형을 맞춰
 * 한쪽 부호로 치우치지 않게 한다. (음수·0·양수가 모두 등장)
 * displayValue는 화면용, numericValue는 비교·점수용으로 분리 저장된다.
 */
export function generateIntegerDeck(size = INTEGER_DECK_SIZE): NumberCard[] {
  if (isFixedDeckMode()) {
    return toIntegerCards(INTEGER_FIXED_DECK)
  }

  const values: number[] = [0] // 최소 1장의 0 보장
  let negCount = 0
  let posCount = 0

  for (let i = 1; i < size; i++) {
    // 적은 쪽 부호를 채워 음수/양수 균형을 유지한다 (차이 ≤ 1)
    let sign: number
    if (negCount < posCount) sign = -1
    else if (posCount < negCount) sign = 1
    else sign = Math.random() < 0.5 ? -1 : 1

    const magnitude = randomInt(1, INTEGER_MAX) // 1~20 (0은 위에서 별도 보장)
    values.push(sign * magnitude)
    if (sign < 0) negCount++
    else posCount++
  }

  return toIntegerCards(shuffle(values))
}

/* ── 자연수 덱 (자연수의 숲 1-1 / natural-1-1) ────────────────────────── */

/**
 * 자연수 고정 덱 (개발/검증용) — 1~30 범위, 23장, 작은·중간·큰 수가 고르게 섞임.
 * dev 모드에서 `?deck=fixed` 일 때 사용된다.
 */
export const NATURAL_FIXED_DECK = [
  8, 21, 3, 15, 10, 27, 6, 19, 2, 14, 25, 9, 17, 5, 30, 11, 23, 4, 18, 7, 29, 13, 20,
]

function toNaturalCards(values: number[]): NumberCard[] {
  return values.map((value, index) =>
    createNaturalCard(`natural-${String(index + 1).padStart(2, '0')}`, value),
  )
}

/**
 * 자연수 덱 생성 (자연수의 숲 1-1 / natural-1-1).
 * 1~30 자연수만, 23장, 중복 허용. 0·음수·분수·소수는 포함하지 않는다.
 * displayValue와 numericValue는 동일한 자연수 값으로 저장된다.
 */
export function generateNaturalDeck(): NumberCard[] {
  if (isFixedDeckMode()) {
    return toNaturalCards(NATURAL_FIXED_DECK)
  }

  const values = Array.from({ length: NATURAL_DECK_SIZE }, () =>
    randomInt(NATURAL_MIN, NATURAL_MAX),
  )
  return toNaturalCards(values)
}

/* ── 실수 덱: 자연수·소수·정수·제곱근·π 혼합 (실수의 별빛 우주 / real-1-1) ── */

const REAL_DECK_SIZE = 23

/**
 * 개발용 고정 덱 — 음수·소수·정수·제곱근·π가 섞인 23장.
 */
export const BASIC_SQRT_FIXED_DECK = [
  '-3', '-√2', '-0.5', '0', '0.5', '1', '√2', '1.5', '√3', '2',
  '√5', '2.5', '√7', '3', 'π', '√10', '4', '5', '-5', '-1.5',
  '√6', '-2', '1',
]

function toRealCards(defs: RealValueDef[]): NumberCard[] {
  return defs.map((def, index) =>
    createRealCard(`real-${String(index + 1).padStart(2, '0')}`, def.display, def.value),
  )
}

/**
 * 혼합 실수 덱 생성 (실수의 별빛 우주).
 * 자연수·소수 표기·정수·제곱근·π를 포함하며, 풀이 덱보다 커서 대부분 중복 없이 뽑힌다.
 * 비교·점수는 numericValue, 표시는 displayValue로 분리된다.
 */
export function generateBasicSqrtDeck(size = REAL_DECK_SIZE): NumberCard[] {
  if (isFixedDeckMode()) {
    const defs = BASIC_SQRT_FIXED_DECK.map((token) => realValueByDisplay(token)).filter(
      (d): d is RealValueDef => d !== undefined,
    )
    return toRealCards(defs)
  }

  if (REAL_VALUE_POOL.length >= size) {
    return toRealCards(shuffle([...REAL_VALUE_POOL]).slice(0, size))
  }

  const defs: RealValueDef[] = [...REAL_VALUE_POOL]
  while (defs.length < size) {
    defs.push(REAL_VALUE_POOL[Math.floor(Math.random() * REAL_VALUE_POOL.length)]!)
  }
  return toRealCards(shuffle(defs.slice(0, size)))
}

/* ── 향후 확장용 덱 생성기 ───────────────────────────────────────────── */

interface RationalValueSpec {
  displayValue: string
  numericValue: number
}

const RATIONAL_VALUE_POOL: RationalValueSpec[] = [
  { displayValue: '-2', numericValue: -2 },
  { displayValue: '-3/2', numericValue: -1.5 },
  { displayValue: '-1', numericValue: -1 },
  { displayValue: '-3/4', numericValue: -0.75 },
  { displayValue: '-1/2', numericValue: -0.5 },
  { displayValue: '-0.25', numericValue: -0.25 },
  { displayValue: '0', numericValue: 0 },
  { displayValue: '1/4', numericValue: 0.25 },
  { displayValue: '1/2', numericValue: 0.5 },
  { displayValue: '0.5', numericValue: 0.5 },
  { displayValue: '3/4', numericValue: 0.75 },
  { displayValue: '1', numericValue: 1 },
  { displayValue: '5/4', numericValue: 1.25 },
  { displayValue: '3/2', numericValue: 1.5 },
  { displayValue: '2', numericValue: 2 },
]

const RATIONAL_FIXED_DECK: RationalValueSpec[] = [
  { displayValue: '1/2', numericValue: 0.5 },
  { displayValue: '0.5', numericValue: 0.5 },
  { displayValue: '-3/4', numericValue: -0.75 },
  { displayValue: '-1/2', numericValue: -0.5 },
  { displayValue: '1', numericValue: 1 },
  { displayValue: '5/4', numericValue: 1.25 },
  { displayValue: '3/2', numericValue: 1.5 },
  { displayValue: '-0.25', numericValue: -0.25 },
  { displayValue: '0', numericValue: 0 },
  { displayValue: '1/4', numericValue: 0.25 },
  { displayValue: '-2', numericValue: -2 },
  { displayValue: '-3/2', numericValue: -1.5 },
  { displayValue: '-1', numericValue: -1 },
  { displayValue: '3/4', numericValue: 0.75 },
  { displayValue: '2', numericValue: 2 },
  { displayValue: '1/2', numericValue: 0.5 },
  { displayValue: '0.5', numericValue: 0.5 },
  { displayValue: '-3/4', numericValue: -0.75 },
  { displayValue: '5/4', numericValue: 1.25 },
  { displayValue: '1', numericValue: 1 },
  { displayValue: '3/2', numericValue: 1.5 },
  { displayValue: '-1/2', numericValue: -0.5 },
  { displayValue: '1/4', numericValue: 0.25 },
]

function toRationalCards(specs: RationalValueSpec[]): NumberCard[] {
  return specs.map((spec, index) =>
    createRationalCard(`rational-${String(index + 1).padStart(2, '0')}`, spec),
  )
}

/** 유리수 초원 1-1 — 분수·소수·정수 혼합 덱 */
export function generateRationalDeck(size = INTEGER_DECK_SIZE): NumberCard[] {
  if (isFixedDeckMode()) {
    return toRationalCards(RATIONAL_FIXED_DECK)
  }

  const specs = Array.from({ length: size }, () => {
    const pick = RATIONAL_VALUE_POOL[Math.floor(Math.random() * RATIONAL_VALUE_POOL.length)]!
    return { ...pick }
  })
  return toRationalCards(shuffle(specs))
}

export function generateRealDeck(): NumberCard[] {
  throw new Error('Not implemented yet')
}
