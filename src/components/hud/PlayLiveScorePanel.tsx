import { HUD_ASSETS } from '../../assets/hudAssets'

interface PlayLiveScorePanelProps {
  longestRunLength: number
  currentScore: number
}

/** 에셋 내장 구간 길이별 점수표 */
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
    </aside>
  )
}
