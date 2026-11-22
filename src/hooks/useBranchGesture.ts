import { useEffect, useRef } from 'react'
import {
  GESTURE,
  KEY_DIRECTIONS,
  type BranchDirection,
} from '@/constants/gestures'
import { accumulateGesture, type GestureState } from '@/lib/gesture-engine'
export function useBranchGesture(
  enabled: boolean,
  sceneId: string,
  onDirection: (direction: BranchDirection) => void,
) {
  const intent = useRef<GestureState>({ sum: 0, lastAt: 0 })
  const lastSelected = useRef(-GESTURE.cooldown)
  const lastWheel = useRef(0)
  const needsQuiet = useRef(false)
  const previousScene = useRef(sceneId)
  const touch = useRef<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (previousScene.current !== sceneId) {
      intent.current = { sum: 0, lastAt: 0 }
      needsQuiet.current = true
      previousScene.current = sceneId
    }
    if (!enabled) return
    const ignored = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(GESTURE.ignoreSelector)
    const select = (direction: BranchDirection, deliberate = false) => {
      const now = performance.now()
      if (!deliberate && now - lastSelected.current < GESTURE.cooldown) return
      lastSelected.current = now
      intent.current = { sum: 0, lastAt: now }
      needsQuiet.current = true
      onDirection(direction)
    }
    function wheel(event: WheelEvent) {
      if (ignored(event.target) || event.ctrlKey || event.metaKey) return
      const now = performance.now()
      const quiet = now - lastWheel.current > GESTURE.idleReset
      lastWheel.current = now
      if (needsQuiet.current && !quiet) return
      if (quiet) needsQuiet.current = false
      const scale =
        event.deltaMode === 1
          ? GESTURE.linePixels
          : event.deltaMode === 2
            ? window.innerWidth
            : 1
      const result = accumulateGesture(
        intent.current,
        event.deltaX * scale,
        event.deltaY * scale,
        now,
      )
      intent.current = result.state
      if (
        Math.abs(event.deltaX) >=
          Math.abs(event.deltaY) * GESTURE.diagonalRatio &&
        Math.abs(event.deltaX) > GESTURE.minDelta
      )
        event.preventDefault()
      if (result.direction) select(result.direction)
    }
    function key(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        ignored(event.target)
      )
        return
      const direction = KEY_DIRECTIONS[event.key]
      if (direction) {
        event.preventDefault()
        select(direction, true)
      }
    }
    function start(event: TouchEvent) {
      if (event.touches.length === 1 && !ignored(event.target))
        touch.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        }
    }
    function move(event: TouchEvent) {
      if (!touch.current || event.touches.length !== 1) return
      const x = touch.current.x - event.touches[0].clientX,
        y = touch.current.y - event.touches[0].clientY
      if (Math.abs(x) < Math.abs(y) * GESTURE.diagonalRatio) return
      event.preventDefault()
      if (Math.abs(x) >= GESTURE.threshold) {
        select(x > 0 ? 'right' : 'left')
        touch.current = null
      }
    }
    function end() {
      touch.current = null
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    window.addEventListener('touchstart', start, { passive: true })
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', end)
    return () => {
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
    }
  }, [enabled, sceneId, onDirection])
}
