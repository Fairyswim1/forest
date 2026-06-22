import { TOTAL_ROUNDS } from '../types/game'

export function createDeck(): number[] {
  const deck: number[] = []
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    deck.push(Math.floor(Math.random() * 41) - 20)
  }
  return deck
}

export function getNumberTone(value: number): 'negative' | 'zero' | 'positive' {
  if (value < 0) return 'negative'
  if (value === 0) return 'zero'
  return 'positive'
}

export function formatTimer(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
