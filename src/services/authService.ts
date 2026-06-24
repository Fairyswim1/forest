import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'

export async function ensureAnonymousUser(): Promise<User> {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase가 설정되지 않았습니다. .env 파일을 확인해 주세요.')
  }

  if (auth.currentUser) {
    return auth.currentUser
  }

  const credential = await signInAnonymously(auth)
  return credential.user
}

export function subscribeAuthUser(onUser: (user: User | null) => void): () => void {
  if (!auth) {
    onUser(null)
    return () => {}
  }

  return onAuthStateChanged(auth, onUser)
}
