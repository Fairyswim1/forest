import { useMemo } from 'react'
import type { GameResult } from '../utils/scoring'
import { buildRunDisplayMeta, formatRunValuesArrow, getScoringRunLabel } from '../utils/runDisplay'

interface RunScorePanelProps {
  result: GameResult
}

export function RunScorePanel({ result }: RunScorePanelProps) {
  const rows = useMemo(() => buildRunDisplayMeta(result.runs), [result.runs])

  return (
    <aside className="run-score-panel" aria-label="구간별 점수">
      <header className="run-score-panel__header">
        <span className="run-score-panel__title-tab">구간별 점수</span>
      </header>

      <div className="run-score-panel__body">
        <ul className="run-score-panel__rows">
          {rows.map(({ run, runIndex, isScoring, scoringRunIndex, points }) => (
            <li
              key={runIndex}
              className={[
                'run-score-panel__row',
                isScoring ? 'run-score-panel__row--scoring' : 'run-score-panel__row--isolated',
              ].join(' ')}
            >
              <span className="run-score-panel__badge" aria-hidden>
                {isScoring ? getScoringRunLabel(scoringRunIndex) : '—'}
              </span>
              <span className="run-score-panel__values">{formatRunValuesArrow(run.values)}</span>
              <span className="run-score-panel__length">{run.length}칸</span>
              <span className="run-score-panel__points">
                {isScoring ? `+${points}점` : '0점'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="run-score-panel__total">
        <span className="run-score-panel__total-label">총 획득 점수</span>
        <strong className="run-score-panel__total-value">{result.finalScore}점</strong>
      </footer>
    </aside>
  )
}
