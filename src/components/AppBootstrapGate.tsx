export function AppBootstrapLoading() {
  return (
    <div className="app-bootstrap-loading" role="status" aria-live="polite">
      <div className="app-bootstrap-loading__card">
        <p className="app-bootstrap-loading__title">모험 준비 중…</p>
        <p className="app-bootstrap-loading__text">잠시만 기다려 주세요.</p>
      </div>
    </div>
  )
}

interface AppBootstrapErrorProps {
  message: string
  onRetry: () => void
}

export function AppBootstrapError({ message, onRetry }: AppBootstrapErrorProps) {
  return (
    <div className="app-bootstrap-loading" role="alert">
      <div className="app-bootstrap-loading__card">
        <p className="app-bootstrap-loading__title">연결에 문제가 있어요</p>
        <p className="app-bootstrap-loading__text">{message}</p>
        <button type="button" className="app-bootstrap-loading__retry" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    </div>
  )
}
