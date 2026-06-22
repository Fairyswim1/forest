import { useState } from 'react'
import { STAGE_1_1, ASSETS, GAME_TITLE } from '../types/game'
import { GameMenuModal } from './GameMenuModal'

interface WorldMapProps {
  totalStars: number
  onEnterStage: () => void
  onReplayTutorial: () => void
}

export function WorldMap({ totalStars, onEnterStage, onReplayTutorial }: WorldMapProps) {
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
        <div className="world-map__chapter">{STAGE_1_1.chapter}</div>
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
          aria-label={`${STAGE_1_1.label} — ${STAGE_1_1.topic}`}
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
            <span className="world-stage-node__id">{STAGE_1_1.id}</span>
          </span>

          <span className="world-stage-node__meta">
            <strong className="world-stage-node__title">{STAGE_1_1.label}</strong>
            <span className="world-stage-node__topic">{STAGE_1_1.topic}</span>
          </span>
        </button>
      </main>

      <footer className="world-map__footer">수의 숲 탐험을 시작해 보세요!</footer>

      {menuOpen && (
        <GameMenuModal onClose={() => setMenuOpen(false)} onReplayTutorial={onReplayTutorial} />
      )}
    </div>
  )
}
