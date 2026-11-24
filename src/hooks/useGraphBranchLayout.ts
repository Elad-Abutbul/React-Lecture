import { useLayoutEffect, type RefObject } from 'react'
import { measureBranchLayout } from '@/lib/graph-hit-area'

export function useGraphBranchLayout(
  aside: RefObject<HTMLElement | null>,
  regions: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const container = aside.current,
      hits = regions.current,
      reading = document.querySelector<HTMLElement>(
        '.graph-node-active .graph-reading',
      )
    if (!container || !hits || !reading) return
    function measure() {
      measureBranchLayout(container!, hits!, reading!)
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
  }, [aside, regions])
}
