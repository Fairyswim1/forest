import { getPlayBoardHeroPosition } from '../../config/playBoardHero'
import type { WorldTheme } from '../../types/stage'

interface PlayBoardHeroProps {
  assetUrl: string
  nickname?: string
  theme?: WorldTheme
}

/** 스테이지 플레이 보드 잔디밭 — 선택 모험가를 크게 표시 (타일 위 아님) */
export function PlayBoardHero({ assetUrl, nickname, theme = 'forest' }: PlayBoardHeroProps) {
  const position = getPlayBoardHeroPosition(theme)

  return (
    <div
      className="play-board-hero"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      aria-hidden={!nickname}
      aria-label={nickname ? `${nickname} 모험가` : undefined}
    >
      <img className="play-board-hero__sprite" src={assetUrl} alt="" draggable={false} />
      {nickname && <span className="play-board-hero__nickname">{nickname}</span>}
    </div>
  )
}
