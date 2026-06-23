export type MathSegment = { type: 'text'; content: string } | { type: 'math'; content: string }

/** 카드·타일 displayValue(√3, -√10) → KaTeX용 LaTeX */
export function displayValueToLatex(display: string): string | null {
  const sqrt = display.match(/^(-?)√(.+)$/)
  if (sqrt) {
    const sign = sqrt[1] === '-' ? '-' : ''
    return `${sign}\\sqrt{${sqrt[2]}}`
  }

  if (display === 'π') return '\\pi'

  const fraction = display.match(/^(-?)(\d+)\/(\d+)$/)
  if (fraction) {
    const sign = fraction[1] === '-' ? '-' : ''
    return `${sign}\\frac{${fraction[2]}}{${fraction[3]}}`
  }

  return null
}

/** $...$ 구간을 LaTeX로, 나머지는 일반 텍스트로 분리한다. */
export function parseMathSegments(text: string): MathSegment[] {
  const segments: MathSegment[] = []
  const re = /\$([^$]+)\$/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', content: text.slice(last, match.index) })
    }
    segments.push({ type: 'math', content: match[1]! })
    last = match.index + match[0].length
  }

  if (last < text.length) {
    segments.push({ type: 'text', content: text.slice(last) })
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }]
}

/** 안내 문구용 — √n, π 등을 자동으로 $...$ LaTeX로 감싼 뒤 파싱 */
export function parseGuideMathText(text: string): MathSegment[] {
  const withMath = text
    .replace(/-√(\d+)/g, '-$\\sqrt{$1}$')
    .replace(/√(\d+)/g, '$\\sqrt{$1}$')
    .replace(/√n/g, '$\\sqrt{n}$')
    .replace(/π/g, '$\\pi$')

  return parseMathSegments(withMath)
}
