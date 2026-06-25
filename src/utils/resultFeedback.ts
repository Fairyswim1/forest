import type { GameResult } from './scoring'
import type { StageFeedback } from '../types/stage'

export function longestScoringSegmentLength(result: GameResult): number {
  return result.longestSegmentLength
}

export function countScoringSegments(result: GameResult): number {
  return result.nonDecreasingSegmentCount
}

/** 자연수의 숲 — 1~30 자연수. 음수/0 관련 문구는 쓰지 않는다. */
export const naturalFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 오름차순 길은 ${n}칸이에요!`,
  zeroScore:
    '시작 → 도착 방향으로 숫자가 같거나 커지게 이어 보세요. 2칸 이상이면 점수가 됩니다.',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 오름차순 길에 도전해 보세요!',
  genericBreak: '시작에서 도착 방향으로 숫자가 작아진 지점에서 길이 끊겼어요.',
  breakComparison: (left, right) =>
    `${right}는 ${left}보다 작아서, 오름차순 길이 여기서 끊겼어요.`,
}

/** 정수 동굴 — -20~20 정수. 음수·0의 대소 관계를 짚어 준다. */
export const integerFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 오름차순 길은 ${n}칸이에요!`,
  zeroScore:
    '시작 → 도착 방향으로 숫자가 같거나 커지게 이어 보세요. 2칸 이상이면 점수가 됩니다.',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 오름차순 길에 도전해 보세요!',
  genericBreak: '시작에서 도착 방향으로 숫자가 작아진 지점에서 길이 끊겼어요.',
  breakComparison: (left, right) =>
    `${right}는 ${left}보다 작아서, 오름차순 길이 여기서 끊겼어요.`,
  zeroToNegative: '0 다음에 음수가 오면 수의 크기 순서가 끊겨요.',
  negativeAbsValue: '음수는 절댓값이 클수록 더 작은 수예요.',
  positiveToNegative: '양수 다음에 더 작은 음수가 오면 순서가 끊겨요.',
}

export function buildResultFeedback(
  result: GameResult,
  feedback: StageFeedback = integerFeedback,
): string[] {
  const messages: string[] = []
  const longest = result.longestSegmentLength

  if (longest >= 2) {
    messages.push(feedback.praiseLongest(longest))
  } else if (result.finalScore === 0) {
    messages.push(feedback.zeroScore)
  }

  if (result.nonDecreasingSegmentCount > 0) {
    messages.push('같은 수를 이어 놓은 것도 성공 구간에 포함돼요.')
  }

  for (const tip of analyzeBreakTips(result, feedback)) {
    if (messages.length >= 3) break
    if (!messages.includes(tip)) messages.push(tip)
  }

  if (result.breakCount > 0 && messages.length < 3 && !messages.some((m) => m.includes('끊겼'))) {
    messages.push(feedback.genericBreak)
  }

  if (messages.length === 0) {
    messages.push(feedback.allFilled)
  }

  return messages.slice(0, 3)
}

function analyzeBreakTips(result: GameResult, feedback: StageFeedback): string[] {
  const tips: string[] = []
  let sawZeroNegative = false
  let sawNegativeAbs = false

  for (const brk of result.breaks) {
    const { leftValue: left, rightValue: right } = brk

    if (feedback.zeroToNegative && left === 0 && right < 0 && !sawZeroNegative) {
      tips.push(feedback.zeroToNegative)
      sawZeroNegative = true
      continue
    }

    if (feedback.negativeAbsValue && left < 0 && right < 0 && left > right && !sawNegativeAbs) {
      tips.push(feedback.negativeAbsValue)
      sawNegativeAbs = true
      continue
    }

    if (feedback.positiveToNegative && left > 0 && right < 0) {
      tips.push(feedback.positiveToNegative)
      continue
    }

    if (left > right) {
      tips.push(feedback.breakComparison(left, right))
    }
  }

  return tips
}
