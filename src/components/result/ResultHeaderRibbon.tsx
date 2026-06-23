interface ResultHeaderRibbonProps {
  title: string
  subtitle: string
  isNewRecord?: boolean
}

export function ResultHeaderRibbon({ title, subtitle, isNewRecord }: ResultHeaderRibbonProps) {
  return (
    <div className="result-header-ribbon">
      {isNewRecord && (
        <span className="result-header-ribbon__record" aria-label="새 기록">
          ✦ 새 기록!
        </span>
      )}
      <div className="result-header-ribbon__frame">
        <span className="result-header-ribbon__spark result-header-ribbon__spark--1" aria-hidden>
          ✦
        </span>
        <span className="result-header-ribbon__spark result-header-ribbon__spark--2" aria-hidden>
          ✦
        </span>
        <h1 className="result-header-ribbon__title">{title}</h1>
        <p className="result-header-ribbon__subtitle">{subtitle}</p>
      </div>
    </div>
  )
}
