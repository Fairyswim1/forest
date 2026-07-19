import { useEffect, useState } from 'react'

function isPortraitMobile(): boolean {
  if (typeof window === 'undefined') return false
  const portrait = window.matchMedia('(orientation: portrait)').matches
  const narrow = window.matchMedia('(max-width: 960px)').matches
  return portrait && narrow
}

/** 세로 모드 모바일에서만 가로 전환 안내 */
export function LandscapeRotateHint() {
  const [show, setShow] = useState(() => isPortraitMobile())

  useEffect(() => {
    const update = () => setShow(isPortraitMobile())
    const portraitMq = window.matchMedia('(orientation: portrait)')
    const narrowMq = window.matchMedia('(max-width: 960px)')
    portraitMq.addEventListener('change', update)
    narrowMq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      portraitMq.removeEventListener('change', update)
      narrowMq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!show) return null

  return (
    <div className="landscape-rotate-hint" role="dialog" aria-modal="true" aria-label="가로 모드 안내">
      <div className="landscape-rotate-hint__card">
        <p className="landscape-rotate-hint__title">가로 모드로 플레이해 주세요</p>
        <p className="landscape-rotate-hint__body">기기를 가로로 돌리면 게임이 시작됩니다.</p>
      </div>
    </div>
  )
}
