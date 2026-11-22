import { useSyncExternalStore } from 'react'
import { LAYOUT } from '@/constants/layout'
const query = () =>
  typeof window.matchMedia === 'function'
    ? window.matchMedia(LAYOUT.desktopQuery)
    : undefined
const subscribe = (callback: () => void) => {
  const media = query()
  media?.addEventListener('change', callback)
  return () => media?.removeEventListener('change', callback)
}
export function useWideLayout() {
  return useSyncExternalStore(
    subscribe,
    () => query()?.matches ?? false,
    () => false,
  )
}
