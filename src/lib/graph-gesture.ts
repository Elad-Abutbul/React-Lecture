import { GRAPH_GESTURE } from '@/constants/graphNavigation'
export type GestureDirection = 'left' | 'right' | 'up' | 'down'
type Axis = 'x' | 'y'
type Mode = 'intent' | 'reading' | 'navigation'
export type WheelSample = {
  x: number
  y: number
  at: number
  stop: string
  transitioning: boolean
  canReadUp: boolean
  canReadDown: boolean
}
export type GestureResult =
  | { kind: 'none' }
  | { kind: 'read'; delta: number }
  | { kind: 'navigate'; direction: GestureDirection }
const none: GestureResult = { kind: 'none' }
const axisOf = (x: number, y: number): Axis | null =>
  Math.abs(x) > Math.abs(y) * GRAPH_GESTURE.axisRatio
    ? 'x'
    : Math.abs(y) > Math.abs(x) * GRAPH_GESTURE.axisRatio
      ? 'y'
      : null
const directionOf = (axis: Axis, value: number): GestureDirection =>
  axis === 'x' ? (value > 0 ? 'right' : 'left') : value > 0 ? 'down' : 'up'
export function createGraphGesture() {
  let last = -Infinity,
    owner = '',
    axis: Axis | null = null,
    x = 0,
    y = 0,
    sign = 0,
    mode: Mode = 'intent',
    reverse = 0,
    cross = 0
  function reset(stop: string) {
    owner = stop
    axis = null
    x = 0
    y = 0
    sign = 0
    mode = 'intent'
    reverse = 0
    cross = 0
  }
  return {
    sample(input: WheelSample): GestureResult {
      if (
        !Number.isFinite(input.x) ||
        !Number.isFinite(input.y) ||
        Math.max(Math.abs(input.x), Math.abs(input.y)) < GRAPH_GESTURE.epsilon
      )
        return none
      const fresh = input.at - last > GRAPH_GESTURE.quietMs
      last = input.at
      if (fresh) reset(input.stop)
      else if (owner !== input.stop) {
        owner = input.stop
        mode = 'navigation'
        x = 0
        y = 0
        reverse = 0
      }
      const dominant = axisOf(input.x, input.y)
      if (input.transitioning) {
        mode = 'navigation'
        axis = axis ?? dominant
        if (axis && !sign) sign = Math.sign(axis === 'x' ? input.x : input.y)
        x = 0
        y = 0
        reverse = 0
        return none
      }
      if (mode === 'navigation') {
        // Same-direction momentum cannot navigate again. An intentional reversal must
        // cross a full threshold after arrival; tiny elastic/bounce deltas do not.
        const value = axis === 'x' ? input.x : input.y
        if (axis && dominant === axis && Math.sign(value) === -sign) {
          reverse += Math.abs(value)
          if (reverse >= GRAPH_GESTURE.threshold) {
            mode = 'intent'
            sign = -sign
            x = axis === 'x' ? sign * reverse : 0
            y = axis === 'y' ? sign * reverse : 0
            reverse = 0
            return { kind: 'navigate', direction: directionOf(axis, sign) }
          }
        } else reverse = 0
        return none
      }
      let switched = false
      if (axis && dominant && dominant !== axis) {
        const value = dominant === 'x' ? input.x : input.y
        cross = (Math.sign(cross) === Math.sign(value) ? cross : 0) + value
        if (Math.abs(cross) >= GRAPH_GESTURE.axisLock) {
          axis = dominant
          x = axis === 'x' ? cross : 0
          y = axis === 'y' ? cross : 0
          sign = 0
          mode = 'intent'
          cross = 0
          switched = true
        }
      } else if (dominant === axis) cross = 0
      if (!switched) {
        x += input.x
        y += input.y
      }
      axis =
        axis ??
        (Math.max(Math.abs(x), Math.abs(y)) >= GRAPH_GESTURE.axisLock
          ? axisOf(x, y)
          : null)
      if (!axis) return none
      const value = axis === 'x' ? x : y
      if (!sign) sign = Math.sign(value)
      if (axis === 'y') {
        if (mode === 'reading') return { kind: 'read', delta: input.y }
        if (input.y > 0 ? input.canReadDown : input.canReadUp) {
          mode = 'reading'
          return { kind: 'read', delta: input.y }
        }
      }
      const distance = axis === 'x' ? x : y
      if (Math.abs(distance) < GRAPH_GESTURE.threshold || axisOf(x, y) !== axis)
        return none
      sign = Math.sign(distance)
      return { kind: 'navigate', direction: directionOf(axis, distance) }
    },
    commit(direction: GestureDirection) {
      mode = 'navigation'
      reverse = 0
      cross = 0
      x = 0
      y = 0
      axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
      sign = direction === 'right' || direction === 'down' ? 1 : -1
    },
  }
}
