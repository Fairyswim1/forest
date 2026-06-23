import { describe, expect, it } from 'vitest'
import {
  BASIC_SQRT_FIXED_DECK,
  generateBasicSqrtDeck,
  generateIntegerDeck,
  generateNaturalDeck,
  INTEGER_FIXED_DECK,
  NATURAL_FIXED_DECK,
} from './generators'
import { BASIC_SQRT_VALUES } from './realValues'

const KNOWN_SQRT_VALUES = new Set(BASIC_SQRT_VALUES.map((d) => d.value.toFixed(5)))

describe('generateBasicSqrtDeck', () => {
  it('generates 23 real cards using only integers and known square roots', () => {
    for (let trial = 0; trial < 40; trial++) {
      const deck = generateBasicSqrtDeck()
      expect(deck).toHaveLength(23)

      for (const card of deck) {
        expect(card.type).toBe('real')
        // 분수/소수 표기가 없어야 한다
        expect(card.displayValue).not.toMatch(/[./]/)
        // numericValue는 풀의 알려진 값(정수 또는 √n)이어야 한다
        expect(KNOWN_SQRT_VALUES.has(card.numericValue.toFixed(5))).toBe(true)
      }
    }
  })

  it('always includes 0, an integer, and a square root', () => {
    for (let trial = 0; trial < 40; trial++) {
      const deck = generateBasicSqrtDeck()
      expect(deck.some((c) => c.numericValue === 0)).toBe(true)
      expect(deck.some((c) => c.displayValue === '2' || c.displayValue === '3')).toBe(true)
      expect(deck.some((c) => c.displayValue.startsWith('√'))).toBe(true)
    }
  })

  it('fixed dev deck contains the full comparison chain', () => {
    expect(BASIC_SQRT_FIXED_DECK).toHaveLength(23)
    for (const token of ['0', '1', '√2', '√3', '2', '√5', '√6', '√7', '3', '√10']) {
      expect(BASIC_SQRT_FIXED_DECK).toContain(token)
    }
  })

  it('orders by numericValue as 0 < 1 < √2 < √3 < 2 < √5 < √6 < √7 < 3 < √10', () => {
    const sorted = [...BASIC_SQRT_VALUES].sort((a, b) => a.value - b.value)
    expect(sorted.map((d) => d.display)).toEqual([
      '0', '1', '√2', '√3', '2', '√5', '√6', '√7', '3', '√10',
    ])

    const by = (label: string) => BASIC_SQRT_VALUES.find((d) => d.display === label)!.value
    expect(by('1') < by('√2')).toBe(true)
    expect(by('√2') < by('√3')).toBe(true)
    expect(by('√3') < by('2')).toBe(true)
    expect(by('2') < by('√5')).toBe(true)
    expect(by('√5') < by('3')).toBe(true)
    expect(by('√7') < by('3')).toBe(true)
  })
})

describe('generateIntegerDeck', () => {
  it('generates exactly 23 integer cards within -20..20', () => {
    for (let trial = 0; trial < 50; trial++) {
      const deck = generateIntegerDeck()
      expect(deck).toHaveLength(23)

      for (const card of deck) {
        expect(card.type).toBe('integer')
        expect(Number.isInteger(card.numericValue)).toBe(true)
        expect(card.numericValue).toBeGreaterThanOrEqual(-20)
        expect(card.numericValue).toBeLessThanOrEqual(20)
        expect(card.displayValue).toBe(String(card.numericValue))
      }
    }
  })

  it('always includes at least one zero, plus negatives and positives', () => {
    for (let trial = 0; trial < 50; trial++) {
      const values = generateIntegerDeck().map((c) => c.numericValue)
      expect(values.filter((v) => v === 0).length).toBeGreaterThanOrEqual(1)
      expect(values.some((v) => v < 0)).toBe(true)
      expect(values.some((v) => v > 0)).toBe(true)
    }
  })

  it('keeps negative/positive counts balanced (not one-sided)', () => {
    for (let trial = 0; trial < 50; trial++) {
      const values = generateIntegerDeck().map((c) => c.numericValue)
      const neg = values.filter((v) => v < 0).length
      const pos = values.filter((v) => v > 0).length
      // 균형: 음수와 양수 개수 차이가 작아야 한다
      expect(Math.abs(neg - pos)).toBeLessThanOrEqual(2)
    }
  })

  it('fixed dev deck has 23 entries within -20..20 incl. a zero and both signs', () => {
    expect(INTEGER_FIXED_DECK).toHaveLength(23)
    expect(INTEGER_FIXED_DECK.some((v) => v === 0)).toBe(true)
    expect(INTEGER_FIXED_DECK.some((v) => v < 0)).toBe(true)
    expect(INTEGER_FIXED_DECK.some((v) => v > 0)).toBe(true)
    for (const value of INTEGER_FIXED_DECK) {
      expect(value).toBeGreaterThanOrEqual(-20)
      expect(value).toBeLessThanOrEqual(20)
    }
  })
})

describe('generateNaturalDeck', () => {
  it('generates exactly 23 natural cards within 1..30', () => {
    for (let trial = 0; trial < 50; trial++) {
      const deck = generateNaturalDeck()
      expect(deck).toHaveLength(23)

      for (const card of deck) {
        expect(card.type).toBe('natural')
        expect(Number.isInteger(card.numericValue)).toBe(true)
        expect(card.numericValue).toBeGreaterThanOrEqual(1)
        expect(card.numericValue).toBeLessThanOrEqual(30)
        // displayValue와 numericValue는 동일한 자연수 값
        expect(card.displayValue).toBe(String(card.numericValue))
      }
    }
  })

  it('never includes zero, negatives, or non-integers', () => {
    const deck = generateNaturalDeck()
    for (const card of deck) {
      expect(card.numericValue).not.toBe(0)
      expect(card.numericValue).toBeGreaterThan(0)
      expect(card.numericValue % 1).toBe(0)
    }
  })

  it('fixed dev deck has 23 entries, all within 1..30', () => {
    expect(NATURAL_FIXED_DECK).toHaveLength(23)
    for (const value of NATURAL_FIXED_DECK) {
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(30)
    }
  })
})

describe('integer vs natural decks', () => {
  it('use different card types and value ranges', () => {
    const natural = generateNaturalDeck()
    const integer = generateIntegerDeck()

    expect(natural.every((c) => c.type === 'natural')).toBe(true)
    expect(natural.every((c) => c.numericValue >= 1)).toBe(true)

    expect(integer.every((c) => c.type === 'integer')).toBe(true)
    expect(integer.every((c) => c.numericValue >= -20 && c.numericValue <= 20)).toBe(true)
  })
})
