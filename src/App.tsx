import { useCallback, useState } from 'react'
import { WorldMap } from './components/WorldMap'
import { PlayScreen } from './screens/PlayScreen'
import { ResultScreen, type ResultPayload } from './screens/ResultScreen'
import { STAGE_1_1 } from './types/game'
import { getStageBestScore, updateStageBestScore } from './utils/gameRecords'

type Screen = 'map' | 'play' | 'result'

const FADE_MS = 420

export function AppRoot() {
  const [screen, setScreen] = useState<Screen>('map')
  const [visible, setVisible] = useState(true)
  const [playKey, setPlayKey] = useState(0)
  const [forceTutorial, setForceTutorial] = useState(false)
  const [resultPayload, setResultPayload] = useState<ResultPayload | null>(null)
  const [totalStars, setTotalStars] = useState(() => {
    const best = getStageBestScore(STAGE_1_1.id)
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
      const { isNewRecord, bestScore } = updateStageBestScore(STAGE_1_1.id, payload.result.finalScore)
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
          forceTutorial={forceTutorial}
          onTutorialFinished={() => setForceTutorial(false)}
          onBack={() => transitionTo('map')}
          onComplete={handleComplete}
        />
      )}

      {screen === 'result' && resultPayload && (
        <ResultScreen payload={resultPayload} onRetry={handleRetry} onWorldMap={handleWorldMap} />
      )}
    </div>
  )
}
