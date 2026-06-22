import { useMemo } from 'react'
import type { StageConfig } from '../types/stage'
import { ResultBoardSummary } from '../components/ResultBoardSummary'
import { RunScorePanel } from '../components/RunScorePanel'
import { useCountUp } from '../hooks/useCountUp'
import {
  formatBreakDebugLines,
  formatRunDebugLines,
  type GameResult,
} from '../utils/scoring'
import type { TileId } from '../types/game'
import { buildResultFeedback } from '../utils/resultFeedback'

export interface ResultPayload {
  result: GameResult
  board: Record<TileId, number | null>
  isNewRecord: boolean
}

interface ResultScreenProps {
  stage: StageConfig
  payload: ResultPayload
  onRetry: () => void
  onWorldMap: () => void
  debug?: boolean
}

function useDebugMode(explicit?: boolean): boolean {
  return useMemo(() => {
    if (explicit) return true
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('debug') === 'true'
  }, [explicit])
}

export function ResultScreen({
  stage,
  payload,
  onRetry,
  onWorldMap,
  debug: debugProp,
}: ResultScreenProps) {
  const { result, isNewRecord } = payload
  const debug = useDebugMode(debugProp)
  const animatedScore = useCountUp(result.finalScore, 1400)
  const feedback = useMemo(() => buildResultFeedback(result), [result])
  const runDebugLines = useMemo(() => formatRunDebugLines(result), [result])
  const breakDebugLines = useMemo(() => formatBreakDebugLines(result), [result])

  return (
    <div className={`result-screen ${debug ? 'result-screen--debug' : ''}`}>
      <div
        className="result-screen__bg"
        style={{ backgroundImage: `url(${stage.backgroundAsset})` }}
        aria-hidden
      />
      <div className="result-screen__overlay" aria-hidden />

      <header className="result-screen__header">
        <h1 className="result-screen__title">{stage.title} 완료!</h1>
        <p className="result-screen__subtitle">{stage.subtitle}</p>
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
              <dt>비내림차순 구간</dt>
              <dd>{result.nonDecreasingSegmentCount}개</dd>
            </div>
            <div className="result-card__stat">
              <dt>끊긴 지점</dt>
              <dd>{result.breakCount}곳</dd>
            </div>
            <div className="result-card__stat result-card__stat--score">
              <dt>획득 점수</dt>
              <dd>
                <strong className="result-card__score-value">{animatedScore}</strong>점
              </dd>
            </div>
          </dl>

          <ul className="result-card__feedback" aria-label="학습 피드백">
            {feedback.slice(0, 2).map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>

          {debug && (
            <div className="result-card__debug" aria-label="구간 디버그">
              <h3 className="result-card__debug-title">Runs (PATH_ORDER)</h3>
              <pre className="result-card__debug-pre">
                {runDebugLines.join('\n')}
                {'\n\n'}
                {breakDebugLines.join('\n')}
              </pre>
            </div>
          )}
        </section>

        <section className="result-screen__board-panel wood-panel" aria-label="보드 결과">
          <ResultBoardSummary
            board={payload.board}
            result={result}
            trailOverlay={stage.trailAsset}
          />
        </section>

        <RunScorePanel result={result} />
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
