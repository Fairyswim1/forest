import { getAnchorPercent } from '../../utils/pathLayout'
import type { StagePathLayout } from '../../game/pathLayouts/types'
import type { TileId } from '../../types/game'

interface BoardCharacterAvatarProps {
  layout: StagePathLayout
  tileId: TileId
  assetUrl: string
  nickname?: string
}

/** 오솔길 위 플레이어 캐릭터 — 타일 anchor 기준으로 서 있는 스프라이트 */
export function BoardCharacterAvatar({
  layout,
  tileId,
  assetUrl,
  nickname,
}: BoardCharacterAvatarProps) {
  const { x, y } = getAnchorPercent(layout, tileId)

  return (
    <div
      className="board-character"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden={!nickname}
      aria-label={nickname ? `${nickname} 모험가` : undefined}
    >
      <img className="board-character__sprite" src={assetUrl} alt="" draggable={false} />
      {nickname && <span className="board-character__nickname">{nickname}</span>}
    </div>
  )
}
