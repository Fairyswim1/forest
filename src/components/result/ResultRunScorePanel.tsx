import type { CSSProperties } from 'react'
import { ASSETS } from '../../types/game'
import { formatRunDisplayValuesArrow, type ScoringRunView } from '../../utils/runDisplay'
import { RunBadge } from './RunBadge'

interface ResultRunScorePanelProps {
  scoringRuns: ScoringRunView[]
  totalScore: number
  highlightedRunId: number | null
  onHighlightRun: (runId: number | null) => void
}

/**
 * 오른쪽 구간별 점수판 — scoringRuns가 보드와 공유하는 source of truth라
 * 보드 시작 배지와 1:1로 대응된다.
 */
export function ResultRunScorePanel({
  scoringRuns,
  totalScore,
  highlightedRunId,
  onHighlightRun,
}: ResultRunScorePanelProps) {
  return (
    <aside className="result-score-panel" aria-label="구간별 점수">
      <img
        className="result-score-panel__frame"
        src={ASSETS.resultScorePanelFrame}
        alt=""
        draggable={false}
      />

      <div className="result-score-panel__title">구간별 점수</div>

      <div className="result-score-panel__body">
        {scoringRuns.length === 0 ? (
          <p className="result-score-panel__empty">아직 성공한 구간이 없어요</p>
        ) : (
          <ul className="result-score-panel__rows">
            {scoringRuns.map((view) => (
              <li
                key={view.id}
                data-run-id={view.id}
                className={[
                  'result-score-panel__row',
                  highlightedRunId === view.id ? 'result-score-panel__row--highlighted' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  {
                    '--run-color': view.color,
                    '--run-glow': view.glow,
                  } as CSSProperties
                }
                onMouseEnter={() => onHighlightRun(view.id)}
                onMouseLeave={() => onHighlightRun(null)}
              >
                <RunBadge
                  src={view.badge}
                  label={`구간 ${view.id}`}
                  runId={view.id}
                  size="row"
                  highlighted={highlightedRunId === view.id}
                />
                <span className="result-score-panel__values">
                  {formatRunDisplayValuesArrow(view.displayValues)}
                </span>
                <span className="result-score-panel__meta">
                  <span className="result-score-panel__length">{view.length}칸</span>
                  <span className="result-score-panel__points">+{view.score}점</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="result-score-panel__total">
        <span className="result-score-panel__total-label">총 획득 점수</span>
        <strong className="result-score-panel__total-value">{totalScore}점</strong>
      </div>
    </aside>
  )
}
