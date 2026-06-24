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

export async function getPlayerProfile(uid: string): Promise<PlayerProfile | null> {
  if (!db) return null

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
    throw new Error('Firestore를 사용할 수 없습니다.')
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
  if (!db) return

  const ref = doc(db, 'users', uid)
  const existing = await getDoc(ref)
  if (!existing.exists()) return

  await updateDoc(ref, {
    lastPlayedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
