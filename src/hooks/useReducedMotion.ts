import { useSyncExternalStore } from 'react'
import { ANIMATION } from '@/constants/animation'
const media = () =>
  typeof window.matchMedia === 'function'
    ? window.matchMedia(ANIMATION.reducedQuery)
    : undefined
const subscribe = (callback: () => void) => {
  const query = media()
  query?.addEventListener('change', callback)
  return () => query?.removeEventListener('change', callback)
}
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => media()?.matches ?? true,
    () => true,
  )
}
