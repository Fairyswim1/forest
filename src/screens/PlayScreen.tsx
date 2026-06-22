import { useEffect, useMemo, useRef, useState } from 'react'
import type { StageConfig } from '../types/stage'
import { type TileId } from '../types/game'
import { useGameLoop } from '../hooks/useGameLoop'
import { calculateGameResult } from '../utils/scoring'
import { ControlBar, CurrentCard, PlayHud } from '../components/PlayUI'
import { CardRevealFlight } from '../components/CardRevealFlight'
import { CardPanelPlacementFlight } from '../components/CardPanelPlacementFlight'
import { TrailBoard } from '../components/TrailBoard'
import { PlayTutorial } from '../components/PlayTutorial'
import type { ResultPayload } from '../screens/ResultScreen'
import { isTutorialCompleted, markTutorialCompleted } from '../utils/tutorialStorage'

const TUTORIAL_DEMO_CARD = 5
const TUTORIAL_DEMO_TILE: TileId = 7

interface PlayScreenProps {
  stage: StageConfig
  onBack: () => void
  onComplete: (payload: Omit<ResultPayload, 'isNewRecord'>) => void
  forceTutorial?: boolean
  onTutorialFinished?: () => void
}

export function PlayScreen({
  stage,
  onBack,
  onComplete,
  forceTutorial = false,
  onTutorialFinished,
}: PlayScreenProps) {
  const game = useGameLoop(stage)
  const completedRef = useRef(false)

  const liveScore = useMemo(() => {
    const r = calculateGameResult(game.board)
    return { longestRun: r.longestSegmentLength, runCount: r.nonDecreasingSegmentCount, score: r.finalScore }
  }, [game.board])
  const cardRef = useRef<HTMLDivElement>(null)
  const boardAreaRef = useRef<HTMLElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)

  const [tutorialActive, setTutorialActive] = useState(
    () => forceTutorial || !isTutorialCompleted(),
  )
  const [tutorialStep, setTutorialStep] = useState(0)

  useEffect(() => {
    completedRef.current = false
  }, [])

  useEffect(() => {
    if (forceTutorial) {
      setTutorialActive(true)
      setTutorialStep(0)
    }
  }, [forceTutorial])

  useEffect(() => {
    if (!tutorialActive && game.phase === 'intro') game.startGame()
  }, [tutorialActive, game.phase, game.startGame])

  useEffect(() => {
    if (game.phase !== 'finished' || !game.gameResult || completedRef.current) return

    completedRef.current = true
    const timer = window.setTimeout(() => {
      onComplete({
        result: game.gameResult!,
        board: { ...game.displayBoard },
      })
    }, 550)

    return () => window.clearTimeout(timer)
  }, [game.phase, game.gameResult, game.displayBoard, onComplete])

  const finishTutorial = () => {
    markTutorialCompleted()
    setTutorialActive(false)
    onTutorialFinished?.()
  }

  const panelCardValue = tutorialActive ? TUTORIAL_DEMO_CARD : game.displayCardValue
  const panelCardPhase = tutorialActive ? 'panel' : game.cardPhase === 'panel' ? 'panel' : 'hidden'

  const revealCardValue = tutorialActive ? null : game.revealCardValue
  const revealActive = !tutorialActive && game.cardPhase === 'center' && revealCardValue !== null
  const revealKey = `${game.round}-${game.currentCard?.id ?? 'none'}`

  const placementFlightValue =
    !tutorialActive && game.cardPhase === 'placing' && game.pendingPlacement
      ? game.pendingPlacement.card.numericValue
      : null
  const placementFlightTileId =
    game.cardPhase === 'placing' ? (game.pendingPlacement?.tileId ?? null) : null
  const placementFlightKey = `${game.round}-${placementFlightTileId ?? 'none'}-fly`

  const tutorialSelectedTile = tutorialStep === 1 ? TUTORIAL_DEMO_TILE : null
  const tempTileId = game.currentTurnPlacement?.tileId ?? null

  const interactionsBlocked =
    tutorialActive ||
    game.phase === 'finished' ||
    game.cardPhase === 'placing' ||
    game.cardPhase === 'center' ||
    game.cardPhase === 'hidden'

  const canReset = !tutorialActive && game.canResetPlacement
  const canConfirm = !tutorialActive && game.canCommit

  return (
    <div className={`play-screen ${tutorialActive ? 'play-screen--tutorial' : ''}`}>
      <div
        className="play-screen__bg"
        style={{ backgroundImage: `url(${stage.backgroundAsset})` }}
        aria-hidden
      />
      <div className="play-screen__vignette" aria-hidden />

      <header className="play-screen__hud">
        <PlayHud
          stageLabel={stage.title}
          topic={stage.subtitle}
          round={game.round}
          score={game.score}
          onMenu={onBack}
        />
      </header>

      <main ref={boardAreaRef} className="play-screen__board-area">
        <div
          ref={boardRef}
          className={[
            'play-screen__board-stage',
            tutorialActive && tutorialStep === 4 ? 'play-screen__board-stage--tutorial-soft' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <TrailBoard
            board={game.displayBoard}
            selectedTileId={tempTileId}
            forcedSelectedTileId={tutorialSelectedTile}
            successTileIds={game.successTileIds}
            onSelectTile={interactionsBlocked ? () => {} : game.placeOnTile}
            disabled={interactionsBlocked}
            tutorialEmptyPulse={tutorialActive && tutorialStep === 1}
            placingTileId={placementFlightTileId}
            placingValue={placementFlightValue}
            trailOverlay={stage.trailAsset}
          />
        </div>
      </main>

      <footer className="play-screen__control-bar">
        <ControlBar
          timeLeft={game.timeLeft}
          canConfirm={canConfirm}
          canReset={canReset}
          onConfirm={interactionsBlocked ? () => {} : game.confirmTurn}
          onReset={interactionsBlocked ? () => {} : game.resetCurrentPlacement}
          cardContainerRef={cardRef}
          confirmButtonRef={confirmRef}
          resetButtonRef={resetRef}
          highlightConfirm={tutorialActive && tutorialStep === 2}
          liveScore={liveScore}
          currentCard={
            <CurrentCard
              value={panelCardValue}
              phase={panelCardPhase}
              showHint={!tutorialActive && game.cardPhase === 'panel'}
              turnWarning={!tutorialActive && game.turnWarning}
              panelClassName={
                tutorialActive && tutorialStep === 0 ? 'current-card-panel--tutorial-highlight' : undefined
              }
            />
          }
        />
      </footer>

      <CardRevealFlight
        value={revealCardValue}
        active={revealActive}
        targetRef={cardRef}
        boardAreaRef={boardAreaRef}
        revealKey={revealKey}
        onComplete={game.completeCardReveal}
      />

      <CardPanelPlacementFlight
        value={placementFlightValue}
        tileId={placementFlightTileId}
        active={game.cardPhase === 'placing' && placementFlightValue !== null}
        sourceRef={cardRef}
        flightKey={placementFlightKey}
      />

      {tutorialActive && (
        <PlayTutorial
          step={tutorialStep}
          cardRef={cardRef}
          boardRef={boardRef}
          confirmRef={confirmRef}
          resetRef={resetRef}
          onNext={() => setTutorialStep((step) => step + 1)}
          onStart={finishTutorial}
        />
      )}
    </div>
  )
}
