import type { StageFeedback } from '../types/stage'
import { BASIC_SQRT_VALUES } from '../game/cards/realValues'

/** 수의 숲 — 정수(자연수 구간 위주) */
export const integerFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 수의 길을 ${n}칸까지 만들었어요!`,
  zeroScore: '2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어 보세요!',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!',
  genericBreak: '앞 칸의 수보다 작은 수가 오면 비내림차순이 끊겨요.',
  breakComparison: (left, right) => `${left} > ${right} : 여기서 순서가 끊겼어요.`,
  zeroToNegative: '0 다음에 음수가 오면 순서가 끊겨요.',
  negativeAbsValue: '음수는 절댓값이 클수록 더 작은 수예요.',
  positiveToNegative: '양수 다음에 더 작은 음수가 오면 순서가 끊겨요.',
}

/** 유리수 초원 — 분수·소수·정수 혼합 */
export const rationalFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 수의 길을 ${n}칸까지 만들었어요!`,
  zeroScore: '2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어 보세요!',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!',
  genericBreak: '분수와 소수는 모습이 달라도 같은 값일 수 있어요. 크기를 다시 비교해 보세요.',
  breakComparison: (left, right) => `${right}는 ${left}보다 작은 수예요.`,
}

const SQRT_TIP_BY_DISPLAY: Record<string, string> = {
  '√2': '√2는 1과 2 사이에 있어요.',
  '√3': '√3은 2보다 작은 수예요.',
  '√5': '√5는 2와 3 사이에 있어요.',
  '√7': '√7은 3보다 작은 수예요.',
}

function sqrtDisplayForValue(value: number): string | undefined {
  for (const def of BASIC_SQRT_VALUES) {
    if (Math.abs(def.value - value) < 1e-9) return def.display
  }
  return undefined
}

function sqrtBreakTip(left: number, right: number): string {
  const leftLabel = sqrtDisplayForValue(left)
  const rightLabel = sqrtDisplayForValue(right)

  if (rightLabel && SQRT_TIP_BY_DISPLAY[rightLabel]) {
    return SQRT_TIP_BY_DISPLAY[rightLabel]!
  }
  if (leftLabel && SQRT_TIP_BY_DISPLAY[leftLabel]) {
    return SQRT_TIP_BY_DISPLAY[leftLabel]!
  }

  const rightText = rightLabel ?? String(right)
  const leftText = leftLabel ?? String(left)
  return `${rightText}는 ${leftText}보다 작은 수예요.`
}

/** 실수의 별빛 우주 1-1 — 제곱근 대소관계 */
export const sqrtFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 수의 길을 ${n}칸까지 만들었어요!`,
  zeroScore: '2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어 보세요!',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!',
  genericBreak: '제곱근의 크기는 가까운 완전제곱수를 기준으로 생각해 보세요.',
  breakComparison: sqrtBreakTip,
}
