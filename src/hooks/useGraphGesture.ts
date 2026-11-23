import { useEffect } from 'react'
import { GRAPH_NAV, GRAPH_GESTURE } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { readingOwnsWheel } from '@/lib/graph-hit-area'
import { normalizeWheel } from '@/lib/graph-navigation'
import {
  createGraphGesture,
  graphGestureAxis,
  type GestureDirection,
} from '@/lib/graph-gesture'
import { useGraphStore } from '@/store/graph-store'
export function useGraphGesture() {
  useEffect(() => {
    const controller = createGraphGesture()
    let touch: { x: number; y: number } | null = null
    const ignored = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(GRAPH_NAV.ignore)
    const reader = () =>
      document.querySelector<HTMLElement>('.graph-node-active .graph-reading')
    function navigate(direction: GestureDirection, hovered?: string) {
      const state = useGraphStore.getState(),
        node = GRAPH_BY_ID[state.route[state.cursor]]
      if (state.transitioning) return false
      if (direction === 'left' || direction === 'right') {
        const edges = node.edges.filter((edge) => edge.direction === direction),
          edge = direction === 'right' ? edges.at(-1) : edges[0]
        if (node.edges.length > 1 && edge) state.select(edge.id)
      } else if (direction === 'up') state.step(-1)
      else {
        const edge = node.edges.find((edge) => edge.id === hovered)
        if (
          node.edges.length > 1 &&
          edge &&
          state.route[state.cursor + 1] !== edge.target
        )
          state.select(edge.id)
        else state.step(1)
      }
      const accepted = useGraphStore.getState().revision !== state.revision
      if (accepted) controller.commit(direction)
      return accepted
    }
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || ignored(event.target)) return
      event.preventDefault()
      const state = useGraphStore.getState(),
        node = GRAPH_BY_ID[state.route[state.cursor]],
        reading = reader()
      const region =
        !readingOwnsWheel(reading, event) && event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-edge-id]')
          : null
      const canRead = !!reading && (!region || node.edges.length < 2)
      const { x, y } = normalizeWheel(
        event.deltaX,
        event.deltaY,
        event.deltaMode,
        innerHeight,
      )
      const result = controller.sample({
        x,
        y,
        at: performance.now(),
        stop: node.id,
        transitioning: state.transitioning,
        branching: node.edges.length > 1,
        canReadUp:
          canRead && reading!.scrollTop > GRAPH_GESTURE.readingBoundary,
        canReadDown:
          canRead &&
          reading!.scrollTop + reading!.clientHeight <
            reading!.scrollHeight - GRAPH_GESTURE.readingBoundary,
      })
      if (result.kind === 'read' && reading) reading.scrollTop += result.delta
      else if (result.kind === 'navigate')
        navigate(result.direction, region?.dataset.edgeId)
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
      const horizontal =
        event.key === 'ArrowLeft'
          ? 'left'
          : event.key === 'ArrowRight'
            ? 'right'
            : null
      const vertical = GRAPH_NAV.downKeys.includes(event.key)
        ? 'down'
        : GRAPH_NAV.upKeys.includes(event.key)
          ? 'up'
          : null
      if (!horizontal && !vertical) return
      if (
        vertical &&
        event.target instanceof Element &&
        event.target.closest('button,summary')
      )
        return
      event.preventDefault()
      if (event.repeat || useGraphStore.getState().transitioning) return
      const reading = reader(),
        sign = vertical === 'down' ? 1 : -1
      if (
        vertical &&
        reading &&
        (sign > 0
          ? reading.scrollTop + reading.clientHeight <
            reading.scrollHeight - GRAPH_GESTURE.readingBoundary
          : reading.scrollTop > GRAPH_GESTURE.readingBoundary)
      ) {
        reading.scrollTop +=
          sign * reading.clientHeight * GRAPH_GESTURE.keyboardPage
        return
      }
      navigate((horizontal ?? vertical)!)
    }
    function touchStart(event: TouchEvent) {
      touch =
        event.touches.length === 1 &&
        !ignored(event.target) &&
        !useGraphStore.getState().transitioning
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null
    }
    function touchMove(event: TouchEvent) {
      if (!touch || event.touches.length !== 1 || ignored(event.target)) return
      event.preventDefault()
      if (useGraphStore.getState().transitioning) {
        touch = null
        return
      }
      // Wheel deltas describe camera travel; touch deltas describe content drag.
      const x = touch.x - event.touches[0].clientX,
        y = touch.y - event.touches[0].clientY
      const state = useGraphStore.getState(),
        node = GRAPH_BY_ID[state.route[state.cursor]],
        axis = graphGestureAxis(x, y, node.edges.length > 1)
      const horizontal = axis === 'x',
        vertical = axis === 'y'
      if (
        Math.max(Math.abs(x), Math.abs(y)) < GRAPH_NAV.touchThreshold ||
        (!horizontal && !vertical)
      )
        return
      touch = null
      const reading = reader()
      if (
        vertical &&
        reading &&
        (y > 0
          ? reading.scrollTop + reading.clientHeight <
            reading.scrollHeight - GRAPH_GESTURE.readingBoundary
          : reading.scrollTop > GRAPH_GESTURE.readingBoundary)
      )
        reading.scrollTop += y
      else
        navigate(
          horizontal ? (x > 0 ? 'right' : 'left') : y > 0 ? 'down' : 'up',
        )
    }
    function touchEnd() {
      touch = null
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd)
    window.addEventListener('touchcancel', touchEnd)
    return () => {
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      window.removeEventListener('touchcancel', touchEnd)
    }
  }, [])
}
