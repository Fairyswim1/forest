import type { GameResult } from './scoring'

export function longestScoringSegmentLength(result: GameResult): number {
  return result.longestSegmentLength
}

export function countScoringSegments(result: GameResult): number {
  return result.nonDecreasingSegmentCount
}

export function buildResultFeedback(result: GameResult): string[] {
  const messages: string[] = []
  const longest = result.longestSegmentLength

  if (longest >= 2) {
    messages.push(`가장 긴 수의 길을 ${longest}칸까지 만들었어요!`)
  } else if (result.finalScore === 0) {
    messages.push('2칸 이상 이어지면 점수를 얻을 수 있어요. 작은 수에서 큰 수로 이어져 보세요!')
  }

  for (const tip of analyzeBreakTips(result)) {
    if (messages.length >= 3) break
    if (!messages.includes(tip)) messages.push(tip)
  }

  if (messages.length === 0) {
    messages.push('오솔길을 모두 채웠어요! 다음엔 더 긴 수의 길에 도전해 보세요!')
  }

  return messages.slice(0, 3)
}

function analyzeBreakTips(result: GameResult): string[] {
  const tips: string[] = []
  let sawZeroNegative = false
  let sawNegativeAbs = false

  for (const brk of result.breaks) {
    const { leftValue: left, rightValue: right } = brk

    if (left === 0 && right < 0 && !sawZeroNegative) {
      tips.push('0 다음에 더 작은 수가 오면 흐름이 끊겨요.')
      sawZeroNegative = true
      continue
    }

    if (left < 0 && right < 0 && left > right && !sawNegativeAbs) {
      tips.push('음수는 절댓값이 클수록 더 작은 수예요.')
      sawNegativeAbs = true
      continue
    }

    if (left > 0 && right < 0) {
      tips.push('양수 다음에 더 작은 음수가 오면 순서가 끊겨요.')
      continue
    }

    if (left > right) {
      tips.push(`${left} > ${right} : 여기서 순서가 끊겼어요.`)
    }
  }

  if (result.breakCount > 0 && tips.length === 0) {
    tips.push('앞 칸의 수보다 작은 수가 오면 비내림차순이 끊겨요.')
  }

  return tips
}
