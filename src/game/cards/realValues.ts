/**
 * 실수의 별빛 우주에서 쓰는 혼합 실수 값 풀.
 * 자연수·소수(소수 표기)·정수·제곱근·π를 함께 두어 표기가 달라도 대소를 비교하게 한다.
 * displayValue(표기)와 numericValue(비교·점수)를 분리해 둔다.
 * - 완전제곱수의 제곱근은 넣지 않는다 (√4 대신 2).
 * - 동일 numericValue의 중복 표현을 만들지 않는다.
 */
export interface RealValueDef {
  display: string
  value: number
}

/**
 * -5 … 5 부근의 혼합 실수 (정렬된 비교 사슬).
 * 풀이 23장보다 커서 덱을 채울 때 강제 중복이 거의 없다.
 */
export const REAL_VALUE_POOL: RealValueDef[] = [
  { display: '-5', value: -5 },
  { display: '-4', value: -4 },
  { display: '-3', value: -3 },
  { display: '-2', value: -2 },
  { display: '-√3', value: -Math.sqrt(3) },
  { display: '-1.5', value: -1.5 },
  { display: '-√2', value: -Math.sqrt(2) },
  { display: '-1', value: -1 },
  { display: '-0.5', value: -0.5 },
  { display: '0', value: 0 },
  { display: '0.5', value: 0.5 },
  { display: '1', value: 1 },
  { display: '√2', value: Math.sqrt(2) },
  { display: '1.5', value: 1.5 },
  { display: '√3', value: Math.sqrt(3) },
  { display: '2', value: 2 },
  { display: '√5', value: Math.sqrt(5) },
  { display: '√6', value: Math.sqrt(6) },
  { display: '2.5', value: 2.5 },
  { display: '√7', value: Math.sqrt(7) },
  { display: '3', value: 3 },
  { display: 'π', value: Math.PI },
  { display: '√10', value: Math.sqrt(10) },
  { display: '3.5', value: 3.5 },
  { display: '4', value: 4 },
  { display: '5', value: 5 },
]

/** @deprecated REAL_VALUE_POOL 별칭 — 기존 import 호환 */
export const BASIC_SQRT_VALUES = REAL_VALUE_POOL

const DISPLAY_BY_KEY = new Map(REAL_VALUE_POOL.map((d) => [d.value.toFixed(5), d.display]))
const DEF_BY_DISPLAY = new Map(REAL_VALUE_POOL.map((d) => [d.display, d]))

/** numericValue → 표기 (알려진 실수 값일 때). 없으면 null. */
export function realDisplayFor(value: number): string | null {
  return DISPLAY_BY_KEY.get(value.toFixed(5)) ?? null
}

/** 표기 → 값 정의 (고정 덱 토큰 해석용). */
export function realValueByDisplay(display: string): RealValueDef | undefined {
  return DEF_BY_DISPLAY.get(display)
}
