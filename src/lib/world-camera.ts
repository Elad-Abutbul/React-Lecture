import { WORLD, WORLD_POSITIONS, WORLD_CONNECTIONS } from '@/constants/world'
export function worldPoint(id: string) {
  return WORLD_POSITIONS[id] ?? WORLD_POSITIONS.intro
}
export function worldCameraTarget(
  id: string,
  reveal: boolean,
  width: number,
  height: number,
) {
  const point = worldPoint(id)
  const options = WORLD_CONNECTIONS.filter(
    (e) => e.source === id && !e.retry,
  ).map((e) => worldPoint(e.target))
  if (!reveal || !options.length) return { ...point, zoom: 1 }
  const all = [point, ...options]
  const minX = Math.min(...all.map((p) => p.x)),
    maxX = Math.max(...all.map((p) => p.x))
  const minY = Math.min(...all.map((p) => p.y)),
    maxY = Math.max(...all.map((p) => p.y))
  const zoom = Math.min(
    WORLD.decisionZoom,
    width / (maxX - minX + Math.min(width, WORLD.maxWidth)),
    height / (maxY - minY + height),
  )
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, zoom }
}
export function interpolateWorld(route: readonly string[], index: number) {
  const clamped = Math.max(0, Math.min(route.length - 1, index))
  const a = worldPoint(route[Math.floor(clamped)])
  const b = worldPoint(route[Math.ceil(clamped)])
  const t = clamped % 1
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, zoom: 1 }
}
