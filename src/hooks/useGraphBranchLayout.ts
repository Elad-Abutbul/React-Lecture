import { useLayoutEffect, type RefObject } from 'react'
import { GRAPH_BRANCH_LAYOUT } from '@/constants/graphNavigation'

export function useGraphBranchLayout(
  aside: RefObject<HTMLElement | null>,
  regions: RefObject<HTMLDivElement | null>,
  busy: boolean,
) {
  useLayoutEffect(() => {
    const container = aside.current,
      hits = regions.current,
      reading = document.querySelector<HTMLElement>(
        '.graph-node-active .graph-reading',
      )
    if (!container || !hits || !reading) return
    function measure() {
      const bounds = container!.getBoundingClientRect(),
        content = reading!.getBoundingClientRect()
      hits!.style.setProperty(
        'top',
        `${Math.ceil(Math.max(bounds.height * GRAPH_BRANCH_LAYOUT.topRatio, content.bottom - bounds.top + GRAPH_BRANCH_LAYOUT.readingGap))}px`,
      )
    }
    measure()
    const frame = requestAnimationFrame(measure),
      observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(reading)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [aside, regions, busy])
}
