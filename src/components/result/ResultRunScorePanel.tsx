import type { CSSProperties } from 'react'
import { formatRunDisplayValuesArrow, type ScoringRunView } from '../../utils/runDisplay'
import { RunColorBadge } from './RunColorBadge'

interface ResultRunScorePanelProps {
  scoringRuns: ScoringRunView[]
  totalScore: number
  isolatedRuns: Array<{ runIndex: number; displayValues: string[]; length: number }>
}

export function ResultRunScorePanel({
  scoringRuns,
  totalScore,
  isolatedRuns,
}: ResultRunScorePanelProps) {
  return (
    <aside className="result-run-score-panel result-fantasy-panel" aria-label="구간별 점수">
      <header className="result-fantasy-panel__tab">
        <span className="result-fantasy-panel__tab-label">구간별 점수</span>
      </header>

      <div className="result-run-score-panel__body">
        <ul className="result-run-score-panel__rows">
          {scoringRuns.map((view) => (
            <li
              key={view.runIndex}
              className="result-run-score-panel__row"
              style={
                {
                  '--run-color': view.color,
                  '--run-glow': view.glow,
                } as CSSProperties
              }
            >
              <RunColorBadge label={view.label} color={view.color} />
              <span className="result-run-score-panel__values">
                {formatRunDisplayValuesArrow(view.displayValues)}
              </span>
              <span className="result-run-score-panel__meta">
                <span className="result-run-score-panel__length">{view.length}칸</span>
                <span className="result-run-score-panel__points">+{view.score}점</span>
              </span>
            </li>
          ))}

          {isolatedRuns.map((run) => (
            <li
              key={`iso-${run.runIndex}`}
              className="result-run-score-panel__row result-run-score-panel__row--isolated"
            >
              <span className="result-run-score-panel__dash" aria-hidden>
                —
              </span>
              <span className="result-run-score-panel__values">
                {formatRunDisplayValuesArrow(run.displayValues)}
              </span>
              <span className="result-run-score-panel__meta">
                <span className="result-run-score-panel__length">{run.length}칸</span>
                <span className="result-run-score-panel__points">0점</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="result-run-score-panel__total">
        <span className="result-run-score-panel__total-label">총 획득 점수</span>
        <strong className="result-run-score-panel__total-value">{totalScore}점</strong>
      </footer>
    </aside>
  )
}
