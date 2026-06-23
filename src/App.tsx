import { useCallback, useMemo, useState } from 'react'
import { WorldMap } from './components/WorldMap'
import { PlayScreen } from './screens/PlayScreen'
import { ResultScreen, type ResultPayload } from './screens/ResultScreen'
import { NATURAL_1_1 } from './config/stages'
import { getActiveStage, getStageById, getStageByWorldId } from './config/stageRegistry'
import { WORLDS } from './config/worlds'
import { buildDemoResultPayload } from './utils/demoResultBoard'
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
  if (!import.meta.env.DEV || typeof window === 'undefined') return 'map'
  if (new URLSearchParams(window.location.search).get('previewResult') === '1') return 'result'
  return 'map'
}

export function AppRoot() {
  const [selectedStageId, setSelectedStageId] = useState(() => getActiveStage().id)
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
    transitionTo('map')
  }, [transitionTo])

  return (
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
  )
}
