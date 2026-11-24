import { courseProgress } from '@/lib/course-progress'
import { useLayoutEffect, useRef, type RefObject } from 'react'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_MOTION as C } from '@/constants/graphMotion'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { criticalSpring } from '@/lib/graph-motion'
import { measureBranchLayout } from '@/lib/graph-hit-area'
import { useGraphStore } from '@/store/graph-store'
import { useReducedMotion } from './useReducedMotion'

export function useGraphCamera(
  stage: RefObject<HTMLDivElement | null>,
  progress: RefObject<HTMLDivElement | null>,
  width: number,
  height: number,
) {
  const reduced = useReducedMotion()
  const state = useGraphStore.getState(),
    initialNode = state.route[state.cursor],
    arrivedNode = useRef(initialNode),
    preparedReader = useRef(initialNode)
  useLayoutEffect(() => {
    if (!stage.current) return
    const element = stage.current
    const motion = useGraphStore.getState().motion
    let frame: number | undefined,
      inFrame = false,
      disposed = false,
      previousTime = performance.now()
    let drawnRoute: readonly string[] | null = null
    const reveals = new Map<string, { value: number; velocity: number }>()
    function wake() {
      if (!disposed && !inFrame && frame === undefined)
        frame = requestAnimationFrame(render)
    }
    function render(now: number) {
      frame = undefined
      inFrame = true
      const moving = motion.tick(now, reduced)
      useGraphStore.getState().synchronize()
      const state = useGraphStore.getState(),
        camera = motion.point,
        dt = Math.min(C.maxFrameMs, Math.max(0, now - previousTime)) / 1000
      previousTime = now
      element.style.transform = `translate3d(${width / 2 - camera.x}px, ${height / 2 - camera.y}px, 0)`
      element.dataset.cameraScene = state.route[state.cursor]
      if (drawnRoute !== state.route) {
        drawnRoute = state.route
        element.dataset.route = JSON.stringify(state.route)
        element.dataset.routeStops = JSON.stringify(motion.path.stops)
      }
      element.dataset.cameraX = String(camera.x)
      element.dataset.cameraY = String(camera.y)
      element.dataset.cameraDistance = String(motion.position)
      element.dataset.cameraTarget = String(motion.target)
      element.dataset.cameraSnap = String(motion.snapping)
      element.dataset.cameraMoving = String(moving)
      element.dataset.cameraBusy = 'false'
      element.style.setProperty('--route-index', String(camera.index))
      let revealing = false
      element
        .querySelectorAll<HTMLElement>('.graph-node-present')
        .forEach((node) => {
          const id = node.dataset.worldNode!,
            point = GRAPH_BY_ID[id].position,
            distance = Math.hypot(point.x - camera.x, point.y - camera.y),
            t = Math.max(
              0,
              Math.min(
                1,
                (C.revealRadius - distance) /
                  (C.revealRadius - C.readableRadius),
              ),
            ),
            target = reduced ? 1 : t * t * (3 - 2 * t),
            before = reveals.get(id) ?? { value: target, velocity: 0 },
            focus = reduced
              ? { value: 1, velocity: 0 }
              : criticalSpring(
                  before.value,
                  before.velocity,
                  target,
                  dt,
                  C.revealFrequency,
                )
          focus.value = Math.max(0, Math.min(1, focus.value))
          if (
            Math.abs(focus.value - target) < C.revealSettleDistance &&
            Math.abs(focus.velocity) < C.revealSettleVelocity
          ) {
            focus.value = target
            focus.velocity = 0
          } else revealing = true
          reveals.set(id, focus)
          node.style.setProperty('--node-focus', String(focus.value))
          node.style.setProperty(
            '--node-opacity',
            String(0.04 + focus.value * 0.96),
          )
          node.style.setProperty(
            '--node-shift',
            `${(1 - focus.value) * C.revealShift}px`,
          )
          node.style.setProperty(
            '--node-scale',
            String(1 - (1 - focus.value) * C.revealScale),
          )
          node.style.setProperty(
            '--node-blur',
            `${(1 - focus.value) * C.revealBlur}px`,
          )
        })
      const activeFocus = reveals.get(state.route[state.cursor])?.value ?? 1
      element.style.setProperty(
        '--path-glow',
        `${C.pathGlowMin + activeFocus * C.pathGlowRange}px`,
      )
      const ratio = courseProgress(
          state.route,
          motion.path.stops,
          motion.position,
          state.cursor,
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
          Math.sin(
            (camera.x - GRAPH_NAV.origin.x) / GRAPH_NAV.parallax.period,
          ) * GRAPH_NAV.parallax.x,
        ),
      )
      main?.style.setProperty(
        '--camera-y',
        String(
          Math.sin(
            (camera.y - GRAPH_NAV.origin.y) / GRAPH_NAV.parallax.period,
          ) * GRAPH_NAV.parallax.y,
        ),
      )
      const distance = Math.abs(
          motion.path.stops[state.cursor] - motion.position,
        ),
        aside = main?.querySelector<HTMLElement>('.graph-branches'),
        reading = element.querySelector<HTMLElement>(
          '.graph-node-active .graph-reading',
        )
      if (aside) {
        aside.style.opacity = String(
          Math.max(0, 1 - distance / C.readableRadius),
        )
        aside.inert = distance > C.decisionRadius
        aside.dataset.branchReady = String(distance <= C.decisionRadius)
        const regions = aside.querySelector<HTMLElement>('.graph-regions')
        if (regions && reading) measureBranchLayout(aside, regions, reading)
      }
      const layoutPending =
        !!element.querySelector('[data-world-node]') &&
        reading?.closest<HTMLElement>('[data-world-node]')?.dataset
          .worldNode !== state.route[state.cursor]
      if (
        reading &&
        !layoutPending &&
        preparedReader.current !== state.route[state.cursor]
      ) {
        // Restoring a decision restores its original heading, not a previous
        // reading offset. Preparation happens once on entry, before arrival.
        if (GRAPH_BY_ID[state.route[state.cursor]].edges.length > 1)
          reading.scrollTop = 0
        preparedReader.current = state.route[state.cursor]
      }
      if (
        reading &&
        !layoutPending &&
        distance <= C.arrivalRadius &&
        Math.abs(motion.velocity) < C.settleVelocity &&
        arrivedNode.current !== state.route[state.cursor]
      ) {
        if (!reading?.contains(document.activeElement))
          reading?.focus({ preventScroll: true })
        arrivedNode.current = state.route[state.cursor]
      }
      inFrame = false
      if (moving || revealing || layoutPending) wake()
    }
    const unsubscribeMotion = motion.subscribe(wake),
      unsubscribeStore = useGraphStore.subscribe((state, before) => {
        if (
          state.route !== before.route ||
          state.cursor !== before.cursor ||
          state.revision !== before.revision
        )
          wake()
      })
    render(performance.now())
    return () => {
      disposed = true
      if (frame !== undefined) cancelAnimationFrame(frame)
      unsubscribeMotion()
      unsubscribeStore()
    }
  }, [stage, progress, width, height, reduced])
}
