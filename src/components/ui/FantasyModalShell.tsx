import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { ASSETS } from '../../types/game'

interface FantasyModalShellProps {
  ariaLabel: string
  backgroundUrl?: string
  onBackdropClose?: () => void
  header: ReactNode
  footer: ReactNode
  children: ReactNode
  className?: string
}

/** guide-modal-frame.png 위에 헤더·스크롤 본문·푸터를 올리는 공통 모달 껍데기 */
export function FantasyModalShell({
  ariaLabel,
  backgroundUrl = ASSETS.worldmapBg,
  onBackdropClose,
  header,
  footer,
  children,
  className = '',
}: FantasyModalShellProps) {
  const bodyScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bodyScrollRef.current
    if (!el) return
    el.scrollTop = 0
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [])

  return (
    <div
      className={`guide-overlay ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className="guide-overlay__bg"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden
      />
      <div className="guide-overlay__dim" aria-hidden />
      {onBackdropClose && (
        <button
          type="button"
          className="guide-overlay__backdrop-close"
          onClick={onBackdropClose}
          aria-label="닫기"
        />
      )}

      <div className="guide-modal">
        <div className="guide-frame-layer" aria-hidden>
          <img
            className="guide-modal__frame"
            src={ASSETS.guideModalFrame}
            alt=""
            draggable={false}
          />
        </div>

        <header className="guide-header-zone">{header}</header>
        <div className="guide-body-scroll-area" ref={bodyScrollRef}>
          {children}
        </div>
        <footer className="guide-footer-zone">{footer}</footer>
      </div>
    </div>
  )
}
