import type { SyntheticEvent } from 'react'

export function hideBrokenAsset(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.hidden = true
}
