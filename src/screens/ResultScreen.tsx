import { ASSETS, STAGE_1_1, type StageInfo } from '../types/game'
import { ResultBoardSummary } from '../components/ResultBoardSummary'
import { useCountUp } from '../hooks/useCountUp'
import type { GameResult } from '../utils/scoring'
import type { TileId } from '../types/game'

export interface ResultPayload {
  result: GameResult
  board: Record<TileId, number | null>
  isNewRecord: boolean
}

interface ResultScreenProps {
  stage?: StageInfo
  payload: ResultPayload
  onRetry: () => void
  onWorldMap: () => void
}

export function ResultScreen({
  stage = STAGE_1_1,
  payload,
  onRetry,
  onWorldMap,
}: ResultScreenProps) {
  const { result, isNewRecord } = payload
  const animatedScore = useCountUp(result.finalScore, 1400)

  return (
    <div className="result-screen">
      <div
        className="result-screen__bg"
        style={{ backgroundImage: `url(${ASSETS.playfieldBg})` }}
        aria-hidden
      />
      <div className="result-screen__overlay" aria-hidden />

      <header className="result-screen__header">
        <h1 className="result-screen__title">{stage.label} 완료!</h1>
        <p className="result-screen__subtitle">{stage.topic}</p>
      </header>

      <main className="result-screen__main">
        <section className="result-card wood-panel" aria-label="결과 요약">
          {isNewRecord && (
            <span className="result-card__badge" aria-label="새 기록">
              새 기록!
            </span>
          )}

          <dl className="result-card__stats">
            <div className="result-card__stat">
              <dt>가장 긴 수의 길</dt>
              <dd>{result.longestSegmentLength}칸</dd>
            </div>
            <div className="result-card__stat">
              <dt>이어진 칸 수</dt>
              <dd>{result.successTileCount}칸</dd>
            </div>
            <div className="result-card__stat result-card__stat--score">
              <dt>획득 점수</dt>
              <dd>
                <strong className="result-card__score-value">{animatedScore}</strong>점
              </dd>
            </div>
          </dl>
        </section>

        <section className="result-screen__board-panel wood-panel" aria-label="보드 결과">
          <h2 className="result-screen__board-title">오솔길 결과</h2>
          <ResultBoardSummary
            board={payload.board}
            successTileIds={result.successTileIds}
            breakAfterTileIds={result.breakAfterTileIds}
          />
        </section>
      </main>

      <footer className="result-screen__actions">
        <button type="button" className="game-button game-button--undo" onClick={onRetry}>
          다시 도전
        </button>
        <button type="button" className="game-button game-button--confirm" onClick={onWorldMap}>
          월드맵으로
        </button>
        <button type="button" className="game-button game-button--next" disabled hidden aria-hidden>
          다음 스테이지
        </button>
      </footer>
    </div>
  )
}
