import { ASSETS } from '../../types/game'

interface ResultHeaderRibbonProps {
  title: string
  subtitle: string
  isNewRecord?: boolean
}

/**
 * 상단 완료 배너 — result-completion-banner-frame.png(텍스트 없는 장식 프레임)
 * 위에 제목/부제를 HTML로 올린다. 제목은 큰 중앙 영역, 부제는 하단 작은 영역.
 */
export function ResultHeaderRibbon({ title, subtitle, isNewRecord }: ResultHeaderRibbonProps) {
  return (
    <div className="result-banner">
      <img className="result-banner__frame" src={ASSETS.resultBannerFrame} alt="" draggable={false} />

      {isNewRecord && (
        <span className="result-banner__record" aria-label="새 기록">
          ✦ 새 기록!
        </span>
      )}

      <div className="result-banner__content">
        <h1 className="result-banner__title">{title}</h1>
      </div>
      <div className="result-banner__subarea">
        <p className="result-banner__subtitle">{subtitle}</p>
      </div>
    </div>
  )
}
