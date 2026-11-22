import { useSyncExternalStore } from 'react'
import { WORLD } from '@/constants/world'
const media = () =>
  typeof window.matchMedia === 'function'
    ? window.matchMedia(WORLD.finePointer)
    : undefined
const subscribe = (callback: () => void) => {
  const query = media()
  query?.addEventListener('change', callback)
  return () => query?.removeEventListener('change', callback)
}
export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => media()?.matches ?? false,
    () => false,
  )
}
