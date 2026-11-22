import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { useGraphStore } from '@/store/graph-store'
import { useReducedMotion } from './useReducedMotion'
export function useGraphCamera(
  stage: RefObject<HTMLDivElement | null>,
  progress: RefObject<HTMLDivElement | null>,
  width: number,
  height: number,
) {
  const route = useGraphStore((s) => s.route),
    cursor = useGraphStore((s) => s.cursor),
    revision = useGraphStore((s) => s.revision)
  const reduced = useReducedMotion(),
    camera = useRef({ ...GRAPH_NAV.origin, index: 0 })
  useLayoutEffect(() => {
    if (!stage.current) return
    const element = stage.current,
      target = GRAPH_BY_ID[route[cursor]].position
    function apply() {
      const c = camera.current
      gsap.set(element, {
        x: width / 2 - c.x,
        y: height / 2 - c.y,
        force3D: true,
      })
      element.setAttribute('data-camera-x', String(c.x))
      element.setAttribute('data-camera-y', String(c.y))
      element.style.setProperty('--route-index', String(c.index))
      const ratio = Math.max(
          0,
          Math.min(1, c.index / Math.max(1, route.length - 1)),
        ),
        percent = Math.round(ratio * 100)
      progress.current?.style.setProperty('--route-position', String(ratio))
      progress.current
        ?.querySelector('[role="progressbar"]')
        ?.setAttribute('aria-valuenow', String(percent))
      const label = progress.current?.querySelector('[data-position-label]')
      if (label) label.textContent = `${percent}%`
      const main = element.closest<HTMLElement>('main')
      main?.style.setProperty(
        '--camera-x',
        String((c.x - GRAPH_NAV.origin.x) * GRAPH_NAV.parallax.x),
      )
      main?.style.setProperty(
        '--camera-y',
        String((c.y - GRAPH_NAV.origin.y) * GRAPH_NAV.parallax.y),
      )
    }
    element.setAttribute('data-camera-busy', 'true')
    useGraphStore.getState().beginTransition()
    const tween = gsap.to(camera.current, {
      ...target,
      index: cursor,
      duration: reduced ? 0 : GRAPH_NAV.camera.duration,
      ease: GRAPH_NAV.camera.ease,
      onUpdate: apply,
      onComplete: () => {
        element.setAttribute('data-camera-busy', 'false')
        useGraphStore.getState().arrive()
      },
    })
    apply()
    return () => {
      tween.kill()
    }
  }, [stage, progress, route, cursor, revision, width, height, reduced])
}
