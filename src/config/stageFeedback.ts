import type { StageFeedback } from '../types/stage'
import { BASIC_SQRT_VALUES } from '../game/cards/realValues'
import { displayValueToLatex } from '../utils/mathLatex'

function latexInline(display: string): string {
  const latex = displayValueToLatex(display)
  return latex ? `$${latex}$` : display
}

function latexOrNumber(display: string | undefined, value: number): string {
  return display ? latexInline(display) : `$${value}$`
}

/** 수의 숲 — 정수(자연수 구간 위주) */
export const integerFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 오름차순 길은 ${n}칸이에요!`,
  zeroScore:
    '시작 → 도착 방향으로 숫자가 같거나 커지게 이어 보세요. 2칸 이상이면 점수가 됩니다.',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 오름차순 길에 도전해 보세요!',
  genericBreak: '시작에서 도착 방향으로 숫자가 작아진 지점에서 길이 끊겼어요.',
  breakComparison: (left, right) =>
    `${right}는 ${left}보다 작아서, 오름차순 길이 여기서 끊겼어요.`,
  zeroToNegative: '0 다음에 음수가 오면 순서가 끊겨요.',
  negativeAbsValue: '음수는 절댓값이 클수록 더 작은 수예요.',
  positiveToNegative: '양수 다음에 더 작은 음수가 오면 순서가 끊겨요.',
}

/** 유리수 초원 — 분수·소수·정수 혼합 */
export const rationalFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 오름차순 길은 ${n}칸이에요!`,
  zeroScore:
    '시작 → 도착 방향으로 숫자가 같거나 커지게 이어 보세요. 2칸 이상이면 점수가 됩니다.',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 오름차순 길에 도전해 보세요!',
  genericBreak: '시작에서 도착 방향으로 숫자가 작아진 지점에서 길이 끊겼어요.',
  breakComparison: (left, right) =>
    `${right}는 ${left}보다 작아서, 오름차순 길이 여기서 끊겼어요.`,
}

const SQRT_TIP_BY_DISPLAY: Record<string, string> = {
  '√2': `${latexInline('√2')}는 $1$과 $2$ 사이에 있어요.`,
  '√3': `${latexInline('√3')}은 $2$보다 작은 수예요.`,
  '√5': `${latexInline('√5')}는 $2$와 $3$ 사이에 있어요.`,
  '√7': `${latexInline('√7')}은 $3$보다 작은 수예요.`,
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

  const rightText = latexOrNumber(rightLabel, right)
  const leftText = latexOrNumber(leftLabel, left)
  return `${rightText}는 ${leftText}보다 작은 수예요.`
}

/** 실수의 별빛 우주 1-1 — 제곱근 대소관계 */
export const sqrtFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 오름차순 길은 ${n}칸이에요!`,
  zeroScore:
    '시작 → 도착 방향으로 숫자가 같거나 커지게 이어 보세요. 2칸 이상이면 점수가 됩니다.',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 오름차순 길에 도전해 보세요!',
  genericBreak: '제곱근의 크기는 가까운 완전제곱수를 기준으로 생각해 보세요.',
  breakComparison: sqrtBreakTip,
}
