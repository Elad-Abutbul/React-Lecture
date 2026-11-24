import { GRAPH_MOTION as C } from '@/constants/graphMotion'
import { createGraphPath } from './graph-path'

export function criticalSpring(
  value: number,
  velocity: number,
  target: number,
  seconds: number,
  frequency: number,
) {
  const offset = value - target,
    c = velocity + frequency * offset,
    decay = Math.exp(-frequency * seconds)
  return {
    value: target + (offset + c * seconds) * decay,
    velocity: (velocity - frequency * c * seconds) * decay,
  }
}
export function createGraphMotion(route: readonly string[], index = 0) {
  let path = createGraphPath(route),
    position = path.stops[index] ?? 0,
    target = position,
    velocity = 0,
    inputVelocity = 0,
    lastInput = -Infinity,
    lastFrame: number | null = null,
    snap: number | null = position,
    releasedStop: number | null = null,
    releaseTravel = 0,
    lastReleaseInput = -Infinity,
    offsetX = { value: 0, velocity: 0 },
    offsetY = { value: 0, velocity: 0 }
  const listeners = new Set<() => void>()
  const wake = () => listeners.forEach((listener) => listener())
  return {
    get path() {
      return path
    },
    get position() {
      return position
    },
    get target() {
      return target
    },
    get velocity() {
      return velocity
    },
    get snapping() {
      return snap !== null
    },
    get point() {
      const point = path.at(position)
      return {
        ...point,
        x: point.x + offsetX.value,
        y: point.y + offsetY.value,
      }
    },
    configure(next: readonly string[], index?: number) {
      const before = path.at(position),
        point = { x: before.x + offsetX.value, y: before.y + offsetY.value },
        anchor = index ?? path.nearest(position)
      path = createGraphPath(next)
      position = target = path.stops[anchor] ?? 0
      const centered = path.at(position)
      offsetX = {
        value: index === undefined ? point.x - centered.x : 0,
        velocity: 0,
      }
      offsetY = {
        value: index === undefined ? point.y - centered.y : 0,
        velocity: 0,
      }
      velocity = inputVelocity = 0
      lastInput = -Infinity
      snap = position
      releasedStop = null
      releaseTravel = 0
      lastFrame = null
      wake()
    },
    scroll(pixels: number, now: number, forwardLimit = path.length) {
      if (!Number.isFinite(pixels) || Math.abs(pixels) < C.epsilon) return
      if (snap !== null) {
        if (
          now - lastReleaseInput > C.snapReleaseQuietMs ||
          Math.sign(releaseTravel) !== Math.sign(pixels)
        )
          releaseTravel = 0
        releaseTravel += pixels
        lastReleaseInput = now
        if (Math.abs(releaseTravel) < C.snapReleaseThreshold) return
        pixels = releaseTravel
        releaseTravel = 0
        releasedStop = snap
        snap = null
        target = position
      } else if (
        releasedStop !== null &&
        (pixels * (releasedStop - position) > 0 ||
          Math.abs(position - releasedStop) > C.snapExitRadius)
      )
        releasedStop = null
      const delta =
        Math.max(-C.maxInput, Math.min(C.maxInput, pixels)) *
        C.pixelsPerWheelUnit
      // Reversal cancels following lag immediately; it never targets a previous stop.
      if (Math.sign(delta) !== Math.sign(target - position)) target = position
      target = Math.max(
        0,
        Math.min(
          delta > 0 ? Math.min(path.length, forwardLimit) : path.length,
          target + delta,
        ),
      )
      inputVelocity =
        Math.abs(delta) /
        Math.max(
          C.minSampleMs,
          Math.min(C.maxSampleMs, now - lastInput || C.defaultFrameMs),
        )
      lastInput = now
      snap = null
      velocity = 0
      wake()
    },
    tick(now: number, reduced = false) {
      const dt = Math.max(
        0,
        Math.min(
          C.maxFrameMs,
          lastFrame === null ? C.defaultFrameMs : now - lastFrame,
        ),
      )
      lastFrame = now
      if (
        releasedStop !== null &&
        Math.abs(position - releasedStop) > C.snapExitRadius
      )
        releasedStop = null
      const stop = path.stops[path.nearest(target)],
        quiet = now - lastInput,
        speed = inputVelocity * Math.exp(-quiet / C.velocityDecayMs)
      if (
        snap === null &&
        stop !== releasedStop &&
        quiet >= C.idleMs &&
        speed <= C.snapMaxVelocity &&
        Math.abs(velocity) <= C.snapMaxVelocity * 1000 &&
        Math.abs(position - target) <= C.snapFollowTolerance &&
        Math.abs(target - stop) <= C.snapRadius &&
        Math.abs(position - stop) <= C.snapRadius
      ) {
        snap = stop
        if (Math.sign(velocity) !== Math.sign(stop - position)) velocity = 0
        target = stop
      }
      offsetX = criticalSpring(
        offsetX.value,
        offsetX.velocity,
        0,
        dt / 1000,
        C.snapFrequency,
      )
      offsetY = criticalSpring(
        offsetY.value,
        offsetY.velocity,
        0,
        dt / 1000,
        C.snapFrequency,
      )
      if (
        Math.abs(offsetX.value) < C.settleDistance &&
        Math.abs(offsetX.velocity) < C.settleVelocity
      )
        offsetX = { value: 0, velocity: 0 }
      if (
        Math.abs(offsetY.value) < C.settleDistance &&
        Math.abs(offsetY.velocity) < C.settleVelocity
      )
        offsetY = { value: 0, velocity: 0 }
      const previous = position
      if (snap !== null) {
        const frame = criticalSpring(
          position,
          velocity,
          snap,
          dt / 1000,
          C.snapFrequency,
        )
        position = Math.max(0, Math.min(path.length, frame.value))
        velocity = frame.velocity
      } else {
        position +=
          (target - position) * (reduced ? 1 : 1 - Math.exp(-dt / C.followMs))
        velocity = dt ? ((position - previous) / dt) * 1000 : 0
      }
      if (
        Math.abs(target - position) < C.settleDistance &&
        Math.abs(velocity) < C.settleVelocity
      ) {
        position = target
        velocity = 0
      }
      return (
        position !== target ||
        Math.abs(velocity) >= C.settleVelocity ||
        offsetX.value !== 0 ||
        offsetY.value !== 0 ||
        (snap === null &&
          stop !== releasedStop &&
          Math.abs(target - stop) <= C.snapRadius &&
          quiet < C.idleMs + C.velocityDecayMs * 12)
      )
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
export type GraphMotion = ReturnType<typeof createGraphMotion>
