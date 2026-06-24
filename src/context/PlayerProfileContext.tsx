import { createContext, useContext, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { PlayerProfile } from '../types/player'

export interface PlayerProfileContextValue {
  firebaseUser: User | null
  playerProfile: PlayerProfile | null
  setPlayerProfile: (profile: PlayerProfile) => void
}

const PlayerProfileContext = createContext<PlayerProfileContextValue | null>(null)

export function PlayerProfileProvider({
  firebaseUser,
  playerProfile,
  setPlayerProfile,
  children,
}: PlayerProfileContextValue & { children: ReactNode }) {
  return (
    <PlayerProfileContext.Provider value={{ firebaseUser, playerProfile, setPlayerProfile }}>
      {children}
    </PlayerProfileContext.Provider>
  )
}

export function usePlayerProfileContext(): PlayerProfileContextValue {
  const value = useContext(PlayerProfileContext)
  if (!value) {
    throw new Error('usePlayerProfileContext must be used within PlayerProfileProvider')
  }
  return value
}

export function useOptionalPlayerProfile(): PlayerProfileContextValue | null {
  return useContext(PlayerProfileContext)
}
