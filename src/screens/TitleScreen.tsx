import { useState, type CSSProperties } from 'react'
import { ASSETS, GAME_TITLE } from '../types/game'
import { WORLDS } from '../config/worlds'
import { GameRulesModal } from '../components/GameRulesModal'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'
import { ResultHeaderRibbon } from '../components/result/ResultHeaderRibbon'

interface TitleScreenProps {
  onStart: () => void
}

const TITLE_FEATURES = [
  { icon: ASSETS.guideIconGoal, label: '긴 길 만들기' },
  { icon: ASSETS.guideIconFlow, label: '작은 수에서 큰 수로' },
  { icon: ASSETS.guideIconScore, label: '구간 점수 올리기' },
] as const

function previewNodeAsset(worldId: string): string {
  switch (worldId) {
    case 'integer-cave':
      return ASSETS.caveNodeOpen
    case 'rational-meadow':
      return ASSETS.meadowNodeOpen
    case 'real-starlight-space':
      return ASSETS.starlightNodeOpen
    default:
      return ASSETS.stageNodeOpen
  }
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <div className="title-screen">
      <div
        className="title-screen__bg title-screen__bg--primary"
        style={{ backgroundImage: `url(${ASSETS.titleScreenBg})` }}
        aria-hidden
      />
      <div
        className="title-screen__bg title-screen__bg--accent"
        style={{ backgroundImage: `url(${ASSETS.rationalMeadowWorldmapBg})` }}
        aria-hidden
      />
      <div className="title-screen__vignette" aria-hidden />
      <div className="title-screen__glow" aria-hidden />

      <div className="title-screen__spark title-screen__spark--1" aria-hidden>
        ✦
      </div>
      <div className="title-screen__spark title-screen__spark--2" aria-hidden>
        ✦
      </div>
      <div className="title-screen__spark title-screen__spark--3" aria-hidden>
        ✦
      </div>

      <main className="title-screen__main">
        <div className="title-screen__hero">
          <div className="title-screen__banner-wrap">
            <ResultHeaderRibbon
              title={GAME_TITLE}
              subtitle="작은 수에서 큰 수로, 길게 이어가는 수의 모험"
            />
          </div>

          <p className="title-screen__tagline">
            빈 칸에 숫자를 놓고 오름차순 길을 최대한 길게 만드는 수학 보드 게임
          </p>

          <ul className="title-screen__features" aria-label="게임 핵심 규칙">
            {TITLE_FEATURES.map((feature) => (
              <li key={feature.label} className="title-screen__feature">
                <img className="title-screen__feature-icon" src={feature.icon} alt="" draggable={false} />
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="title-screen__actions">
          <FantasyImageButton variant="confirm" size="lg" onClick={onStart}>
            모험 시작
          </FantasyImageButton>
          <FantasyImageButton variant="undo" size="md" onClick={() => setRulesOpen(true)}>
            게임 방법
          </FantasyImageButton>
        </div>

        <div className="title-screen__worlds" aria-hidden>
          {WORLDS.map((world, index) => (
            <div
              key={world.id}
              className="title-screen__world-chip"
              style={{ '--world-delay': `${index * 0.12}s` } as CSSProperties}
            >
              <img
                className="title-screen__world-chip-asset"
                src={previewNodeAsset(world.id)}
                alt=""
                draggable={false}
              />
              <span className="title-screen__world-chip-label">{world.title}</span>
            </div>
          ))}
        </div>
      </main>

      {rulesOpen && <GameRulesModal onClose={() => setRulesOpen(false)} />}
    </div>
  )
}
