export interface SqrtParts {
  sign: string
  radicand: string
}

/** "√10", "-√7" 같은 표기를 루트·피제수로 분리한다. */
export function parseSqrtLabel(label: string): SqrtParts | null {
  const match = label.match(/^(-?)√(.+)$/)
  if (!match) return null
  return { sign: match[1] ?? '', radicand: match[2]! }
}

interface SqrtDisplayProps {
  sign: string
  radicand: string
  className?: string
}

export function SqrtDisplay({ sign, radicand, className = '' }: SqrtDisplayProps) {
  return (
    <span className={`math-sqrt ${className}`.trim()} aria-hidden>
      {sign && <span className="math-sqrt__sign">{sign === '-' ? '−' : sign}</span>}
      <span className="math-sqrt__group">
        <span className="math-sqrt__radical">√</span>
        <span className="math-sqrt__radicand">{radicand}</span>
      </span>
    </span>
  )
}
