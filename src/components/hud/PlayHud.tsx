import { TOTAL_ROUNDS } from '../../types/game'
import { ASSETS } from '../../types/game'
import { HudFrameButton, HudFramePanel } from './HudFramePanel'
import { MenuGearIcon } from './MenuGearIcon'
import { hideBrokenAsset } from '../../utils/hideBrokenAsset'

interface PlayHudProps {
  stageLabel: string
  topic: string
  round: number
  score: number
  onMenu: () => void
  /** 스테이지 안내 다시보기 (? 버튼) */
  onGuide?: () => void
  /** 활성 스테이지의 총 라운드 수 (StageConfig.deckSize). 기본 TOTAL_ROUNDS */
  totalRounds?: number
}

export function PlayHud({ stageLabel, topic, round, score, onMenu, onGuide, totalRounds = TOTAL_ROUNDS }: PlayHudProps) {
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

      <HudFramePanel
        variant="round"
        frameSrc={ASSETS.hudRoundFrame}
        className="play-hud__round"
        ariaLabel={`라운드 ${displayRound} / ${totalRounds}`}
      >
        <span className="play-hud__round-label">Round</span>
        <span className="play-hud__round-value">
          <strong>{displayRound}</strong>
          <span className="play-hud__round-sep">/</span>
          {totalRounds}
        </span>
      </HudFramePanel>

      <div className="play-hud__right">
        {onGuide && (
          <HudFrameButton
            variant="menu"
            frameSrc={ASSETS.hudMenuFrame}
            className="play-hud__help"
            ariaLabel="스테이지 안내 다시보기"
            onClick={onGuide}
          >
            <span className="play-hud__help-glyph" aria-hidden>?</span>
          </HudFrameButton>
        )}

        <HudFramePanel
          variant="score"
          frameSrc={ASSETS.hudScoreFrame}
          className="play-hud__score"
          ariaLabel={`점수 ${score}`}
        >
          <span className="play-hud__score-icon-slot" aria-hidden>
            <img
              className="play-hud__star-img"
              src={ASSETS.hudStarIcon}
              alt=""
              draggable={false}
              onError={hideBrokenAsset}
            />
            <span className="play-hud__star-fallback">★</span>
          </span>
          <span className="play-hud__score-text">
            <span className="play-hud__score-label">점수</span>
            <strong className="play-hud__score-value">{score}</strong>
          </span>
        </HudFramePanel>

        <HudFrameButton
          variant="menu"
          frameSrc={ASSETS.hudMenuFrame}
          className="play-hud__menu"
          ariaLabel="메뉴"
          onClick={onMenu}
        >
          <MenuGearIcon />
        </HudFrameButton>
      </div>
    </header>
  )
}
