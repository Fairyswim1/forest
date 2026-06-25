import { GUIDE_ICONS } from '../assets/uiAssets'
import { TURN_SECONDS } from '../types/game'

export interface GuideRuleSection {
  id: string
  icon: string
  title: string
  body: string
}

/** 게임 방법 모달 섹션 — 아이콘 PNG와 본문 매핑 */
export const GUIDE_RULE_SECTIONS: GuideRuleSection[] = [
  {
    id: 'goal',
    icon: GUIDE_ICONS.goal,
    title: '목표 (오름차순 길)',
    body: '오솔길의 시작에서 끝까지, 작은 수에서 큰 수로 이어지는 길을 최대한 길게 만드세요. (같은 수도 이어질 수 있어요 — 비내림차순)',
  },
  {
    id: 'flow',
    icon: GUIDE_ICONS.flow,
    title: '진행 방식',
    body: '카드가 나오면 빈 타일을 선택해 놓습니다. 길을 따라 뒤쪽으로 갈수록 숫자가 작아지지 않도록 배치하세요. 23칸을 모두 채우면 끝납니다.',
  },
  {
    id: 'score',
    icon: GUIDE_ICONS.score,
    title: '점수 (오름차순 구간)',
    body: '인접한 타일이 앞의 수보다 같거나 크면 성공 구간이 됩니다. 2칸 이상 이어져야 점수가 되며, 성공 구간이 길수록 더 높은 점수를 얻습니다.',
  },
  {
    id: 'undo-time',
    icon: GUIDE_ICONS.undoTime,
    title: '되돌리기 · 시간',
    body: `카드를 놓은 뒤 마음에 들지 않으면 “다시 놓기”로 이번 턴을 취소할 수 있어요. 각 턴에는 ${TURN_SECONDS}초의 제한 시간이 있습니다. 시간이 끝나면 도착 쪽 빈 칸부터 거꾸로 찾아, 카드가 자동으로 놓여요.`,
  },
  {
    id: 'world',
    icon: GUIDE_ICONS.world,
    title: '월드',
    body: '자연수의 숲 → 정수의 동굴 → 유리수의 초원 → 실수의 별빛 우주로, 점점 더 다양한 수의 크기를 비교하게 됩니다.',
  },
  {
    id: 'tip',
    icon: GUIDE_ICONS.tip,
    title: '팁',
    body: '작은 수는 앞쪽에, 큰 수는 뒤쪽에 놓을 자리를 남겨 두세요. 숫자가 작아지는 순간 그 구간은 끊깁니다.',
  },
]
