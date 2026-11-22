import { ANIMATION } from '@/constants/animation'
export function focusJourneyNode(id: string) {
  requestAnimationFrame(() => {
    const element = document.getElementById(`node-${id}`)
    element?.focus({ preventScroll: true })
    const reduced =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia(ANIMATION.reducedQuery).matches
    element?.scrollIntoView?.({
      block: 'nearest',
      behavior: reduced ? 'instant' : 'smooth',
    })
  })
}
