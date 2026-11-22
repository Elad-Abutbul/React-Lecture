import { TREE_POSITIONS, TREE_CONNECTIONS, TREE_NAV } from '@/constants/tree'
export function cameraTarget(id: string, width: number, height: number) {
  const point = TREE_POSITIONS[id] ?? TREE_POSITIONS.start
  const targets = TREE_CONNECTIONS.filter(
    (e) => e.source === id && !e.retry,
  ).map((e) => TREE_POSITIONS[e.target])
  const points = targets.length > 1 ? [point, ...targets] : [point]
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x)) + TREE_NAV.nodeWidth
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y)) + TREE_NAV.nodeHeight
  const fit = Math.min(
    width / (maxX - minX + TREE_NAV.nodeWidth),
    height / (maxY - minY + TREE_NAV.nodeHeight),
  )
  const zoom = Math.max(
    TREE_NAV.minZoom,
    Math.min(
      points.length > 1 ? TREE_NAV.decisionZoom : TREE_NAV.travelZoom,
      fit,
    ),
  )
  return {
    x: width * TREE_NAV.viewportAnchorX - ((minX + maxX) / 2) * zoom,
    y: height * TREE_NAV.viewportAnchorY - ((minY + maxY) / 2) * zoom,
    zoom,
  }
}
export function interpolatePath(ids: readonly string[], index: number) {
  const bounded = Math.max(0, Math.min(ids.length - 1, index))
  const a = TREE_POSITIONS[ids[Math.floor(bounded)]]
  const b = TREE_POSITIONS[ids[Math.min(ids.length - 1, Math.ceil(bounded))]]
  const t = bounded % 1
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}
