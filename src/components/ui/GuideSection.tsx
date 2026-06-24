import type { ReactNode } from 'react'

interface GuideSectionProps {
  icon: string
  title: string
  children: ReactNode
}

export function GuideSection({ icon, title, children }: GuideSectionProps) {
  return (
    <section className="guide-section">
      <img className="guide-section__icon" src={icon} alt="" draggable={false} />
      <div className="guide-section__copy">
        <h3 className="guide-section__title">{title}</h3>
        <p className="guide-section__body">{children}</p>
      </div>
    </section>
  )
}
