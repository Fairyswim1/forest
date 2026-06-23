import { describe, expect, it } from 'vitest'
import { displayValueToLatex, parseGuideMathText, parseMathSegments } from './mathLatex'

describe('displayValueToLatex', () => {
  it('converts square roots', () => {
    expect(displayValueToLatex('√3')).toBe('\\sqrt{3}')
    expect(displayValueToLatex('√10')).toBe('\\sqrt{10}')
    expect(displayValueToLatex('-√7')).toBe('-\\sqrt{7}')
  })

  it('converts fractions', () => {
    expect(displayValueToLatex('3/4')).toBe('\\frac{3}{4}')
    expect(displayValueToLatex('-1/2')).toBe('-\\frac{1}{2}')
  })
})

describe('parseMathSegments', () => {
  it('splits $...$ math from plain text', () => {
    expect(parseMathSegments('$0$부터 $\\sqrt{10}$까지')).toEqual([
      { type: 'math', content: '0' },
      { type: 'text', content: '부터 ' },
      { type: 'math', content: '\\sqrt{10}' },
      { type: 'text', content: '까지' },
    ])
  })
})

describe('parseGuideMathText', () => {
  it('auto-wraps sqrt notation', () => {
    expect(parseGuideMathText('√3은 2보다 작아요')).toEqual([
      { type: 'math', content: '\\sqrt{3}' },
      { type: 'text', content: '은 2보다 작아요' },
    ])
  })
})
