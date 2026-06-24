import { useCallback, useMemo, useState } from 'react'
import { AppBootstrapError, AppBootstrapLoading } from './components/AppBootstrapGate'
import { PlayerProfileProvider } from './context/PlayerProfileContext'
import { WorldMap } from './components/WorldMap'
import { useAppBootstrap } from './hooks/useAppBootstrap'
import { PlayScreen } from './screens/PlayScreen'
import { ProfileSetupScreen } from './screens/ProfileSetupScreen'
import { ResultScreen, type ResultPayload } from './screens/ResultScreen'
import { NATURAL_1_1 } from './config/stages'
import { getActiveStage, getStageById, getStageByWorldId } from './config/stageRegistry'
import { WORLDS } from './config/worlds'
import { touchLastPlayedAt } from './services/playerProfileService'
import { buildDemoResultPayload } from './utils/demoResultBoard'
import { getStageIdFromUrl, isUnlockAllMode } from './utils/devUnlock'
import { getStageBestScore, markStageComplete, updateStageBestScore } from './utils/gameRecords'
import { getStageProgressStatus } from './utils/stageProgress'

type Screen = 'map' | 'play' | 'result'

const FADE_MS = 420

function initialPreviewResult(): ResultPayload | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  if (new URLSearchParams(window.location.search).get('previewResult') !== '1') return null
  return buildDemoResultPayload()
}

function initialScreen(): Screen {
  if (typeof window === 'undefined') return 'map'
  const params = new URLSearchParams(window.location.search)
  if (isUnlockAllMode() && getStageIdFromUrl()) return 'play'
  if (import.meta.env.DEV && params.get('previewResult') === '1') return 'result'
  return 'map'
}

function GameApp() {
  const bootstrap = useAppBootstrap()
  const [selectedStageId, setSelectedStageId] = useState(
    () => getStageIdFromUrl() ?? getActiveStage().id,
  )
  const selectedStage = getStageById(selectedStageId) ?? NATURAL_1_1

  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [visible, setVisible] = useState(true)
  const [playKey, setPlayKey] = useState(0)
  const [forceTutorial, setForceTutorial] = useState(false)
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(initialPreviewResult)
  const [progressTick, setProgressTick] = useState(0)

  const [totalStars, setTotalStars] = useState(() => {
    const scores = [NATURAL_1_1, ...WORLDS.map((w) => getStageByWorldId(w.id)).filter(Boolean)]
      .map((stage) => getStageBestScore(stage!.id))
      .filter((score): score is number => score !== null)
    if (scores.length === 0) return 0
    return Math.floor(Math.max(...scores) / 10)
  })

  const regions = useMemo(
    () =>
      WORLDS.map((world) => {
        const stage = getStageByWorldId(world.id)
        const status = stage ? getStageProgressStatus(stage.id) : 'locked'
        return { world, stage, status }
      }),
    [screen, progressTick],
  )

  const transitionTo = useCallback((next: Screen) => {
    setVisible(false)
    window.setTimeout(() => {
      setScreen(next)
      setVisible(true)
    }, FADE_MS)
  }, [])

  const handleComplete = useCallback(
    (payload: Omit<ResultPayload, 'isNewRecord'>) => {
      const { isNewRecord, bestScore } = updateStageBestScore(
        selectedStage.id,
        payload.result.finalScore,
      )
      markStageComplete(selectedStage.id)
      setResultPayload({ ...payload, isNewRecord })
      setTotalStars((prev) => Math.max(prev, Math.floor(bestScore / 10)))
      setProgressTick((tick) => tick + 1)
      transitionTo('result')
    },
    [selectedStage.id, transitionTo],
  )

  const handleEnterStage = useCallback(
    (stageId: string) => {
      setSelectedStageId(stageId)
      setForceTutorial(false)
      setPlayKey((key) => key + 1)
      transitionTo('play')
    },
    [transitionTo],
  )

  const handleRetry = useCallback(() => {
    setResultPayload(null)
    setForceTutorial(false)
    setPlayKey((key) => key + 1)
    transitionTo('play')
  }, [transitionTo])

  const handleReplayTutorial = useCallback(() => {
    setSelectedStageId(NATURAL_1_1.id)
    setForceTutorial(true)
    setPlayKey((key) => key + 1)
    transitionTo('play')
  }, [transitionTo])

  const handleWorldMap = useCallback(() => {
    setResultPayload(null)
    if (bootstrap.firebaseUser) {
      void touchLastPlayedAt(bootstrap.firebaseUser.uid).catch(() => {})
    }
    transitionTo('map')
  }, [bootstrap.firebaseUser, transitionTo])

  const handleProfileComplete = useCallback(
    (profile: Parameters<typeof bootstrap.completeProfileSetup>[0]) => {
      bootstrap.completeProfileSetup(profile)
      transitionTo('map')
    },
    [bootstrap, transitionTo],
  )

  if (bootstrap.authLoading || bootstrap.profileLoading) {
    return <AppBootstrapLoading />
  }

  if (bootstrap.bootstrapError && bootstrap.firebaseEnabled) {
    return <AppBootstrapError message={bootstrap.bootstrapError} onRetry={bootstrap.retryBootstrap} />
  }

  if (bootstrap.profileSetupRequired && bootstrap.firebaseUser) {
    return (
      <ProfileSetupScreen uid={bootstrap.firebaseUser.uid} onComplete={handleProfileComplete} />
    )
  }

  return (
    <PlayerProfileProvider
      firebaseUser={bootstrap.firebaseUser}
      playerProfile={bootstrap.playerProfile}
      setPlayerProfile={bootstrap.setPlayerProfile}
    >
      <div className={`app-root ${visible ? 'app-root--visible' : 'app-root--hidden'}`}>
        {screen === 'map' && (
          <WorldMap
            regions={regions}
            totalStars={totalStars}
            onEnterStage={handleEnterStage}
            onReplayTutorial={handleReplayTutorial}
          />
        )}

        {screen === 'play' && (
          <PlayScreen
            key={`${selectedStage.id}-${playKey}`}
            stage={selectedStage}
            forceTutorial={forceTutorial && selectedStage.id === NATURAL_1_1.id}
            onTutorialFinished={() => setForceTutorial(false)}
            onBack={() => transitionTo('map')}
            onComplete={handleComplete}
          />
        )}

        {screen === 'result' && resultPayload && (
          <ResultScreen
            stage={selectedStage}
            payload={resultPayload}
            onRetry={handleRetry}
            onWorldMap={handleWorldMap}
          />
        )}
      </div>
    </PlayerProfileProvider>
  )
}

export function AppRoot() {
  return <GameApp />
}
