import type { CSSProperties } from 'react'
import { ASSETS, type TileId, type TileState } from '../types/game'
import { getNumberTone } from '../utils/deck'

interface TrailTileProps {
  id: TileId
  x: number
  y: number
  value: number | null
  state: TileState
  onClick: (id: TileId) => void
  disabled?: boolean
  dimmed?: boolean
  pathIndex?: number
  staggerStars?: boolean
  tutorialPulse?: boolean
  placing?: boolean
  resultMode?: boolean
  resultIsolated?: boolean
  isScoringRun?: boolean
}

function tileImage(state: TileState): string {
  if (state === 'selected') return ASSETS.selectedTile
  return ASSETS.emptyTile
}

export function TrailTile({
  id,
  x,
  y,
  value,
  state,
  onClick,
  disabled,
  dimmed = false,
  pathIndex = 0,
  staggerStars = false,
  tutorialPulse = false,
  placing = false,
  resultMode = false,
  resultIsolated = false,
  isScoringRun = false,
}: TrailTileProps) {
  const tone = value !== null ? getNumberTone(value) : null

  const positionStyle: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    ...(staggerStars && state === 'success' && isScoringRun
      ? ({ '--run-tile-index': pathIndex } as CSSProperties)
      : {}),
  }

  return (
    <button
      type="button"
      className={[
        'trail-tile',
        `trail-tile--${state}`,
        dimmed ? 'trail-tile--dimmed' : '',
        staggerStars && state === 'success' && isScoringRun ? 'trail-tile--stagger-fx' : '',
        resultMode && state === 'success' && isScoringRun ? 'trail-tile--result-success' : '',
        resultMode && resultIsolated ? 'trail-tile--result-isolated' : '',
        tutorialPulse && state === 'empty' ? 'trail-tile--tutorial-pulse' : '',
        placing ? 'trail-tile--placing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={positionStyle}
      onClick={() => onClick(id)}
      disabled={disabled || value !== null}
      aria-label={`타일 ${id}${value !== null ? `: ${value}` : ''}`}
      data-tile-id={id}
    >
      <span className="trail-tile__sprite" aria-hidden>
        <img className="trail-tile__img" src={tileImage(state)} alt="" draggable={false} />
      </span>
      {value !== null && (
        <span className={`trail-tile__value trail-tile__value--${tone}`}>{value}</span>
      )}
      {state === 'success' && isScoringRun && !resultMode && (
        <span className="trail-tile__fx" aria-hidden>
          <span className="trail-tile__star trail-tile__star--1">✦</span>
          <span className="trail-tile__star trail-tile__star--2">✦</span>
        </span>
      )}
    </button>
  )
}
