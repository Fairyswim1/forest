import { PLAY_BOARD_HERO_POSITION } from '../../config/playBoardHero'

interface PlayBoardHeroProps {
  assetUrl: string
  nickname?: string
}

/** 스테이지 플레이 보드 잔디밭 — 선택 모험가를 크게 표시 (타일 위 아님) */
export function PlayBoardHero({ assetUrl, nickname }: PlayBoardHeroProps) {
  return (
    <div
      className="play-board-hero"
      style={{
        left: `${PLAY_BOARD_HERO_POSITION.x}%`,
        top: `${PLAY_BOARD_HERO_POSITION.y}%`,
      }}
      aria-hidden={!nickname}
      aria-label={nickname ? `${nickname} 모험가` : undefined}
    >
      <img className="play-board-hero__sprite" src={assetUrl} alt="" draggable={false} />
      {nickname && <span className="play-board-hero__nickname">{nickname}</span>}
    </div>
  )
}
