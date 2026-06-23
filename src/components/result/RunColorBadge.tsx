import type { CSSProperties } from 'react'

interface RunColorBadgeProps {
  label: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export function RunColorBadge({ label, color, size = 'md', className = '' }: RunColorBadgeProps) {
  return (
    <span
      className={`run-color-badge run-color-badge--${size} ${className}`.trim()}
      style={{ '--run-badge-color': color } as CSSProperties}
      aria-hidden
    >
      {label}
    </span>
  )
}
