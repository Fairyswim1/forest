import { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { isFirebaseConfigured } from '../lib/firebase'
import { ensureAnonymousUser } from '../services/authService'
import { getPlayerProfile } from '../services/playerProfileService'
import type { PlayerProfile } from '../types/player'

export interface AppBootstrapState {
  authLoading: boolean
  profileLoading: boolean
  firebaseUser: User | null
  playerProfile: PlayerProfile | null
  profileSetupRequired: boolean
  profileSetupInitial: PlayerProfile | null
  bootstrapError: string | null
  firebaseEnabled: boolean
  setPlayerProfile: (profile: PlayerProfile) => void
  completeProfileSetup: (profile: PlayerProfile) => void
  retryBootstrap: () => void
}

export function useAppBootstrap(): AppBootstrapState {
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured())
  const [profileLoading, setProfileLoading] = useState(isFirebaseConfigured())
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [profileSetupRequired, setProfileSetupRequired] = useState(false)
  const [profileSetupInitial, setProfileSetupInitial] = useState<PlayerProfile | null>(null)
  const [bootstrapError, setBootstrapError] = useState<string | null>(null)
  const [bootstrapTick, setBootstrapTick] = useState(0)

  const completeProfileSetup = useCallback((profile: PlayerProfile) => {
    setPlayerProfile(profile)
    setProfileSetupRequired(false)
    setBootstrapError(null)
  }, [])

  const retryBootstrap = useCallback(() => {
    setBootstrapError(null)
    setBootstrapTick((tick) => tick + 1)
  }, [])

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted && isFirebaseConfigured()) {
        setBootstrapTick((tick) => tick + 1)
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthLoading(false)
      setProfileLoading(false)
      setProfileSetupRequired(false)
      return
    }

    let cancelled = false

    async function bootstrap() {
      try {
        setAuthLoading(true)
        setProfileLoading(true)
        setBootstrapError(null)

        const user = await ensureAnonymousUser()
        if (cancelled) return

        setFirebaseUser(user)
        setAuthLoading(false)

        const profile = await getPlayerProfile(user.uid)
        if (cancelled) return

        // 접속할 때마다 캐릭터·닉네임 선택 화면 표시 (기존 프로필은 폼에만 채움)
        setProfileSetupInitial(profile)
        setPlayerProfile(null)
        setProfileSetupRequired(true)
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof Error ? error.message : '연결에 실패했어요. 잠시 후 다시 시도해 주세요.'
        setBootstrapError(message)
        setProfileSetupRequired(false)
      } finally {
        if (!cancelled) {
          setAuthLoading(false)
          setProfileLoading(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [bootstrapTick])

  return {
    authLoading,
    profileLoading,
    firebaseUser,
    playerProfile,
    profileSetupRequired,
    profileSetupInitial,
    bootstrapError,
    firebaseEnabled: isFirebaseConfigured(),
    setPlayerProfile,
    completeProfileSetup,
    retryBootstrap,
  }
}
