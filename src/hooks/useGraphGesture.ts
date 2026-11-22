import { useEffect, useRef } from 'react'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { normalizeWheel } from '@/lib/graph-navigation'
import { useGraphStore } from '@/store/graph-store'
export function useGraphGesture() {
  const memory = useRef({
    sum: 0,
    last: -GRAPH_NAV.quietMs,
    locked: false,
    reading: false,
    touch: null as { x: number; y: number } | null,
  })
  useEffect(() => {
    const m = memory.current
    const ignored = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(GRAPH_NAV.ignore)
    const direction = (x: number) => {
      const s = useGraphStore.getState(),
        node = GRAPH_BY_ID[s.route[s.cursor]],
        group = node.edges.filter(
          (e) => e.direction === (x > 0 ? 'right' : 'left'),
        )
      return x > 0 ? group.at(-1) : group[0]
    }
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || ignored(event.target)) return
      event.preventDefault()
      const now = performance.now(),
        fresh = now - m.last > GRAPH_NAV.quietMs
      m.last = now
      const state = useGraphStore.getState(),
        node = GRAPH_BY_ID[state.route[state.cursor]]
      if (state.transitioning) {
        m.locked = true
        m.sum = 0
        return
      }
      if (m.locked && !fresh) {
        if (m.reading) {
          const reader = document.querySelector<HTMLElement>(
            '.graph-node-active .graph-reading',
          )
          const { y } = normalizeWheel(
            event.deltaX,
            event.deltaY,
            event.deltaMode,
            innerHeight,
          )
          if (reader) reader.scrollTop += y
        }
        return
      }
      if (fresh) {
        m.locked = false
        m.reading = false
        m.sum = 0
      }
      const { x, y } = normalizeWheel(
        event.deltaX,
        event.deltaY,
        event.deltaMode,
        innerHeight,
      )
      const horizontal =
        Math.abs(x) >= Math.abs(y) * GRAPH_NAV.diagonalRatio &&
        Math.abs(x) > GRAPH_NAV.minDelta
      const region =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-edge-id]')
          : null
      // A long node owns one reading surface. Reading consumes the gesture before navigation.
      const reader = document.querySelector<HTMLElement>(
        '.graph-node-active .graph-reading',
      )
      if (
        !horizontal &&
        (!region || node.edges.length < 2) &&
        reader &&
        reader.scrollHeight > reader.clientHeight + 1
      ) {
        const canRead =
          y > 0
            ? reader.scrollTop + reader.clientHeight < reader.scrollHeight - 1
            : reader.scrollTop > 1
        if (canRead) {
          reader.scrollTop += y
          m.reading = true
          m.locked = true
          m.sum = 0
          return
        }
      }
      const hovered = region
        ? node.edges.find((e) => e.id === region.dataset.edgeId)
        : undefined
      const edge =
        horizontal && node.edges.length > 1
          ? direction(x)
          : y > 0 &&
              node.edges.length > 1 &&
              state.route[state.cursor + 1] !== hovered?.target
            ? hovered
            : undefined
      const delta = horizontal ? x : y
      if (Math.abs(delta) < GRAPH_NAV.minDelta) return
      m.sum = (Math.sign(delta) === Math.sign(m.sum) ? m.sum : 0) + delta
      if (Math.abs(m.sum) < GRAPH_NAV.intentThreshold) return
      if (edge) {
        state.select(edge.id)
        m.locked = true
        m.sum = 0
      } else if (!horizontal && (y < 0 || state.route[state.cursor + 1])) {
        state.step(y > 0 ? 1 : -1)
        m.locked = true
        m.sum = 0
      }
    }
    function key(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        ignored(event.target)
      )
        return
      const s = useGraphStore.getState()
      if (s.transitioning) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const edge = direction(event.key === 'ArrowRight' ? 1 : -1)
        if (edge) {
          event.preventDefault()
          s.select(edge.id)
        }
      } else if (
        GRAPH_NAV.downKeys.includes(event.key) ||
        GRAPH_NAV.upKeys.includes(event.key)
      ) {
        if (
          event.target instanceof Element &&
          event.target.closest('button,summary')
        )
          return
        const sign = GRAPH_NAV.downKeys.includes(event.key) ? 1 : -1,
          reader = document.querySelector<HTMLElement>(
            '.graph-node-active .graph-reading',
          )
        event.preventDefault()
        if (
          reader &&
          (sign > 0
            ? reader.scrollTop + reader.clientHeight < reader.scrollHeight - 1
            : reader.scrollTop > 1)
        ) {
          reader.scrollTop += sign * reader.clientHeight * 0.7
          return
        }
        s.step(sign)
      }
    }
    function touchStart(event: TouchEvent) {
      if (event.touches.length === 1 && !ignored(event.target))
        m.touch = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
    function touchMove(event: TouchEvent) {
      if (!m.touch || event.touches.length !== 1 || ignored(event.target))
        return
      event.preventDefault()
      const x = m.touch.x - event.touches[0].clientX,
        y = m.touch.y - event.touches[0].clientY
      if (Math.hypot(x, y) < GRAPH_NAV.touchThreshold) return
      const s = useGraphStore.getState()
      if (s.transitioning) {
        m.touch = null
        return
      }
      if (Math.abs(x) >= Math.abs(y) * GRAPH_NAV.diagonalRatio) {
        const edge = direction(x)
        if (edge) s.select(edge.id)
      } else {
        const reader = document.querySelector<HTMLElement>(
          '.graph-node-active .graph-reading',
        )
        if (
          reader &&
          (y > 0
            ? reader.scrollTop + reader.clientHeight < reader.scrollHeight - 1
            : reader.scrollTop > 1)
        )
          reader.scrollTop += y
        else s.step(y > 0 ? 1 : -1)
      }
      m.touch = null
    }
    function touchEnd() {
      m.touch = null
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd)
    return () => {
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
    }
  }, [])
}
