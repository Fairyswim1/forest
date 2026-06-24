interface RunBadgeProps {
  src: string
  label: string
  runId?: number
  size?: 'board' | 'row'
  highlighted?: boolean
  interactive?: boolean
  className?: string
  onHover?: (runId: number | null) => void
}

/**
 * 성공 구간 번호 배지 — 보드 시작 타일과 점수판 행에서 동일 PNG를 사용한다.
 */
export function RunBadge({
  src,
  label,
  runId,
  size = 'row',
  highlighted = false,
  interactive = false,
  className = '',
  onHover,
}: RunBadgeProps) {
  return (
    <img
      src={src}
      alt={label}
      data-run-id={runId}
      className={[
        'result-run-badge',
        `result-run-badge--${size}`,
        highlighted ? 'result-run-badge--highlighted' : '',
        interactive ? 'result-run-badge--interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      draggable={false}
      onMouseEnter={interactive && runId !== undefined ? () => onHover?.(runId) : undefined}
      onMouseLeave={interactive && runId !== undefined ? () => onHover?.(null) : undefined}
    />
  )
}
