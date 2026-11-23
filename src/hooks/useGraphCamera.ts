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
  const previous = useRef({ cursor, revision })
  useLayoutEffect(() => {
    if (!stage.current) return
    const shouldFocus =
      previous.current.cursor !== cursor ||
      previous.current.revision !== revision
    previous.current = { cursor, revision }
    let cancelled = false
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
        String(
          Math.sin((c.x - GRAPH_NAV.origin.x) / GRAPH_NAV.parallax.period) *
            GRAPH_NAV.parallax.x,
        ),
      )
      main?.style.setProperty(
        '--camera-y',
        String(
          Math.sin((c.y - GRAPH_NAV.origin.y) / GRAPH_NAV.parallax.period) *
            GRAPH_NAV.parallax.y,
        ),
      )
    }
    element.setAttribute('data-camera-busy', 'true')
    useGraphStore.getState().beginTransition()
    // Seek a paused GSAP interpolator with wall-clock time. The global GSAP
    // ticker compensates for slow frames, which must not prolong an input lock.
    const duration = reduced ? 0 : GRAPH_NAV.camera.duration * 1000,
      started = performance.now(),
      tween = gsap.to(camera.current, {
        ...target,
        index: cursor,
        duration: GRAPH_NAV.camera.duration,
        ease: GRAPH_NAV.camera.ease,
        paused: true,
        onUpdate: apply,
      })
    let finished = false,
      frame: number | undefined,
      deadline: ReturnType<typeof setTimeout> | undefined
    const current = () => {
      const state = useGraphStore.getState()
      return (
        !cancelled &&
        state.revision === revision &&
        state.route[state.cursor] === route[cursor]
      )
    }
    function finish() {
      if (finished || !current()) return
      finished = true
      if (frame !== undefined) cancelAnimationFrame(frame)
      clearTimeout(deadline)
      tween.kill()
      Object.assign(camera.current, target, { index: cursor })
      apply()
      element.setAttribute('data-camera-busy', 'false')
      useGraphStore.getState().arrive(revision)
      if (shouldFocus)
        element
          .querySelector<HTMLElement>('.graph-node-active .graph-reading')
          ?.focus({ preventScroll: true })
    }
    function tick(now: number) {
      if (finished || !current()) return
      const elapsed = (now - started) / duration
      if (elapsed >= 1) finish()
      else {
        tween.progress(Math.max(0, elapsed))
        frame = requestAnimationFrame(tick)
      }
    }
    apply()
    if (!duration) finish()
    else {
      frame = requestAnimationFrame(tick)
      // The same controller owns this deadline; there is no second tween or
      // navigation source. A throttled frame still ends at the exact target.
      deadline = setTimeout(finish, duration)
    }
    return () => {
      cancelled = true
      if (frame !== undefined) cancelAnimationFrame(frame)
      clearTimeout(deadline)
      tween.kill()
    }
  }, [stage, progress, route, cursor, revision, width, height, reduced])
}
