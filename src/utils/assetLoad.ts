import { useState, type SyntheticEvent } from 'react'

export function useAssetLoaded() {
  const [loaded, setLoaded] = useState(false)
  const onLoad = () => setLoaded(true)
  const onError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.hidden = true
    setLoaded(false)
  }
  return { loaded, onLoad, onError }
}

export function hideBrokenAsset(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.hidden = true
}
