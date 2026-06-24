import type { ReactNode } from 'react'

interface GuideSectionProps {
  icon: string
  title: string
  children: ReactNode
  description?: ReactNode
}

export function GuideSection({ icon, title, children, description }: GuideSectionProps) {
  return (
    <section className="guide-section">
      <img
        className="guide-section__icon guide-icon-image"
        src={icon}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div className="guide-section__copy">
        <h3 className="guide-section__title">{title}</h3>
        <div className="guide-section__body">{children}</div>
        {description != null && <div className="guide-section__description">{description}</div>}
      </div>
    </section>
  )
}
