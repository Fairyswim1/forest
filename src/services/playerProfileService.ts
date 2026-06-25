import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore'
import { getCharacterById, type CharacterId } from '../data/characters'
import { db } from '../lib/firebase'
import type { PlayerProfile } from '../types/player'

const LOCAL_UID_KEY = 'forest:local-guest-uid'
const LOCAL_PROFILE_KEY = 'forest:local-player-profile'

function toDate(value: Timestamp | undefined): Date | undefined {
  return value?.toDate()
}

function mapProfile(uid: string, data: DocumentData): PlayerProfile {
  return {
    uid,
    nickname: String(data.nickname ?? ''),
    characterId: data.characterId as CharacterId,
    characterName: String(data.characterName ?? ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    lastPlayedAt: toDate(data.lastPlayedAt),
  }
}

export function getLocalGuestUid(): string {
  try {
    const existing = localStorage.getItem(LOCAL_UID_KEY)
    if (existing) return existing

    const uid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `local-${crypto.randomUUID()}`
        : `local-${Date.now()}`
    localStorage.setItem(LOCAL_UID_KEY, uid)
    return uid
  } catch {
    return 'local-guest'
  }
}

export function getLocalPlayerProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PlayerProfile
  } catch {
    return null
  }
}

function writeLocalPlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile))
  } catch {
    /* ignore quota / privacy mode */
  }
}

function buildProfile(input: SavePlayerProfileInput, existing?: PlayerProfile | null): PlayerProfile {
  const character = getCharacterById(input.characterId)
  if (!character) {
    throw new Error('선택한 캐릭터를 찾을 수 없습니다.')
  }

  const now = new Date()
  return {
    uid: input.uid,
    nickname: input.nickname,
    characterId: input.characterId,
    characterName: character.name,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastPlayedAt: now,
  }
}

export async function getPlayerProfile(uid: string): Promise<PlayerProfile | null> {
  if (!db) return getLocalPlayerProfile()

  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) return null

  return mapProfile(uid, snapshot.data())
}

export interface SavePlayerProfileInput {
  uid: string
  nickname: string
  characterId: CharacterId
}

export async function savePlayerProfile(input: SavePlayerProfileInput): Promise<PlayerProfile> {
  if (!db) {
    const profile = buildProfile(input, getLocalPlayerProfile())
    writeLocalPlayerProfile(profile)
    return profile
  }

  const character = getCharacterById(input.characterId)
  if (!character) {
    throw new Error('선택한 캐릭터를 찾을 수 없습니다.')
  }

  const ref = doc(db, 'users', input.uid)
  const existing = await getDoc(ref)
  const now = serverTimestamp()

  const payload = {
    uid: input.uid,
    nickname: input.nickname,
    characterId: input.characterId,
    characterName: character.name,
    updatedAt: now,
    lastPlayedAt: now,
    ...(existing.exists() ? {} : { createdAt: now }),
  }

  if (existing.exists()) {
    await updateDoc(ref, payload)
  } else {
    await setDoc(ref, payload)
  }

  const saved = await getDoc(ref)
  return mapProfile(input.uid, saved.data()!)
}

export async function touchLastPlayedAt(uid: string): Promise<void> {
  if (!db) {
    const profile = getLocalPlayerProfile()
    if (!profile || profile.uid !== uid) return
    writeLocalPlayerProfile({ ...profile, lastPlayedAt: new Date(), updatedAt: new Date() })
    return
  }

  const ref = doc(db, 'users', uid)
  const existing = await getDoc(ref)
  if (!existing.exists()) return

  await updateDoc(ref, {
    lastPlayedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
