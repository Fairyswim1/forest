import { useEffect } from 'react'

/**
 * PC / 모바일 가로 레이아웃 이원화.
 * - PC: html[data-layout="pc"] — index.css 그대로
 * - 모바일 가로: html[data-layout="mobile-landscape"] — mobile-landscape.css만 적용
 * - 모바일 세로: LandscapeRotateHint가 가로 전환 안내
 */
function resolveLayoutMode(): 'pc' | 'mobile-landscape' {
  if (typeof window === 'undefined') return 'pc'

  const landscape = window.matchMedia('(orientation: landscape)').matches
  if (!landscape) return 'pc'

  const short = window.innerHeight <= 520
  const narrowTouch =
    window.innerWidth <= 960 && window.matchMedia('(pointer: coarse)').matches

  return short || narrowTouch ? 'mobile-landscape' : 'pc'
}

export function useLayoutMode(): void {
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.layout = resolveLayoutMode()
    }

    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)

    const landscapeMq = window.matchMedia('(orientation: landscape)')
    landscapeMq.addEventListener('change', apply)

    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      landscapeMq.removeEventListener('change', apply)
      delete document.documentElement.dataset.layout
    }
  }, [])
}
