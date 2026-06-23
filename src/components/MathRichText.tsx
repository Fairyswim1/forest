import { useMemo, type ReactNode } from 'react'
import { parseGuideMathText, parseMathSegments, type MathSegment } from '../utils/mathLatex'
import { MathLatex } from './MathLatex'

interface MathRichTextProps {
  text: string
  className?: string
  /** true면 √·π 등을 자동 LaTeX 변환 (안내 문구 기본값) */
  autoMath?: boolean
}

function renderSegments(segments: MathSegment[], mathClassName: string) {
  const nodes: ReactNode[] = []

  segments.forEach((part, index) => {
    if (part.type === 'math') {
      nodes.push(<MathLatex key={`m-${index}`} latex={part.content} className={mathClassName} />)
      return
    }

    part.content.split('\n').forEach((line, lineIndex, lines) => {
      nodes.push(<span key={`t-${index}-${lineIndex}`}>{line}</span>)
      if (lineIndex < lines.length - 1) {
        nodes.push(<br key={`br-${index}-${lineIndex}`} />)
      }
    })
  })

  return nodes
}

export function MathRichText({ text, className = '', autoMath = false }: MathRichTextProps) {
  const segments = useMemo(
    () => (autoMath ? parseGuideMathText(text) : parseMathSegments(text)),
    [text, autoMath],
  )

  return (
    <span className={`math-rich-text ${className}`.trim()}>
      {renderSegments(segments, 'math-latex--inline')}
    </span>
  )
}
