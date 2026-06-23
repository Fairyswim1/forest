import { useState } from 'react'
import { ASSETS, GAME_TITLE } from '../types/game'
import type { StageConfig, StageProgressStatus, WorldConfig } from '../types/stage'
import { canEnterStage } from '../utils/stageProgress'
import { GameMenuModal } from './GameMenuModal'

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

function stageNumber(stageId: string): string {
  return stageId.split('-').slice(-2).join('-')
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
          <span className="world-map__stars">★ {totalStars}</span>
          <button
            type="button"
            className="world-map__menu-btn menu-button"
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
            const nodeTitle = stage ? stage.title : world.title
            const nodeTopic = stage ? stage.subtitle : world.subtitle
            const centerLabel = stage ? stageNumber(stage.id) : '🔒'

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
                aria-label={`${world.title} — ${nodeTitle}${locked ? ' (잠김)' : ''}`}
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
                  <span className="world-stage-node__id">{centerLabel}</span>
                  {status === 'complete' && (
                    <span className="world-stage-node__complete-badge" aria-hidden>✓</span>
                  )}
                </span>

                <span className="world-stage-node__meta">
                  <span className="world-stage-node__world">{world.title}</span>
                  <strong className="world-stage-node__title">{nodeTitle}</strong>
                  <span className="world-stage-node__topic">{nodeTopic}</span>
                  {status === 'locked' && <span className="world-stage-node__lock-text">잠김</span>}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      <footer className="world-map__footer">
        {import.meta.env.DEV
          ? '개발 모드: 잠긴 스테이지도 직접 진입할 수 있습니다.'
          : '통합 월드맵에서 지역을 선택해 탐험을 시작하세요!'}
      </footer>

      {menuOpen && (
        <GameMenuModal onClose={() => setMenuOpen(false)} onReplayTutorial={onReplayTutorial} />
      )}
    </div>
  )
}
