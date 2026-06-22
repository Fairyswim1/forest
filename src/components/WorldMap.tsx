import { useState } from 'react'
import type { StageConfig } from '../types/stage'
import { ASSETS, GAME_TITLE } from '../types/game'
import { GameMenuModal } from './GameMenuModal'

interface WorldMapProps {
  stage: StageConfig
  totalStars: number
  onEnterStage: () => void
  onReplayTutorial: () => void
}

export function WorldMap({ stage, totalStars, onEnterStage, onReplayTutorial }: WorldMapProps) {
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
        <div className="world-map__chapter">{stage.worldTitle}</div>
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
        <button
          type="button"
          className="world-stage-node"
          onClick={onEnterStage}
          aria-label={`${stage.title} — ${stage.subtitle}`}
        >
          <span className="world-stage-node__glow" aria-hidden />
          <span className="world-stage-node__spark world-stage-node__spark--1" aria-hidden>✦</span>
          <span className="world-stage-node__spark world-stage-node__spark--2" aria-hidden>✦</span>
          <span className="world-stage-node__spark world-stage-node__spark--3" aria-hidden>✦</span>

          <span className="world-stage-node__visual">
            <img
              className="world-stage-node__asset"
              src={ASSETS.stageNodeOpen}
              alt=""
              draggable={false}
            />
            <span className="world-stage-node__id">{stage.id}</span>
          </span>

          <span className="world-stage-node__meta">
            <strong className="world-stage-node__title">{stage.title}</strong>
            <span className="world-stage-node__topic">{stage.subtitle}</span>
          </span>
        </button>
      </main>

      <footer className="world-map__footer">{stage.worldTitle} 탐험을 시작해 보세요!</footer>

      {menuOpen && (
        <GameMenuModal onClose={() => setMenuOpen(false)} onReplayTutorial={onReplayTutorial} />
      )}
    </div>
  )
}
