import { useState } from 'react'
import { getMuted, playSfx, toggleMuted } from '../../audio/audioManager'

interface HudMuteButtonProps {
  className?: string
}

/** 플레이 HUD / 공통 — 소리 켜기·끄기 토글 */
export function HudMuteButton({ className = '' }: HudMuteButtonProps) {
  const [muted, setMutedState] = useState(() => getMuted())

  return (
    <button
      type="button"
      className={`hud-mute-button ${muted ? 'hud-mute-button--muted' : ''} ${className}`.trim()}
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      aria-pressed={muted}
      onClick={() => {
        const next = toggleMuted()
        setMutedState(next)
        if (!next) playSfx('click')
      }}
    >
      <span className="hud-mute-button__label">{muted ? '소리 켜기' : '소리 끄기'}</span>
    </button>
  )
}
