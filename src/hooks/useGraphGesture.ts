import { useEffect } from 'react'
import {
  GRAPH_NAV,
  GRAPH_GESTURE,
  GRAPH_COPY,
} from '@/constants/graphNavigation'
import { GRAPH_MOTION as C } from '@/constants/graphMotion'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { readingOwnsWheel } from '@/lib/graph-hit-area'
import { normalizeWheel } from '@/lib/graph-navigation'
import {
  createGraphGesture,
  graphGestureAxis,
  type GestureDirection,
  type BranchIntent,
} from '@/lib/graph-gesture'
import { useGraphStore } from '@/store/graph-store'
export function useGraphGesture() {
  useEffect(() => {
    const controller = createGraphGesture()
    let previewTimer: ReturnType<typeof setTimeout> | undefined
    function feedback(intent: BranchIntent | null) {
      clearTimeout(previewTimer)
      const aside = document.querySelector<HTMLElement>('.graph-branches')
      if (!aside) return
      aside
        .querySelectorAll<HTMLElement>('[data-gesture-intent]')
        .forEach((button) => button.removeAttribute('data-gesture-intent'))
      const status = aside.querySelector('.graph-intent-status')
      if (!intent) {
        if (status) status.textContent = ''
        return
      }
      const group = Array.from(
          aside.querySelectorAll<HTMLElement>(
            `[data-direction="${intent.direction}"]`,
          ),
        ),
        button = intent.direction === 'right' ? group.at(-1) : group[0]
      if (!button) return
      const text =
        intent.direction === 'right'
          ? GRAPH_COPY.intentRight
          : GRAPH_COPY.intentLeft
      button.setAttribute('data-gesture-intent', 'true')
      button.style.setProperty('--gesture-progress', String(intent.progress))
      const label = button.querySelector('.graph-intent-feedback')
      if (label)
        label.textContent = `${text} · ${Math.round(intent.progress * 100)}%`
      if (status && status.textContent !== text) status.textContent = text
      previewTimer = setTimeout(
        () => feedback(null),
        GRAPH_GESTURE.intentQuietMs,
      )
    }
    let touch: { x: number; y: number } | null = null
    const ignored = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(GRAPH_NAV.ignore)
    const reader = () =>
      document.querySelector<HTMLElement>('.graph-node-active .graph-reading')
    function choose(direction: GestureDirection, hovered?: string) {
      const state = useGraphStore.getState(),
        node = GRAPH_BY_ID[state.route[state.cursor]]
      const edges = node.edges.filter((edge) => edge.direction === direction)
      const edge =
        direction === 'down'
          ? node.edges.find((edge) => edge.id === hovered)
          : direction === 'right'
            ? edges.at(-1)
            : edges[0]
      if (!edge) return false
      state.select(edge.id)
      return useGraphStore.getState().route[state.cursor + 1] === edge.target
    }
    function input(x: number, y: number, event?: WheelEvent, discrete = false) {
      if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        Math.max(Math.abs(x), Math.abs(y)) < GRAPH_GESTURE.epsilon
      )
        return
      const state = useGraphStore.getState(),
        motion = state.motion,
        node = GRAPH_BY_ID[state.route[state.cursor]],
        reading = reader(),
        distance = Math.abs(motion.position - motion.path.stops[state.cursor]),
        atDecision = node.edges.length > 1 && distance <= C.decisionRadius,
        nearReader = distance <= C.readingRadius
      const region =
        event &&
        !readingOwnsWheel(reading, event) &&
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-edge-id]')
          : null
      const canRead =
        nearReader && !!reading && (!region || node.edges.length < 2)
      const canReadUp =
          canRead && reading!.scrollTop > GRAPH_GESTURE.readingBoundary,
        canReadDown =
          canRead &&
          reading!.scrollTop + reading!.clientHeight <
            reading!.scrollHeight - GRAPH_GESTURE.readingBoundary,
        axis = graphGestureAxis(x, y, atDecision)
      const result = controller.sample({
        x,
        y,
        at: performance.now(),
        stop: node.id,
        // Consume branch intent during travel; motion.scroll below remains live.
        transitioning: !nearReader,
        branching: atDecision,
        canReadUp,
        canReadDown,
      })
      if (result.kind === 'read' && reading) {
        reading.scrollTop += result.delta
        feedback(null)
        return
      }
      if (axis === 'y' && (y > 0 ? canReadDown : canReadUp)) return
      const selected = state.pendingChoices.includes(node.id)
        ? undefined
        : node.edges.find(
            (edge) => edge.target === state.route[state.cursor + 1],
          )
      const direction: GestureDirection | null =
        axis === 'x'
          ? x > 0
            ? 'right'
            : 'left'
          : axis === 'y'
            ? y > 0
              ? 'down'
              : 'up'
            : null
      const requested =
        direction === 'down'
          ? node.edges.find((edge) => edge.id === region?.dataset.edgeId)
          : node.edges
              .filter((edge) => edge.direction === direction)
              .at(direction === 'right' ? -1 : 0)
      if (
        atDecision &&
        direction !== 'up' &&
        (!selected || (requested && requested !== selected))
      ) {
        const intent = discrete
          ? direction
          : result.kind === 'navigate'
            ? result.direction
            : null
        if (intent && choose(intent, region?.dataset.edgeId)) {
          if (!discrete) controller.commit(intent)
          feedback(null)
        } else feedback(controller.preview())
        return
      }
      feedback(null)
      if (!axis) return
      // Vertical input always follows route order. Horizontal input follows the
      // selected diagonal's physical direction, and can reverse before arrival.
      const segment = Math.min(
          motion.path.stops.length - 2,
          Math.max(0, Math.floor(motion.point.index)),
        ),
        source = GRAPH_BY_ID[state.route[segment]],
        target = GRAPH_BY_ID[state.route[segment + 1]],
        sign =
          source && target
            ? Math.sign(target.position.x - source.position.x) || 1
            : 1
      const pixels =
        axis === 'y'
          ? y
          : Math.abs(y) >= Math.abs(x) * GRAPH_GESTURE.branchRatio
            ? Math.sign(y) * Math.hypot(x, y)
            : x * sign
      const forwardLimit = Math.min(
        motion.path.length,
        ...state.route.flatMap((id, index) =>
          state.pendingChoices.includes(id) &&
          motion.path.stops[index] >= motion.position - C.decisionRadius
            ? [motion.path.stops[index]]
            : [],
        ),
      )
      motion.scroll(pixels, performance.now(), forwardLimit)
    }
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || ignored(event.target)) return
      event.preventDefault()
      const { x, y } = normalizeWheel(
        event.deltaX,
        event.deltaY,
        event.deltaMode,
        innerHeight,
      )
      input(x, y, event)
    }
    function key(event: KeyboardEvent) {
      if (
        event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        ignored(event.target)
      )
        return
      const x =
          event.key === 'ArrowLeft'
            ? -C.keyboardPixels
            : event.key === 'ArrowRight'
              ? C.keyboardPixels
              : 0,
        y = GRAPH_NAV.downKeys.includes(event.key)
          ? C.keyboardPixels
          : GRAPH_NAV.upKeys.includes(event.key)
            ? -C.keyboardPixels
            : 0
      if (!x && !y) return
      if (
        y &&
        event.key === ' ' &&
        event.target instanceof Element &&
        event.target.closest('button,summary')
      )
        return
      event.preventDefault()
      input(x, y, undefined, !event.repeat)
    }
    function touchStart(event: TouchEvent) {
      touch =
        event.touches.length === 1 && !ignored(event.target)
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null
    }
    function touchMove(event: TouchEvent) {
      if (!touch || event.touches.length !== 1 || ignored(event.target)) return
      event.preventDefault()
      const next = { x: event.touches[0].clientX, y: event.touches[0].clientY },
        x = touch.x - next.x,
        y = touch.y - next.y
      touch = next
      input(x, y)
    }
    function touchEnd() {
      feedback(null)
      touch = null
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd)
    window.addEventListener('touchcancel', touchEnd)
    return () => {
      feedback(null)
      clearTimeout(previewTimer)
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      window.removeEventListener('touchcancel', touchEnd)
    }
  }, [])
}
