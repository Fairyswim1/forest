import katex from 'katex'
import { useMemo } from 'react'

interface MathLatexProps {
  latex: string
  className?: string
  ariaLabel?: string
}

export function MathLatex({ latex, className = '', ariaLabel }: MathLatexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false,
        output: 'html',
      })
    } catch {
      return latex
    }
  }, [latex])

  return (
    <span
      className={`math-latex ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={ariaLabel}
    />
  )
}
