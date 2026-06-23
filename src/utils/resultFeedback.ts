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
  praiseLongest: (n) => `가장 긴 수의 길을 ${n}칸까지 만들었어요!`,
  zeroScore: '2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어 보세요!',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!',
  genericBreak: '앞 칸의 수보다 작은 수가 오면 순서가 끊겨요.',
  breakComparison: (left, right) => `${right}는 ${left}보다 작은 수예요.`,
}

/** 정수 동굴 — -20~20 정수. 음수·0의 대소 관계를 짚어 준다. */
export const integerFeedback: StageFeedback = {
  praiseLongest: (n) => `가장 긴 수의 길을 ${n}칸까지 만들었어요!`,
  zeroScore: '2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어 보세요!',
  allFilled: '오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!',
  genericBreak: '0보다 작은 수는 모두 음수예요.',
  breakComparison: (left, right) => `${right}는 ${left}보다 작은 수예요.`,
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

  for (const tip of analyzeBreakTips(result, feedback)) {
    if (messages.length >= 3) break
    if (!messages.includes(tip)) messages.push(tip)
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

  if (result.breakCount > 0 && tips.length === 0) {
    tips.push(feedback.genericBreak)
  }

  return tips
}
