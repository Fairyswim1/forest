import { useEffect, useState } from 'react'
import { playBgm, playSfx } from '../audio/audioManager'
import { ASSETS, GAME_TITLE } from '../types/game'
import type { StageConfig, WorldConfig } from '../types/stage'
import { GameMenuModal } from './GameMenuModal'
import { GameRulesModal } from './GameRulesModal'
import { hasSeenRules, markRulesSeen } from '../utils/rulesStorage'

export interface WorldMapRegion {
  world: WorldConfig
  stage?: StageConfig
}

interface WorldMapProps {
  regions: WorldMapRegion[]
  onEnterStage: (stageId: string) => void
  onReplayTutorial: () => void
}

function regionNodeAsset(world: WorldConfig): string {
  if (world.id === 'integer-cave') return ASSETS.caveNodeOpen
  if (world.id === 'rational-meadow') return ASSETS.meadowNodeOpen
  if (world.id === 'real-starlight-space') return ASSETS.starlightNodeOpen
  return ASSETS.stageNodeOpen
}

export function WorldMap({ regions, onEnterStage, onReplayTutorial }: WorldMapProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(() => !hasSeenRules())

  useEffect(() => {
    playBgm()
  }, [])

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
            onClick={() => {
              playSfx('click')
              setRulesOpen(true)
            }}
          >
            게임 방법
          </button>
          <button
            type="button"
            className="world-map__menu-btn fantasy-menu-btn"
            onClick={() => {
              playSfx('click')
              setMenuOpen(true)
            }}
            aria-label="메뉴"
          >
            ⚙
          </button>
        </div>
      </header>

      <main className="world-map__main">
        <div className="world-map__nodes">
          {regions.map(({ world, stage }) => {
            const enterable = Boolean(stage)

            return (
              <button
                key={world.id}
                type="button"
                className={[
                  'world-stage-node',
                  'world-stage-node--open',
                  !enterable ? 'world-stage-node--disabled' : '',
                  world.theme === 'meadow' ? 'world-stage-node--meadow' : '',
                  world.theme === 'cave' ? 'world-stage-node--cave' : '',
                  world.theme === 'space' ? 'world-stage-node--space' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  if (!stage) return
                  playSfx('click')
                  onEnterStage(stage.id)
                }}
                disabled={!enterable}
                aria-label={world.title}
              >
                <span className="world-stage-node__visual">
                  <img
                    className="world-stage-node__asset"
                    src={regionNodeAsset(world)}
                    alt=""
                    draggable={false}
                  />
                </span>

                <span className="world-stage-node__meta">
                  <strong className="world-stage-node__title">{world.title}</strong>
                  <span className="world-stage-node__topic">{world.subtitle}</span>
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
