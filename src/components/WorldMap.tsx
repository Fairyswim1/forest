import { useState } from 'react'
import { ASSETS, GAME_TITLE } from '../types/game'
import type { StageConfig, StageProgressStatus, WorldConfig } from '../types/stage'
import { canEnterStage } from '../utils/stageProgress'
import { GameMenuModal } from './GameMenuModal'
import { GameRulesModal } from './GameRulesModal'
import { hasSeenRules, markRulesSeen } from '../utils/rulesStorage'

export interface WorldMapRegion {
  world: WorldConfig
  stage?: StageConfig
  status: StageProgressStatus
}

interface WorldMapProps {
  regions: WorldMapRegion[]
  totalStars: number
  onEnterStage: (stageId: string) => void
  onReplayTutorial: () => void
}

function regionNodeAsset(world: WorldConfig, status: StageProgressStatus): string {
  if (world.id === 'integer-cave') {
    if (status === 'locked') return ASSETS.caveNodeLocked
    if (status === 'complete') return ASSETS.caveNodeComplete
    return ASSETS.caveNodeOpen
  }
  if (world.id === 'rational-meadow') {
    if (status === 'locked') return ASSETS.meadowNodeLocked
    if (status === 'complete') return ASSETS.meadowNodeComplete
    return ASSETS.meadowNodeOpen
  }
  if (world.id === 'real-starlight-space') {
    if (status === 'locked') return ASSETS.starlightNodeLocked
    if (status === 'complete') return ASSETS.starlightNodeComplete
    return ASSETS.starlightNodeOpen
  }
  if (status === 'locked') return ASSETS.stageNodeClosed
  return ASSETS.stageNodeOpen
}

export function WorldMap({ regions, totalStars, onEnterStage, onReplayTutorial }: WorldMapProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(() => !hasSeenRules())

  const closeRules = () => {
    markRulesSeen()
    setRulesOpen(false)
  }

  return (
    <div className="world-map">
      <div
        className="world-map__bg"
        style={{ backgroundImage: `url(${ASSETS.worldmapBg})` }}
        aria-hidden
      />
      <div className="world-map__vignette" aria-hidden />

      <header className="world-map__hud">
        <h1 className="world-map__game-title">{GAME_TITLE}</h1>
        <div className="world-map__chapter">통합 월드맵</div>
        <div className="world-map__hud-right">
          <button
            type="button"
            className="world-map__rules-btn fantasy-menu-btn"
            onClick={() => setRulesOpen(true)}
          >
            게임 방법
          </button>
          <span className="world-map__stars">★ {totalStars}</span>
          <button
            type="button"
            className="world-map__menu-btn fantasy-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴"
          >
            ⚙
          </button>
        </div>
      </header>

      <main className="world-map__main">
        <div className="world-map__nodes">
          {regions.map(({ world, stage, status }) => {
            const enterable = stage ? canEnterStage(stage.id) : false
            const locked = !enterable

            return (
              <button
                key={world.id}
                type="button"
                className={[
                  'world-stage-node',
                  `world-stage-node--${status}`,
                  locked ? 'world-stage-node--disabled' : '',
                  world.theme === 'meadow' ? 'world-stage-node--meadow' : '',
                  world.theme === 'cave' ? 'world-stage-node--cave' : '',
                  world.theme === 'space' ? 'world-stage-node--space' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => stage && enterable && onEnterStage(stage.id)}
                disabled={!enterable}
                aria-label={`${world.title}${locked ? ' (잠김)' : ''}`}
              >
                {!locked && (
                  <>
                    <span className="world-stage-node__glow" aria-hidden />
                    <span className="world-stage-node__spark world-stage-node__spark--1" aria-hidden>✦</span>
                    <span className="world-stage-node__spark world-stage-node__spark--2" aria-hidden>✦</span>
                    <span className="world-stage-node__spark world-stage-node__spark--3" aria-hidden>✦</span>
                  </>
                )}

                <span className="world-stage-node__visual">
                  <img
                    className="world-stage-node__asset"
                    src={regionNodeAsset(world, status)}
                    alt=""
                    draggable={false}
                  />
                  {status === 'complete' && (
                    <span className="world-stage-node__complete-badge" aria-hidden>✓</span>
                  )}
                </span>

                <span className="world-stage-node__meta">
                  <strong className="world-stage-node__title">{world.title}</strong>
                  <span className="world-stage-node__topic">{world.subtitle}</span>
                  {status === 'locked' && <span className="world-stage-node__lock-text">잠김</span>}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {menuOpen && (
        <GameMenuModal onClose={() => setMenuOpen(false)} onReplayTutorial={onReplayTutorial} />
      )}

      {rulesOpen && <GameRulesModal onClose={closeRules} />}
    </div>
  )
}
