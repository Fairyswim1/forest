import { useMemo } from 'react'
import { parseGuideMathText, parseMathSegments, type MathSegment } from '../utils/mathLatex'
import { MathLatex } from './MathLatex'

interface MathRichTextProps {
  text: string
  className?: string
  /** true면 √·π 등을 자동 LaTeX 변환 (안내 문구 기본값) */
  autoMath?: boolean
}

function renderSegments(segments: MathSegment[], mathClassName: string) {
  return segments.map((part, index) =>
    part.type === 'math' ? (
      <MathLatex key={index} latex={part.content} className={mathClassName} />
    ) : (
      <span key={index}>{part.content}</span>
    ),
  )
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
