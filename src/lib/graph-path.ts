import { GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_MOTION } from '@/constants/graphMotion'
import type { Point } from '@/types/worldGraph'

export function graphCurve(a: Point, b: Point, t: number): Point {
  const u = 1 - t,
    middle = (a.y + b.y) / 2
  return {
    x: a.x * (u * u * u + 3 * u * u * t) + b.x * (3 * u * t * t + t * t * t),
    y: a.y * u * u * u + middle * 3 * u * t + b.y * t * t * t,
  }
}
export function graphCurveD(a: Point, b: Point) {
  const middle = (a.y + b.y) / 2
  return `M ${a.x} ${a.y} C ${a.x} ${middle} ${b.x} ${middle} ${b.x} ${b.y}`
}
export function createGraphPath(route: readonly string[]) {
  const stops = [0],
    samples: { distance: number; index: number; point: Point }[] = []
  let distance = 0
  samples.push({ distance, index: 0, point: GRAPH_BY_ID[route[0]].position })
  for (let i = 1; i < route.length; i++) {
    const a = GRAPH_BY_ID[route[i - 1]].position,
      b = GRAPH_BY_ID[route[i]].position
    let previous = a
    for (let j = 1; j <= GRAPH_MOTION.curveSamples; j++) {
      const t = j / GRAPH_MOTION.curveSamples,
        point = graphCurve(a, b, t)
      distance += Math.hypot(point.x - previous.x, point.y - previous.y)
      samples.push({ distance, index: i - 1 + t, point })
      previous = point
    }
    stops.push(distance)
  }
  return {
    stops,
    length: distance,
    at(value: number) {
      const d = Math.max(0, Math.min(distance, value))
      let low = 0,
        high = samples.length - 1
      while (low < high) {
        const mid = Math.floor((low + high) / 2)
        if (samples[mid].distance < d) low = mid + 1
        else high = mid
      }
      const end = samples[low],
        start = samples[Math.max(0, low - 1)]
      const t =
        end.distance === start.distance
          ? 0
          : (d - start.distance) / (end.distance - start.distance)
      return {
        x: start.point.x + (end.point.x - start.point.x) * t,
        y: start.point.y + (end.point.y - start.point.y) * t,
        index: start.index + (end.index - start.index) * t,
      }
    },
    nearest(value: number) {
      let index = 0
      for (let i = 1; i < stops.length; i++)
        if (Math.abs(stops[i] - value) < Math.abs(stops[index] - value))
          index = i
      return index
    },
  }
}
export type GraphPath = ReturnType<typeof createGraphPath>
