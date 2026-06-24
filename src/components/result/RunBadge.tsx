interface RunBadgeProps {
  /** 구간 번호 배지 PNG 경로 (gold·mint·sky·pink·purple) */
  src: string
  /** 접근성 라벨 (예: "구간 1") */
  label: string
  size?: 'board' | 'row'
  className?: string
}

/**
 * 성공 구간 번호 배지 — 원본 PNG(1254px)를 CSS로 축소해 사용한다.
 * 보드 시작 타일과 점수판 행에서 동일 이미지를 써서 1:1로 대응시킨다.
 */
export function RunBadge({ src, label, size = 'row', className = '' }: RunBadgeProps) {
  return (
    <img
      src={src}
      alt={label}
      className={`result-run-badge result-run-badge--${size} ${className}`.trim()}
      draggable={false}
    />
  )
}
