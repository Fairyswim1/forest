import { TOTAL_ROUNDS } from '../../types/game'
import { HudStageInfoPanel } from './HudStageInfoPanel'
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
      <HudStageInfoPanel title={stageLabel} subtitle={topic} />

      <div className="play-hud__center">
        <HudRoundPanel round={displayRound} totalRounds={totalRounds} />
      </div>

      <div className="play-hud__right">
        <HudScorePanel score={score} />
        <div className="play-hud__icon-group">
          {onGuide && (
            <HudIconButton variant="help" ariaLabel="스테이지 안내 다시보기" onClick={onGuide} />
          )}
          <HudIconButton variant="worldmap" ariaLabel="월드맵으로" onClick={onMenu} />
        </div>
      </div>
    </header>
  )
}
