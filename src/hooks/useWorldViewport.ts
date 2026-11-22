import { useSyncExternalStore } from 'react'
const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}
const snapshot = () => `${window.innerWidth},${window.innerHeight}`
export function useWorldViewport() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '1280,800')
  const [width, height] = value.split(',').map(Number)
  return { width, height }
}
