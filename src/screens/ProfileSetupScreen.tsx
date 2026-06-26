import { useEffect, useMemo, useState } from 'react'
import { ASSETS } from '../types/game'
import { CHARACTERS, type CharacterId } from '../data/characters'
import { savePlayerProfile } from '../services/playerProfileService'
import type { PlayerProfile } from '../types/player'
import { validateNickname } from '../utils/nickname'
import { FantasyImageButton } from '../components/ui/FantasyImageButton'

const PROFILE_SETUP_LOCK_CLASS = 'profile-setup-active'

interface ProfileSetupScreenProps {
  uid: string
  initialProfile?: PlayerProfile | null
  onComplete: (profile: PlayerProfile) => void
}

export function ProfileSetupScreen({ uid, initialProfile, onComplete }: ProfileSetupScreenProps) {
  const [nicknameInput, setNicknameInput] = useState(initialProfile?.nickname ?? '')
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId | null>(
    initialProfile?.characterId ?? null,
  )
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  const [profileSaveLoading, setProfileSaveLoading] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.add(PROFILE_SETUP_LOCK_CLASS)
    document.body.classList.add(PROFILE_SETUP_LOCK_CLASS)
    return () => {
      document.documentElement.classList.remove(PROFILE_SETUP_LOCK_CLASS)
      document.body.classList.remove(PROFILE_SETUP_LOCK_CLASS)
    }
  }, [])

  const nicknameValidation = useMemo(() => {
    if (!nicknameInput.trim()) return null
    return validateNickname(nicknameInput)
  }, [nicknameInput])

  const canSubmit =
    Boolean(selectedCharacterId) &&
    nicknameValidation?.ok === true &&
    !profileSaveLoading

  async function handleSubmit() {
    const validation = validateNickname(nicknameInput)
    if (!validation.ok) {
      setNicknameError(validation.message)
      return
    }

    if (!selectedCharacterId) {
      setProfileSaveError('함께할 모험가를 골라 주세요.')
      return
    }

    setProfileSaveLoading(true)
    setProfileSaveError(null)
    setNicknameError(null)

    try {
      const profile = await savePlayerProfile({
        uid,
        nickname: validation.value,
        characterId: selectedCharacterId,
      })
      onComplete(profile)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '저장에 실패했어요. 다시 시도해 주세요.'
      setProfileSaveError(message)
    } finally {
      setProfileSaveLoading(false)
    }
  }

  return (
    <div className="profile-setup profile-setup-overlay">
      <div
        className="profile-setup__bg"
        style={{ backgroundImage: `url(${ASSETS.worldmapBg})` }}
        aria-hidden
      />
      <div className="profile-setup__dim" aria-hidden />

      <div className="profile-setup__shell profile-setup-modal">
        <div className="profile-setup__frame" aria-hidden>
          <img className="profile-frame" src={ASSETS.guideModalFrame} alt="" draggable={false} />
        </div>

        <header className="profile-setup__header profile-header-zone">
          <h1 className="profile-setup__title">나만의 모험가 만들기</h1>
          <p className="profile-setup__lead">닉네임과 캐릭터를 골라 모험을 시작하세요!</p>
        </header>

        <div className="profile-setup__body profile-body-zone">
          <div className="profile-setup__field nickname-field">
            <label className="profile-setup__label" htmlFor="profile-nickname">
              닉네임
            </label>
            <input
              id="profile-nickname"
              className="profile-setup__input"
              type="text"
              value={nicknameInput}
              maxLength={10}
              autoComplete="nickname"
              onChange={(event) => {
                setNicknameInput(event.target.value)
                setNicknameError(null)
                setProfileSaveError(null)
              }}
            />
            {(nicknameError || (nicknameValidation && !nicknameValidation.ok)) && (
              <p className="profile-setup__error" role="alert">
                {nicknameError ?? (nicknameValidation && !nicknameValidation.ok ? nicknameValidation.message : '')}
              </p>
            )}
          </div>

          <section
            className="profile-setup__characters character-grid-wrap"
            aria-labelledby="profile-character-title"
          >
            <h2 id="profile-character-title" className="profile-setup__section-title">
              함께할 모험가를 골라주세요
            </h2>
            <div className="profile-setup__character-grid character-grid">
              {CHARACTERS.map((character) => {
                const selected = selectedCharacterId === character.id
                return (
                  <button
                    key={character.id}
                    type="button"
                    className={[
                      'profile-setup__character-card',
                      'character-card',
                      `profile-setup__character-card--${character.accent}`,
                      selected ? 'profile-setup__character-card--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedCharacterId(character.id)
                      setProfileSaveError(null)
                    }}
                  >
                    <span className="profile-setup__character-visual character-image-wrap">
                      <img
                        className="profile-setup__character-image character-image"
                        src={character.assetUrl}
                        alt=""
                        draggable={false}
                      />
                    </span>
                    <span className="profile-setup__character-name">{character.name}</span>
                    <span className="profile-setup__character-desc">{character.description}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <footer className="profile-setup__footer profile-footer-zone">
            {profileSaveError && (
              <p className="profile-setup__error profile-setup__error--save" role="alert">
                {profileSaveError}
              </p>
            )}
            <FantasyImageButton
              variant="confirm"
              size="md"
              disabled={!canSubmit}
              onClick={() => void handleSubmit()}
            >
              {profileSaveLoading ? '저장 중…' : '모험 시작'}
            </FantasyImageButton>
          </footer>
      </div>
    </div>
  )
}
