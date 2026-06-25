import { useEffect, useRef, useState } from 'react'
import { type TileId } from '../types/game'
import type { StageConfig } from '../types/stage'
import { useGameLoop } from '../hooks/useGameLoop'
import { ControlBar, CurrentCard, PlayHud } from '../components/PlayUI'
import { CardRevealFlight } from '../components/CardRevealFlight'
import { CardPanelPlacementFlight } from '../components/CardPanelPlacementFlight'
import { TrailBoard } from '../components/TrailBoard'
import { PlayTutorial } from '../components/PlayTutorial'
import { PlayDirectionHint } from '../components/board/PlayDirectionHint'
import { StageGuideModal } from '../components/StageGuideModal'
import { getPathLayoutForTrailAsset } from '../game/pathLayouts'
import type { ResultPayload } from '../screens/ResultScreen'
import { hasSeenDirectionHint, markDirectionHintSeen } from '../utils/directionHintStorage'
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
  // 시작 안내 모달: 스테이지 진입 시 카드 공개 전에 먼저 보여준다.
  const [guideOpen, setGuideOpen] = useState(true)
  // 플레이 중 ? 버튼으로 다시 여는 재확인 패널 (열려 있는 동안 게임 일시정지)
  const [helpOpen, setHelpOpen] = useState(false)

  const game = useGameLoop(stage, helpOpen || guideOpen)
  const pathLayout = getPathLayoutForTrailAsset(stage.trailAsset)
  const completedRef = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const boardAreaRef = useRef<HTMLElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)

  const [tutorialActive, setTutorialActive] = useState(
    () => forceTutorial || !isTutorialCompleted(),
  )
  const [tutorialStep, setTutorialStep] = useState(0)
  const [directionHintVisible, setDirectionHintVisible] = useState(false)

  useEffect(() => {
    if (guideOpen || tutorialActive || hasSeenDirectionHint()) return

    setDirectionHintVisible(true)
    const hideTimer = window.setTimeout(() => {
      setDirectionHintVisible(false)
      markDirectionHintSeen()
    }, 2800)

    return () => window.clearTimeout(hideTimer)
  }, [guideOpen, tutorialActive])

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
    if (!guideOpen && !tutorialActive && game.phase === 'intro') game.startGame()
  }, [guideOpen, tutorialActive, game.phase, game.startGame])

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
  const panelCardLabel = tutorialActive ? undefined : game.displayCardLabel
  const panelCardPhase = tutorialActive ? 'panel' : game.cardPhase === 'panel' ? 'panel' : 'hidden'

  const revealCardValue = tutorialActive ? null : game.revealCardValue
  const revealCardLabel = tutorialActive ? undefined : game.revealCardLabel
  const revealActive = !tutorialActive && game.cardPhase === 'center' && revealCardValue !== null
  const revealKey = `${game.round}-${game.currentCard?.id ?? 'none'}`

  const placementFlightValue = !tutorialActive ? game.placingCardValue : null
  const placementFlightLabel = !tutorialActive ? game.placingCardLabel : undefined
  const placementFlightTileId =
    game.cardPhase === 'placing' ? (game.pendingPlacement?.tileId ?? null) : null
  const placingCell =
    game.pendingPlacement && placementFlightTileId !== null
      ? {
          displayValue: game.pendingPlacement.card.displayValue,
          numericValue: game.pendingPlacement.card.numericValue,
        }
      : null

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
          totalRounds={stage.deckSize}
          round={game.round}
          score={game.score}
          onMenu={onBack}
          onGuide={() => setHelpOpen(true)}
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
            layout={pathLayout}
            board={game.displayBoard}
            selectedTileId={tempTileId}
            forcedSelectedTileId={tutorialSelectedTile}
            successTileIds={game.successTileIds}
            onSelectTile={interactionsBlocked ? () => {} : game.placeOnTile}
            disabled={interactionsBlocked}
            tutorialEmptyPulse={tutorialActive && tutorialStep === 1}
            placingTileId={placementFlightTileId}
            placingCell={placingCell}
          />
        </div>
      </main>

      <footer className="play-screen__control-bar">
        <PlayDirectionHint visible={directionHintVisible && !guideOpen && !helpOpen} />
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
          currentCard={
            <CurrentCard
              value={panelCardValue}
              displayLabel={panelCardLabel}
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
        displayLabel={revealCardLabel}
        active={revealActive}
        targetRef={cardRef}
        boardAreaRef={boardAreaRef}
        revealKey={revealKey}
        onComplete={game.completeCardReveal}
      />

      <CardPanelPlacementFlight
        value={placementFlightValue}
        displayLabel={placementFlightLabel}
        tileId={placementFlightTileId}
        active={game.cardPhase === 'placing' && placementFlightValue !== null}
        sourceRef={cardRef}
        flightKey={placementFlightKey}
      />

      {!guideOpen && tutorialActive && (
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

      {guideOpen && (
        <StageGuideModal
          stage={stage}
          variant="start"
          backgroundUrl={stage.backgroundAsset}
          onConfirm={() => setGuideOpen(false)}
        />
      )}

      {helpOpen && (
        <StageGuideModal
          stage={stage}
          variant="inplay"
          backgroundUrl={stage.backgroundAsset}
          onConfirm={() => setHelpOpen(false)}
        />
      )}
    </div>
  )
}
