import { TOTAL_ROUNDS } from '../../types/game'
import { ASSETS } from '../../types/game'
import { HudFramePanel } from './HudFramePanel'
import { HudIconButton } from './HudIconButton'
import { HudRoundPanel } from './HudRoundPanel'
import { HudScorePanel } from './HudScorePanel'

interface PlayHudProps {
  stageLabel: string
  topic: string
  round: number
  score: number
  onMenu: () => void
  /** 스테이지 안내 다시보기 */
  onGuide?: () => void
  totalRounds?: number
}

export function PlayHud({
  stageLabel,
  topic,
  round,
  score,
  onMenu,
  onGuide,
  totalRounds = TOTAL_ROUNDS,
}: PlayHudProps) {
  const displayRound = Math.min(Math.max(round, 1), totalRounds)

  return (
    <header className="play-hud">
      <HudFramePanel
        variant="stage"
        frameSrc={ASSETS.hudStageFrame}
        className="play-hud__stage"
        ariaLabel={`스테이지 ${stageLabel}, ${topic}`}
      >
        <strong className="play-hud__stage-title">{stageLabel}</strong>
        <span className="play-hud__stage-topic">{topic}</span>
      </HudFramePanel>

      <div className="play-hud__center">
        <HudRoundPanel round={displayRound} totalRounds={totalRounds} />
      </div>

      <div className="play-hud__right">
        <HudScorePanel score={score} />
        <div className="play-hud__icon-group">
          {onGuide && (
            <HudIconButton variant="help" ariaLabel="스테이지 안내 다시보기" onClick={onGuide} />
          )}
          <HudIconButton variant="settings" ariaLabel="설정" onClick={onMenu} />
        </div>
      </div>
    </header>
  )
}
