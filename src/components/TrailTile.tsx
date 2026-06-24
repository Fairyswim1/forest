import type { CSSProperties } from 'react'
import type { BoardCell } from '../types/board'
import { ASSETS, type TileId, type TileState } from '../types/game'
import { TileValueText } from './TileValueText'

interface TrailTileProps {
  id: TileId
  x: number
  y: number
  cell: BoardCell | null
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
  runColor?: string
  runGlow?: string
  runBadgeSrc?: string
  runBadgeLabel?: string
}

function tileImage(state: TileState): string {
  if (state === 'selected') return ASSETS.selectedTile
  return ASSETS.emptyTile
}

export function TrailTile({
  id,
  x,
  y,
  cell,
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
  isScoringRun = false,
  runColor,
  runGlow,
  runBadgeSrc,
  runBadgeLabel,
}: TrailTileProps) {
  const hasRunColor = resultMode && isScoringRun && runColor

  const positionStyle: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    ...(hasRunColor
      ? ({ '--run-color': runColor, '--run-glow': runGlow ?? runColor } as CSSProperties)
      : {}),
    ...(staggerStars && state === 'success' && isScoringRun && !resultMode
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
        hasRunColor ? 'trail-tile--run-colored' : '',
        resultMode && state === 'success' && isScoringRun && !hasRunColor
          ? 'trail-tile--result-success'
          : '',
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
      disabled={disabled || cell !== null}
      aria-label={`타일 ${id}${cell !== null ? `: ${cell.displayValue}` : ''}`}
      data-tile-id={id}
    >
      {runBadgeSrc && (
        <img
          className="trail-tile__run-badge-img"
          src={runBadgeSrc}
          alt={runBadgeLabel ? `구간 ${runBadgeLabel}` : ''}
          draggable={false}
        />
      )}

      <span className="trail-tile__sprite" aria-hidden>
        <img className="trail-tile__img" src={tileImage(state)} alt="" draggable={false} />
      </span>

      {cell !== null && <TileValueText cell={cell} />}

      {!resultMode && state === 'success' && isScoringRun && (
        <span className="trail-tile__fx" aria-hidden>
          <span className="trail-tile__star trail-tile__star--1">✦</span>
          <span className="trail-tile__star trail-tile__star--2">✦</span>
        </span>
      )}

      {resultMode && breakBefore && (
        <span className="trail-tile__break-marker trail-tile__break-marker--before" aria-hidden>
          <span className="trail-tile__break-marker-icon">✕</span>
        </span>
      )}
      {resultMode && breakAfter && (
        <span className="trail-tile__break-marker" aria-hidden title="순서가 끊긴 지점">
          <span className="trail-tile__break-marker-icon">✕</span>
          <span className="trail-tile__break-marker-arrow">↓</span>
        </span>
      )}
    </button>
  )
}
