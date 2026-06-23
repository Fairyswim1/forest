/**
 * 실수의 별빛 우주 1-1에서 쓰는 "정수 + 양의 제곱근" 값 풀.
 * displayValue(표기)와 numericValue(비교·점수)를 분리해 둔다.
 * - 완전제곱수의 제곱근은 넣지 않는다 (√4 대신 2).
 * - 동일 numericValue의 중복 표현을 만들지 않는다.
 */
export interface RealValueDef {
  display: string
  value: number
}

/** 0 < 1 < √2 < √3 < 2 < √5 < √6 < √7 < 3 < √10 (정렬된 비교 사슬) */
export const BASIC_SQRT_VALUES: RealValueDef[] = [
  { display: '0', value: 0 },
  { display: '1', value: 1 },
  { display: '√2', value: Math.sqrt(2) },
  { display: '√3', value: Math.sqrt(3) },
  { display: '2', value: 2 },
  { display: '√5', value: Math.sqrt(5) },
  { display: '√6', value: Math.sqrt(6) },
  { display: '√7', value: Math.sqrt(7) },
  { display: '3', value: 3 },
  { display: '√10', value: Math.sqrt(10) },
]

const DISPLAY_BY_KEY = new Map(BASIC_SQRT_VALUES.map((d) => [d.value.toFixed(5), d.display]))
const DEF_BY_DISPLAY = new Map(BASIC_SQRT_VALUES.map((d) => [d.display, d]))

/** numericValue → 표기 (알려진 실수 값일 때). 없으면 null. */
export function realDisplayFor(value: number): string | null {
  return DISPLAY_BY_KEY.get(value.toFixed(5)) ?? null
}

/** 표기 → 값 정의 (고정 덱 토큰 해석용). */
export function realValueByDisplay(display: string): RealValueDef | undefined {
  return DEF_BY_DISPLAY.get(display)
}
