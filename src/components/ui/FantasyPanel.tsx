import type { CSSProperties, ReactNode } from 'react'

interface FantasyPanelProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function FantasyPanel({ children, className = '', style }: FantasyPanelProps) {
  return (
    <div className={`fantasy-panel ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
