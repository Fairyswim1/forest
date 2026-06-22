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
  breakAfter?: boolean
  breakBefore?: boolean
  runIndex?: number
  isRunStart?: boolean
  isRunEnd?: boolean
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
  breakAfter = false,
  breakBefore = false,
  runIndex,
  isRunStart = false,
  isRunEnd = false,
  isScoringRun = false,
}: TrailTileProps) {
  const tone = value !== null ? getNumberTone(value) : null

  const positionStyle: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    ...(staggerStars && state === 'success' && isScoringRun
      ? ({ '--run-index': runIndex ?? 0, '--run-tile-index': pathIndex } as CSSProperties)
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
        resultMode && state === 'success' && isScoringRun && isRunStart
          ? 'trail-tile--run-start'
          : '',
        resultMode && state === 'success' && isScoringRun && isRunEnd ? 'trail-tile--run-end' : '',
        resultMode && breakAfter ? 'trail-tile--break-after' : '',
        resultMode && breakBefore ? 'trail-tile--break-before' : '',
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
        {resultMode && state === 'success' && isScoringRun && (
          <span className="trail-tile__result-ring" aria-hidden />
        )}
      </span>
      {value !== null && (
        <span className={`trail-tile__value trail-tile__value--${tone}`}>{value}</span>
      )}
      {state === 'success' && isScoringRun && (
        <span className="trail-tile__fx" aria-hidden>
          <span className="trail-tile__star trail-tile__star--1">✦</span>
          <span className="trail-tile__star trail-tile__star--2">✦</span>
          {resultMode && <span className="trail-tile__star trail-tile__star--3">✦</span>}
        </span>
      )}
      {resultMode && breakBefore && (
        <span className="trail-tile__break-marker trail-tile__break-marker--before" aria-hidden>
          <span className="trail-tile__break-marker-icon">⚠</span>
        </span>
      )}
      {resultMode && breakAfter && (
        <span className="trail-tile__break-marker" aria-hidden title="순서가 끊긴 지점">
          <span className="trail-tile__break-marker-icon">⚠</span>
          <span className="trail-tile__break-marker-arrow">↓</span>
        </span>
      )}
    </button>
  )
}
