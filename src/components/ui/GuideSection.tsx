import type { ReactNode } from 'react'

interface GuideSectionProps {
  icon: string
  title: string
  children: ReactNode
}

export function GuideSection({ icon, title, children }: GuideSectionProps) {
  return (
    <section className="guide-section">
      <div className="guide-section__heading">
        <img className="guide-section__icon" src={icon} alt="" draggable={false} />
        <h3 className="guide-section__title">{title}</h3>
      </div>
      <div className="guide-section__body">{children}</div>
    </section>
  )
}
