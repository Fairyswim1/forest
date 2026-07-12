import { useCallback, useMemo, useState } from 'react'
import { AppBootstrapError, AppBootstrapLoading } from './components/AppBootstrapGate'
import { PlayerProfileProvider } from './context/PlayerProfileContext'
import { WorldMap } from './components/WorldMap'
import { useAppBootstrap } from './hooks/useAppBootstrap'
import { PlayScreen } from './screens/PlayScreen'
import { ProfileSetupScreen } from './screens/ProfileSetupScreen'
import { ResultScreen, type ResultPayload } from './screens/ResultScreen'
import { TitleScreen } from './screens/TitleScreen'
import { NATURAL_1_1 } from './config/stages'
import { getActiveStage, getStageById, getStageByWorldId } from './config/stageRegistry'
import { WORLDS } from './config/worlds'
import { touchLastPlayedAt, getLocalGuestUid } from './services/playerProfileService'
import { buildDemoResultPayload } from './utils/demoResultBoard'
import { getStageIdFromUrl, isUnlockAllMode } from './utils/devUnlock'
import { updateStageBestScore } from './utils/gameRecords'

type Screen = 'title' | 'map' | 'play' | 'result'

const FADE_MS = 420

function initialPreviewResult(): ResultPayload | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  if (new URLSearchParams(window.location.search).get('previewResult') !== '1') return null
  return buildDemoResultPayload()
}

function initialScreen(): Screen {
  if (typeof window === 'undefined') return 'title'
  const params = new URLSearchParams(window.location.search)
  if (isUnlockAllMode() && getStageIdFromUrl()) return 'play'
  if (import.meta.env.DEV && params.get('previewResult') === '1') return 'result'
  return 'title'
}

function GameApp() {
  const bootstrap = useAppBootstrap()
  const [selectedStageId, setSelectedStageId] = useState(
    () => getStageIdFromUrl() ?? getActiveStage().id,
  )
  const selectedStage = getStageById(selectedStageId) ?? NATURAL_1_1

  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [visible, setVisible] = useState(true)
  const [profileSetupVisible, setProfileSetupVisible] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const [forceTutorial, setForceTutorial] = useState(false)
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(initialPreviewResult)

  const regions = useMemo(
    () =>
      WORLDS.map((world) => {
        const stage = getStageByWorldId(world.id)
        return { world, stage }
      }),
    [],
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
      const { isNewRecord } = updateStageBestScore(selectedStage.id, payload.result.finalScore)
      setResultPayload({ ...payload, isNewRecord })
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
      setProfileSetupVisible(false)
      transitionTo('map')
    },
    [bootstrap, transitionTo],
  )

  const handleTitleStart = useCallback(() => {
    setProfileSetupVisible(true)
  }, [])

  if (bootstrap.authLoading || bootstrap.profileLoading) {
    return <AppBootstrapLoading />
  }

  if (bootstrap.bootstrapError && bootstrap.firebaseEnabled) {
    return <AppBootstrapError message={bootstrap.bootstrapError} onRetry={bootstrap.retryBootstrap} />
  }

  if (profileSetupVisible) {
    return (
      <ProfileSetupScreen
        uid={bootstrap.firebaseUser?.uid ?? getLocalGuestUid()}
        initialProfile={bootstrap.profileSetupInitial}
        onComplete={handleProfileComplete}
      />
    )
  }

  return (
    <PlayerProfileProvider
      firebaseUser={bootstrap.firebaseUser}
      playerProfile={bootstrap.playerProfile}
      setPlayerProfile={bootstrap.setPlayerProfile}
    >
      <div className={`app-root ${visible ? 'app-root--visible' : 'app-root--hidden'}`}>
        {screen === 'title' && <TitleScreen onStart={handleTitleStart} />}

        {screen === 'map' && (
          <WorldMap
            regions={regions}
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
