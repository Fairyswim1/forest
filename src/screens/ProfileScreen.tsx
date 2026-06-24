import { ASSETS, GAME_TITLE } from '../types/game'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'

interface ProfileScreenProps {
  onStart: () => void
}

export function ProfileScreen({ onStart }: ProfileScreenProps) {
  return (
    <div className="profile-screen">
      <div
        className="profile-screen__bg"
        style={{ backgroundImage: `url(${ASSETS.worldmapBg})` }}
        aria-hidden
      />
      <div className="profile-screen__dim" aria-hidden />

      <main className="profile-screen__panel" role="main">
        <p className="profile-screen__eyebrow">프로필 설정</p>
        <h1 className="profile-screen__title profile-title">{GAME_TITLE}</h1>
        <p className="profile-screen__description profile-description">
          숫자 카드를 오솔길에 놓아, 작은 수에서 큰 수로 이어지는 길을 만들어 보세요.
        </p>

        <div className="profile-screen__actions">
          <FantasyImageButton variant="confirm" size="lg" onClick={onStart}>
            모험 시작
          </FantasyImageButton>
        </div>
      </main>
    </div>
  )
}
