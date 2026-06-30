import type { CSSProperties } from 'react'
import { HUD_ASSETS } from '../../assets/hudAssets'

interface PlayLiveScorePanelProps {
  longestRunLength: number
  currentScore: number
}

/** 에셋 내장 점수표 + 현재 최장 구간 행 하이라이트만 표시 */
export function PlayLiveScorePanel({ longestRunLength, currentScore }: PlayLiveScorePanelProps) {
  return (
    <aside
      className="play-live-score-panel"
      aria-label={`구간 길이별 점수. 현재 최장 ${longestRunLength}칸, ${currentScore}점`}
    >
      <img
        className="play-live-score-panel__frame"
        src={HUD_ASSETS.liveScorePanelFrame}
        alt=""
        aria-hidden="true"
        draggable={false}
      />

      {longestRunLength > 0 && (
        <div className="play-live-score-panel__highlight-track" aria-hidden="true">
          <div
            className="play-live-score-panel__highlight"
            style={{ '--highlight-row': longestRunLength - 1 } as CSSProperties}
          />
        </div>
      )}
    </aside>
  )
}
