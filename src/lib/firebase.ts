import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

function normalizeProjectId(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed.includes('firebaseio.com')) return trimmed
  const slug = trimmed.replace(/^https?:\/\//, '').split('.')[0]
  return slug.replace(/-default-rtdb$/, '')
}

function readConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: normalizeProjectId(import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  }
}

export function isFirebaseConfigured(): boolean {
  const config = readConfig()
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (isFirebaseConfigured()) {
  app = getApps().length > 0 ? getApp() : initializeApp(readConfig())
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }
