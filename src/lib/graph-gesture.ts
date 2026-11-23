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
  branching: boolean
}
export type BranchIntent = { direction: 'left' | 'right'; progress: number }
export type GestureResult =
  | { kind: 'none' }
  | { kind: 'read'; delta: number }
  | { kind: 'navigate'; direction: GestureDirection }
const none: GestureResult = { kind: 'none' }
export function graphGestureAxis(
  x: number,
  y: number,
  branching: boolean,
): Axis | null {
  const horizontal = Math.abs(x),
    vertical = Math.abs(y)
  // Downward diagonals at decisions follow their physical horizontal sign.
  // Upward diagonals return along the path; single paths favor vertical travel.
  if (
    branching &&
    y >= 0 &&
    horizontal > GRAPH_GESTURE.epsilon &&
    horizontal >= vertical * GRAPH_GESTURE.branchRatio
  )
    return 'x'
  if (
    (!branching || y < 0) &&
    vertical > GRAPH_GESTURE.epsilon &&
    vertical >= horizontal * GRAPH_GESTURE.branchRatio
  )
    return 'y'
  return horizontal > vertical * GRAPH_GESTURE.axisRatio
    ? 'x'
    : vertical > horizontal * GRAPH_GESTURE.axisRatio
      ? 'y'
      : null
}
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
    cross = 0,
    branching = false
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
      branching = input.branching
      const quiet =
        mode === 'intent' && axis === 'x' && branching
          ? GRAPH_GESTURE.intentQuietMs
          : GRAPH_GESTURE.quietMs
      const fresh = input.at - last > quiet
      last = input.at
      if (fresh) reset(input.stop)
      else if (owner !== input.stop) {
        owner = input.stop
        mode = 'navigation'
        x = 0
        y = 0
        reverse = 0
      }
      const dominant = graphGestureAxis(input.x, input.y, input.branching)
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
      if (
        !switched &&
        mode === 'intent' &&
        axis === 'x' &&
        dominant === 'x' &&
        Math.sign(input.x) === -Math.sign(x)
      ) {
        reverse += Math.abs(input.x)
        if (reverse >= GRAPH_GESTURE.axisLock) {
          x = Math.sign(input.x) * reverse
          y = 0
          reverse = 0
          switched = true
        }
      } else if (mode === 'intent') reverse = 0
      if (!switched) {
        x += input.x
        y += input.y
      }
      axis =
        axis ??
        (Math.max(Math.abs(x), Math.abs(y)) >= GRAPH_GESTURE.axisLock
          ? graphGestureAxis(x, y, input.branching)
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
      if (
        Math.abs(distance) <
          (axis === 'x' && input.branching
            ? GRAPH_GESTURE.branchThreshold
            : GRAPH_GESTURE.threshold) ||
        graphGestureAxis(x, y, input.branching) !== axis
      )
        return none
      sign = Math.sign(distance)
      return { kind: 'navigate', direction: directionOf(axis, distance) }
    },
    preview(): BranchIntent | null {
      return branching &&
        mode === 'intent' &&
        axis === 'x' &&
        Math.abs(x) >= GRAPH_GESTURE.axisLock
        ? {
            direction: x > 0 ? 'right' : 'left',
            progress: Math.min(1, Math.abs(x) / GRAPH_GESTURE.branchThreshold),
          }
        : null
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
