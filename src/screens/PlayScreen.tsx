import { useEffect, useRef, useState } from 'react'
import { STAGE_1_1, ASSETS, type TileId } from '../types/game'
import { useGameLoop } from '../hooks/useGameLoop'
import { ControlBar, CurrentCard, PlayHud } from '../components/PlayUI'
import { TrailBoard } from '../components/TrailBoard'
import { PlayTutorial } from '../components/PlayTutorial'
import type { ResultPayload } from '../screens/ResultScreen'
import { isTutorialCompleted, markTutorialCompleted } from '../utils/tutorialStorage'

const TUTORIAL_DEMO_CARD = 5
const TUTORIAL_DEMO_TILE: TileId = 7

interface PlayScreenProps {
  onBack: () => void
  onComplete: (payload: Omit<ResultPayload, 'isNewRecord'>) => void
  forceTutorial?: boolean
  onTutorialFinished?: () => void
}

export function PlayScreen({
  onBack,
  onComplete,
  forceTutorial = false,
  onTutorialFinished,
}: PlayScreenProps) {
  const game = useGameLoop()
  const completedRef = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
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
        board: { ...game.board },
      })
    }, 550)

    return () => window.clearTimeout(timer)
  }, [game.phase, game.gameResult, game.board, onComplete])

  const finishTutorial = () => {
    markTutorialCompleted()
    setTutorialActive(false)
    onTutorialFinished?.()
  }

  const displayCardValue = tutorialActive ? TUTORIAL_DEMO_CARD : game.currentCard
  const displayCardPhase = tutorialActive ? 'panel' : game.cardPhase
  const tutorialSelectedTile = tutorialStep === 2 ? TUTORIAL_DEMO_TILE : null

  const canConfirm =
    !tutorialActive &&
    game.cardPhase === 'panel' &&
    game.selectedTileId !== null &&
    game.phase === 'playing'
  const canUndo = !tutorialActive && game.history.length > 0 && game.phase !== 'finished'
  const interactionsBlocked = tutorialActive || game.phase === 'finished'

  return (
    <div className={`play-screen ${tutorialActive ? 'play-screen--tutorial' : ''}`}>
      <div
        className="play-screen__bg"
        style={{ backgroundImage: `url(${ASSETS.playfieldBg})` }}
        aria-hidden
      />
      <div className="play-screen__vignette" aria-hidden />

      <header className="play-screen__hud">
        <PlayHud
          stageLabel={STAGE_1_1.label}
          topic={STAGE_1_1.topic}
          round={game.round}
          score={game.score}
          onMenu={onBack}
        />
      </header>

      <main className="play-screen__main">
        <div
          ref={boardRef}
          className={[
            'play-screen__board-stage',
            tutorialActive && tutorialStep === 3 ? 'play-screen__board-stage--tutorial-soft' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <TrailBoard
            board={game.board}
            selectedTileId={game.selectedTileId}
            forcedSelectedTileId={tutorialSelectedTile}
            successTileIds={game.successTileIds}
            onSelectTile={interactionsBlocked ? () => {} : game.selectTile}
            disabled={interactionsBlocked}
            tutorialEmptyPulse={tutorialActive && tutorialStep === 1}
          />
        </div>
      </main>

      <footer className="play-screen__dock">
        <ControlBar
          timeLeft={game.timeLeft}
          canConfirm={canConfirm}
          canUndo={canUndo}
          onConfirm={interactionsBlocked ? () => {} : game.confirmPlacement}
          onUndo={interactionsBlocked ? () => {} : game.undo}
          cardContainerRef={cardRef}
          confirmButtonRef={confirmRef}
          highlightConfirm={tutorialActive && tutorialStep === 2}
          currentCard={
            <CurrentCard
              value={displayCardValue}
              phase={displayCardPhase}
              panelClassName={
                tutorialActive && tutorialStep === 0 ? 'current-card-panel--tutorial-highlight' : undefined
              }
            />
          }
        />
      </footer>

      {tutorialActive && (
        <PlayTutorial
          step={tutorialStep}
          cardRef={cardRef}
          boardRef={boardRef}
          confirmRef={confirmRef}
          onNext={() => setTutorialStep((step) => step + 1)}
          onStart={finishTutorial}
        />
      )}
    </div>
  )
}
