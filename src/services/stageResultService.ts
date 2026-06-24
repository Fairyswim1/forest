import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { SaveStageResultInput } from '../types/player'

/**
 * 스테이지 결과를 Firestore에 저장한다.
 * 경로: stageResults/{stageId}/entries/{uid}
 *
 * 랭킹 정렬 기준(향후 쿼리):
 * 1. bestScore desc
 * 2. bestLongestRun desc
 * 3. achievedAt asc
 */
export async function saveStageResult(input: SaveStageResultInput): Promise<void> {
  if (!db) {
    console.warn('[saveStageResult] Firestore unavailable — skipped.')
    return
  }

  const entryRef = doc(db, 'stageResults', input.stageId, 'entries', input.profile.uid)

  // TODO: 기존 기록과 비교해 bestScore / bestLongestRun / clearCount 갱신 로직 추가
  await setDoc(
    entryRef,
    {
      uid: input.profile.uid,
      stageId: input.stageId,
      nickname: input.profile.nickname,
      characterId: input.profile.characterId,
      bestScore: input.score,
      bestLongestRun: input.longestRun,
      clearCount: 1,
      lastScore: input.score,
      lastLongestRun: input.longestRun,
      achievedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
