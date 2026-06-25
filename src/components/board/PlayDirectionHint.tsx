interface PlayDirectionHintProps {
  visible: boolean
}

export function PlayDirectionHint({ visible }: PlayDirectionHintProps) {
  if (!visible) return null

  return (
    <div className="play-direction-hint" role="status" aria-live="polite">
      <p className="play-direction-hint__text">
        시작 → 도착 방향으로 숫자가 커지게 놓아보세요!
      </p>
    </div>
  )
}
