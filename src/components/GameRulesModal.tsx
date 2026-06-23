import { GAME_TITLE, ASSETS } from '../types/game'

interface GameRulesModalProps {
  onClose: () => void
}

interface RuleItem {
  icon: string
  title: string
  body: string
}

const RULES: RuleItem[] = [
  {
    icon: '🎯',
    title: '목표',
    body: '숫자 카드를 오솔길에 놓아, 작은 수에서 큰 수로 이어지는 길을 최대한 길게 만드세요.',
  },
  {
    icon: '🃏',
    title: '진행 방식',
    body: '라운드마다 카드 한 장이 공개됩니다. 빈 칸을 눌러 카드를 놓고 “배치 완료”를 누르세요. 23칸을 모두 채우면 끝납니다.',
  },
  {
    icon: '⭐',
    title: '점수',
    body: '길을 따라 수가 작은 수→큰 수 순서로 2칸 이상 이어지면 그 구간이 점수가 됩니다. 끊기지 않고 길게 이어질수록 점수가 높아집니다.',
  },
  {
    icon: '↩️',
    title: '되돌리기 · 시간',
    body: '카드를 놓은 뒤 마음에 들지 않으면 “다시 놓기”로 이번 턴을 취소할 수 있어요. 각 턴에는 제한 시간이 있습니다.',
  },
  {
    icon: '🌏',
    title: '월드',
    body: '자연수의 숲 → 정수 동굴 → 분수 초원 → 실수의 별빛 우주로, 점점 더 다양한 수의 크기를 비교하게 됩니다.',
  },
  {
    icon: '💡',
    title: '팁',
    body: '작은 수는 앞쪽, 큰 수는 뒤쪽에 둘 자리를 남겨 두면 더 긴 길을 만들 수 있어요.',
  },
]

export function GameRulesModal({ onClose }: GameRulesModalProps) {
  return (
    <div className="game-rules" role="dialog" aria-modal="true" aria-label="게임 방법">
      <div
        className="game-rules__backdrop"
        style={{ backgroundImage: `url(${ASSETS.worldmapBg})` }}
        aria-hidden
      />
      <button
        type="button"
        className="game-rules__backdrop-close"
        onClick={onClose}
        aria-label="닫기"
      />

      <div className="game-rules__panel wood-panel">
        <div className="game-rules__sheet">
          <header className="game-rules__header">
            <p className="game-rules__eyebrow">게임 방법</p>
            <h2 className="game-rules__title">{GAME_TITLE}</h2>
          </header>

          <ul className="game-rules__list">
            {RULES.map((rule) => (
              <li key={rule.title} className="game-rules__item">
                <span className="game-rules__icon" aria-hidden>
                  {rule.icon}
                </span>
                <span className="game-rules__text">
                  <strong className="game-rules__item-title">{rule.title}</strong>
                  <span className="game-rules__item-body">{rule.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="game-button game-button--confirm game-rules__confirm"
            onClick={onClose}
          >
            알겠어요!
          </button>
        </div>
      </div>
    </div>
  )
}
