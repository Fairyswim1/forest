import { useEffect, useMemo, useState } from 'react'
import { playSfx } from '../audio/audioManager'
import type { GameBoard } from '../types/board'
import type { StageConfig } from '../types/stage'
import { getWorldById } from '../config/worlds'
import { ResultBoardPanel } from '../components/result/ResultBoardPanel'
import { ResultHeaderRibbon } from '../components/result/ResultHeaderRibbon'
import { ResultRunScorePanel } from '../components/result/ResultRunScorePanel'
import { ResultSummaryPanel } from '../components/result/ResultSummaryPanel'
import { HudMuteButton } from '../components/hud/HudMuteButton'
import { getPathLayoutForTrailAsset } from '../game/pathLayouts'
import { useCountUp } from '../hooks/useCountUp'
import {
  formatBreakDebugLines,
  formatRunDebugLines,
  type GameResult,
} from '../utils/scoring'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'
import { buildResultFeedback } from '../utils/resultFeedback'
import { buildScoringRunViews } from '../utils/runDisplay'

export interface ResultPayload {
  result: GameResult
  board: GameBoard
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
  const { result, board, isNewRecord } = payload
  const pathLayout = getPathLayoutForTrailAsset(stage.trailAsset)
  const worldTheme = getWorldById(stage.worldId)?.theme ?? 'forest'
  const debug = useDebugMode(debugProp)
  const animatedScore = useCountUp(result.finalScore, 1400)
  const feedback = useMemo(() => buildResultFeedback(result, stage.feedback), [result, stage.feedback])
  const runDebugLines = useMemo(() => formatRunDebugLines(result), [result])
  const breakDebugLines = useMemo(() => formatBreakDebugLines(result), [result])

  const scoringRuns = useMemo(() => buildScoringRunViews(result.runs, board), [result.runs, board])
  const [highlightedRunId, setHighlightedRunId] = useState<number | null>(null)

  useEffect(() => {
    playSfx('result')
  }, [])

  return (
    <div
      className={`result-screen result-screen--${worldTheme} ${debug ? 'result-screen--debug' : ''}`}
    >
      <div
        className="result-screen__bg"
        style={{ backgroundImage: `url(${stage.backgroundAsset})` }}
        aria-hidden
      />
      <div className="result-screen__overlay" aria-hidden />
      <div className="result-screen__sparkles" aria-hidden />

      <header className="result-screen__header">
        <ResultHeaderRibbon
          title={`${stage.title} 완료!`}
          subtitle={stage.subtitle}
          isNewRecord={isNewRecord}
        />
        <HudMuteButton className="result-screen__mute-btn" />
      </header>

      <main className="result-screen__main">
        <ResultSummaryPanel
          longestRun={result.longestSegmentLength}
          runCount={result.nonDecreasingSegmentCount}
          breakCount={result.breakCount}
          totalScore={result.finalScore}
          animatedScore={animatedScore}
          feedback={feedback}
        />

        <ResultBoardPanel
          layout={pathLayout}
          board={board}
          result={result}
          scoringRuns={scoringRuns}
          highlightedRunId={highlightedRunId}
          onHighlightRun={setHighlightedRunId}
        />

        <ResultRunScorePanel
          scoringRuns={scoringRuns}
          totalScore={result.finalScore}
          highlightedRunId={highlightedRunId}
          onHighlightRun={setHighlightedRunId}
        />
      </main>

      {debug && (
        <div className="result-screen__debug" aria-label="구간 디버그">
          <pre>
            {runDebugLines.join('\n')}
            {'\n\n'}
            {breakDebugLines.join('\n')}
          </pre>
        </div>
      )}

      <footer className="result-screen__actions">
        <FantasyImageButton
          variant="retry"
          size="lg"
          onClick={() => {
            playSfx('click')
            onRetry()
          }}
        >
          다시 도전
        </FantasyImageButton>
        <FantasyImageButton
          variant="worldMap"
          size="lg"
          onClick={() => {
            playSfx('click')
            onWorldMap()
          }}
        >
          월드맵으로
        </FantasyImageButton>
      </footer>
    </div>
  )
}
