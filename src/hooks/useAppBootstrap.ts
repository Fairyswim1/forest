import { useCallback, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { isFirebaseConfigured } from '../lib/firebase'
import { ensureAnonymousUser } from '../services/authService'
import {
  getLocalPlayerProfile,
  getPlayerProfile,
} from '../services/playerProfileService'
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
  const firebaseEnabled = isFirebaseConfigured()
  const [authLoading, setAuthLoading] = useState(firebaseEnabled)
  const [profileLoading, setProfileLoading] = useState(true)
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
      if (event.persisted) {
        setBootstrapTick((tick) => tick + 1)
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        setProfileLoading(true)
        setBootstrapError(null)

        if (firebaseEnabled) {
          setAuthLoading(true)
          const user = await ensureAnonymousUser()
          if (cancelled) return

          setFirebaseUser(user)
          setAuthLoading(false)

          const profile = await getPlayerProfile(user.uid)
          if (cancelled) return
          setProfileSetupInitial(profile)
        } else {
          setAuthLoading(false)
          setProfileSetupInitial(getLocalPlayerProfile())
        }

        // 기존 프로필은 캐릭터 선택 폼에만 채움 (표시 순서는 앱에서 제어)
        setPlayerProfile(null)
        setProfileSetupRequired(false)
      } catch (error) {
        if (cancelled) return
        // Firebase 오류 시에도 로컬 프로필로 모험 준비 화면 표시
        setAuthLoading(false)
        setFirebaseUser(null)
        setProfileSetupInitial(getLocalPlayerProfile())
        setPlayerProfile(null)
        setProfileSetupRequired(false)
        setBootstrapError(null)
        console.warn('Firebase bootstrap failed; using local profile.', error)
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
  }, [bootstrapTick, firebaseEnabled])

  return {
    authLoading,
    profileLoading,
    firebaseUser,
    playerProfile,
    profileSetupRequired,
    profileSetupInitial,
    bootstrapError,
    firebaseEnabled,
    setPlayerProfile,
    completeProfileSetup,
    retryBootstrap,
  }
}
