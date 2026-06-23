import { MathRichText } from '../MathRichText'

interface ResultSummaryPanelProps {
  longestRun: number
  runCount: number
  breakCount: number
  totalScore: number
  animatedScore: number
  feedback: string[]
}

export function ResultSummaryPanel({
  longestRun,
  runCount,
  breakCount,
  totalScore,
  animatedScore,
  feedback,
}: ResultSummaryPanelProps) {
  return (
    <aside className="result-summary-panel result-fantasy-panel" aria-label="결과 요약">
      <header className="result-fantasy-panel__tab">
        <span className="result-fantasy-panel__tab-label">탐험 결과</span>
      </header>

      <div className="result-summary-panel__body">
        <dl className="result-summary-panel__stats">
          <div className="result-summary-panel__stat">
            <dt>가장 긴 수의 길</dt>
            <dd>
              <strong>{longestRun}</strong>
              <span className="result-summary-panel__unit">칸</span>
            </dd>
          </div>
          <div className="result-summary-panel__stat">
            <dt>비내림차순 구간</dt>
            <dd>
              <strong>{runCount}</strong>
              <span className="result-summary-panel__unit">개</span>
            </dd>
          </div>
          <div className="result-summary-panel__stat">
            <dt>끊긴 지점</dt>
            <dd>
              <strong>{breakCount}</strong>
              <span className="result-summary-panel__unit">곳</span>
            </dd>
          </div>
          <div className="result-summary-panel__stat result-summary-panel__stat--score">
            <dt>획득 점수</dt>
            <dd>
              <strong className="result-summary-panel__score">{animatedScore}</strong>
              <span className="result-summary-panel__unit">점</span>
            </dd>
          </div>
        </dl>

        <ul className="result-summary-panel__feedback" aria-label="학습 피드백">
          {feedback.slice(0, 3).map((message) => (
            <li key={message}>
              <MathRichText text={message} />
            </li>
          ))}
        </ul>
      </div>

      <footer className="result-summary-panel__footer" aria-hidden>
        총점 {totalScore}점
      </footer>
    </aside>
  )
}
