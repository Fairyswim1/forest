import type { CardType, NumberCard } from './card'

/** 점수 계산 방식 — 현재는 비내림차순 구간(nonDecreasingRuns) 하나만 지원 */
export type ScoringMode = 'nonDecreasingRuns'

/** 스테이지/지역 진행 상태 — 월드맵 노드 표시에 사용 */
export type StageProgressStatus = 'open' | 'locked' | 'complete'

/**
 * 결과 화면 피드백 문구 — 수 체계(자연수/정수 …)별로 분리한다.
 * 점수/끊김 분석은 공통이지만, 표현 문구는 이 설정에서 가져온다.
 */
export interface StageFeedback {
  /** 가장 긴 수의 길 칭찬 ({n}칸) */
  praiseLongest: (n: number) => string
  /** 점수 0일 때 안내 */
  zeroScore: string
  /** 끊김 없이 모두 채웠을 때 */
  allFilled: string
  /** 끊김 일반 안내 */
  genericBreak: string
  /** 끊긴 두 수 비교 (left > right) */
  breakComparison: (left: number, right: number) => string
  /** 0 다음 음수로 끊김 (정수 전용) */
  zeroToNegative?: string
  /** 음수 절댓값 비교로 끊김 (정수 전용) */
  negativeAbsValue?: string
  /** 양수 다음 음수로 끊김 (정수 전용) */
  positiveToNegative?: string
}

/** 스테이지 시작 안내 모달에 표시할 학습 정보 */
export interface StageGuide {
  /** 이번 스테이지에서 나오는 수의 범위 라벨 (예: '1부터 30까지의 자연수') */
  numberRangeLabel: string
  /** 범위 부연 설명 (예: '0, 음수, 분수는 나오지 않습니다.') */
  numberRangeDescription: string
  /** 목표 안내 */
  objectiveText: string
  /** 전략 힌트 (선택) */
  strategyHint?: string
}

/** 월드 테마 — 배경/분위기 구분용 (에셋은 추후 확장) */
export type WorldTheme = 'forest' | 'cave' | 'meadow' | 'space'

/** 월드 메타데이터 — 월드맵 확장에 쓰기 위한 등록용 데이터 */
export interface WorldConfig {
  id: string
  title: string
  subtitle: string
  theme: WorldTheme
  mapBackgroundAsset?: string
}

/**
 * 스테이지 설정 — 플레이/결과/HUD/덱 생성/점수가 모두 이 데이터를 참조한다.
 * 하드코딩된 제목·부제·덱 크기·보드 크기·에셋을 이 한 곳으로 모은다.
 */
export interface StageConfig {
  id: string
  worldId: string
  title: string
  subtitle: string
  worldTitle: string

  cardType: CardType
  deckSize: number
  boardSize: number

  /** public/assets/ 기준 파일명 — 플레이 배경 */
  backgroundAsset: string
  /** 오솔길 오버레이 파일명 (현재 보드 레이아웃과 연결, 추후 교체용) */
  trailAsset: string

  scoringMode: ScoringMode

  /** 시작 안내 모달 / 플레이 중 ? 패널에 표시할 학습 정보 */
  guide: StageGuide

  /** 결과 화면 피드백 문구 (수 체계별 분리) */
  feedback: StageFeedback

  /** 이 스테이지의 카드 덱 생성기 */
  cardGenerator: (size?: number) => NumberCard[]
}
