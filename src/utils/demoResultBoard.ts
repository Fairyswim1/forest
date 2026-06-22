import { PATH_ORDER } from './pathLayout'
import { createEmptyBoard } from './placement'
import { calculateGameResult } from './scoring'
import type { ResultPayload } from '../screens/ResultScreen'

/** 개발용 결과 화면 미리보기 (?previewResult=1) */
export function buildDemoResultPayload(): ResultPayload {
  const board = createEmptyBoard()
  const values = [
    -16, -15, -13, -10, -8, -5, 2, -4, 4, 2, 3, 4, 5, 6, 8, 9, 10, 11, 8, 19, 15, 16, 17,
  ]
  PATH_ORDER.forEach((id, index) => {
    board[id] = values[index] ?? 0
  })

  const result = calculateGameResult(board)
  return {
    board,
    result,
    isNewRecord: true,
  }
}
