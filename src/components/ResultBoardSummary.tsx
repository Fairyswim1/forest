import { useMemo } from 'react'
import type { TileId } from '../types/game'
import type { GameResult, Run } from '../utils/scoring'
import { getTileRunMap } from '../utils/scoring'
import { getBreakMarkerMidpoints, getTilePositions } from '../utils/pathLayout'
import { buildRunDisplayMeta, getScoringRunLabel } from '../utils/runDisplay'
import { BoardContainer } from './BoardContainer'
import { TrailTile } from './TrailTile'

const BRACKET_STROKE = 'rgba(255, 209, 102, 0.62)'
const BRACKET_Y_OFFSET = 6.2

interface ResultBoardSummaryProps {
  board: Record<TileId, number | null>
  result: GameResult
  trailOverlay?: string
}

function BreakMarker({ marker }: { marker: { id: TileId; x: number; y: number } }) {
  const { x, y } = marker
  return (
    <g className="board-overlay-layer__break-group">
      <text
        x={x}
        y={y + BRACKET_Y_OFFSET + 2.4}
        className="board-overlay-layer__break-arrow"
        textAnchor="middle"
      >
        ↓
      </text>
    </g>
  )
}

function buildRunBracket(
  run: Run,
  positionByTileId: Map<TileId, { x: number; y: number }>,
): string | null {
  if (run.length < 2) return null

  const positions = run.tileIds
    .map((id) => positionByTileId.get(id))
    .filter((pos): pos is { x: number; y: number } => pos !== undefined)

  if (positions.length < 2) return null

  const maxY = Math.max(...positions.map((pos) => pos.y))
  const minX = Math.min(...positions.map((pos) => pos.x))
  const maxX = Math.max(...positions.map((pos) => pos.x))
  const bracketY = maxY + BRACKET_Y_OFFSET
  const tick = 1.1

  return `M ${minX} ${bracketY - tick} L ${minX} ${bracketY} L ${maxX} ${bracketY} L ${maxX} ${bracketY - tick}`
}

export function ResultBoardSummary({ board, result, trailOverlay }: ResultBoardSummaryProps) {
  const positions = useMemo(() => getTilePositions(), [])
  const tileRunMap = useMemo(() => getTileRunMap(result.runs), [result.runs])
  const runMeta = useMemo(() => buildRunDisplayMeta(result.runs), [result.runs])
  const breakMarkers = useMemo(
    () => getBreakMarkerMidpoints(result.breakAfterTileIds),
    [result.breakAfterTileIds],
  )

  const positionByTileId = useMemo(() => {
    const map = new Map<TileId, { x: number; y: number }>()
    for (const pos of positions) map.set(pos.id, { x: pos.x, y: pos.y })
    return map
  }, [positions])

  const runBrackets = useMemo(
    () =>
      result.scoringRuns.map((run, scoringRunIndex) => ({
        key: `bracket-${scoringRunIndex}`,
        path: buildRunBracket(run, positionByTileId),
      })),
    [result.scoringRuns, positionByTileId],
  )

  const runBadges = useMemo(
    () =>
      runMeta
        .filter((meta) => meta.isScoring)
        .map((meta) => {
          const firstId = meta.run.tileIds[0]
          const pos = firstId !== undefined ? positionByTileId.get(firstId) : undefined
          if (!pos) return null
          return {
            x: pos.x,
            y: pos.y,
            label: getScoringRunLabel(meta.scoringRunIndex),
            key: `badge-${meta.scoringRunIndex}`,
          }
        })
        .filter((badge): badge is NonNullable<typeof badge> => badge !== null),
    [runMeta, positionByTileId],
  )

  const overlayLayer = (
    <>
      <svg
        className="board-overlay-layer"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {runBrackets.map(({ path, key }) =>
          path ? (
            <path
              key={key}
              d={path}
              className="board-overlay-layer__run-bracket"
              fill="none"
              stroke={BRACKET_STROKE}
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
        {breakMarkers.map((marker) => (
          <BreakMarker key={marker.id} marker={marker} />
        ))}
      </svg>

      <div className="result-badges-layer" aria-hidden>
        {runBadges.map(({ x, y, label, key }) => (
          <div key={key} className="run-badge" style={{ left: `${x}%`, top: `${y}%` }}>
            {label}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="result-board-summary" aria-label="보드 결과 요약">
      <BoardContainer className="board-container--summary" overlayLayer={overlayLayer} trailOverlay={trailOverlay}>
        {positions.map((pos) => {
          const value = board[pos.id]
          const runInfo = tileRunMap.get(pos.id)
          const run = runInfo?.run
          const isScoringRun = (run?.length ?? 0) >= 2
          const isSuccess = result.successTileIds.has(pos.id)
          const isIsolated = value !== null && !isSuccess

          let state: 'empty' | 'selected' | 'placed' | 'success' = 'empty'
          if (isSuccess) state = 'success'
          else if (value !== null) state = 'placed'

          const runTileIndex = run ? run.tileIds.indexOf(pos.id) : -1

          return (
            <TrailTile
              key={pos.id}
              id={pos.id}
              x={pos.x}
              y={pos.y}
              value={value}
              state={state}
              onClick={() => {}}
              disabled
              dimmed={isIsolated}
              pathIndex={runTileIndex >= 0 ? runTileIndex : pos.pathIndex}
              resultMode
              resultIsolated={isIsolated}
              isScoringRun={isScoringRun}
            />
          )
        })}
      </BoardContainer>
    </div>
  )
}
