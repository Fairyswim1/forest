import { useCallback, useState } from 'react'
import { WorldMap } from './components/WorldMap'
import { PlayScreen } from './screens/PlayScreen'
import { ResultScreen, type ResultPayload } from './screens/ResultScreen'
import { ACTIVE_STAGE } from './data/worlds'
import { buildDemoResultPayload } from './utils/demoResultBoard'
import { getStageBestScore, updateStageBestScore } from './utils/gameRecords'

type Screen = 'map' | 'play' | 'result'

const FADE_MS = 420

export function AppRoot() {
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      if (new URLSearchParams(window.location.search).get('previewResult') === '1') {
        return buildDemoResultPayload()
      }
    }
    return null
  })
  const [screen, setScreen] = useState<Screen>(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      if (new URLSearchParams(window.location.search).get('previewResult') === '1') {
        return 'result'
      }
    }
    return 'map'
  })
  const [visible, setVisible] = useState(true)
  const [playKey, setPlayKey] = useState(0)
  const [forceTutorial, setForceTutorial] = useState(false)
  const [totalStars, setTotalStars] = useState(() => {
    const best = getStageBestScore(ACTIVE_STAGE.id)
    return best !== null ? Math.floor(best / 10) : 0
  })

  const transitionTo = useCallback((next: Screen) => {
    setVisible(false)
    window.setTimeout(() => {
      setScreen(next)
      setVisible(true)
    }, FADE_MS)
  }, [])

  const handleComplete = useCallback(
    (payload: Omit<ResultPayload, 'isNewRecord'>) => {
      const { isNewRecord, bestScore } = updateStageBestScore(ACTIVE_STAGE.id, payload.result.finalScore)
      setResultPayload({ ...payload, isNewRecord })
      setTotalStars(Math.floor(bestScore / 10))
      transitionTo('result')
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
          stage={ACTIVE_STAGE}
          totalStars={totalStars}
          onEnterStage={() => {
            setForceTutorial(false)
            transitionTo('play')
          }}
          onReplayTutorial={handleReplayTutorial}
        />
      )}

      {screen === 'play' && (
        <PlayScreen
          key={playKey}
          stage={ACTIVE_STAGE}
          forceTutorial={forceTutorial}
          onTutorialFinished={() => setForceTutorial(false)}
          onBack={() => transitionTo('map')}
          onComplete={handleComplete}
        />
      )}

      {screen === 'result' && resultPayload && (
        <ResultScreen
          stage={ACTIVE_STAGE}
          payload={resultPayload}
          onRetry={handleRetry}
          onWorldMap={handleWorldMap}
        />
      )}
    </div>
  )
}
