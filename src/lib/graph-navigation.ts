import { GRAPH_BY_ID, LEGACY_IDS } from '@/content/worldGraph'
import { GRAPH_NAV } from '@/constants/graphNavigation'
export function extendPath(
  prefix: readonly string[],
  choices: Record<string, string> = {},
) {
  const route = [...prefix]
  const seen = new Set<string>()
  while (route.length < GRAPH_NAV.maxHistory) {
    const id = route.at(-1)!
    const node = GRAPH_BY_ID[id]
    if (!node || seen.has(id)) break
    seen.add(id)
    const edge =
      node.edges.length === 1
        ? node.edges[0]
        : node.edges.find((e) => e.id === choices[id])
    if (!edge) break
    route.push(edge.target)
  }
  return route
}
export function pathTo(target: string) {
  const queue = [
      [
        LEGACY_IDS.has(target) ? GRAPH_NAV.referenceStart : GRAPH_NAV.start,
      ] as string[],
    ],
    seen = new Set<string>()
  while (queue.length) {
    const route = queue.shift()!,
      id = route.at(-1)!
    if (id === target) return route
    if (seen.has(id)) continue
    seen.add(id)
    for (const edge of GRAPH_BY_ID[id]?.edges ?? [])
      queue.push([...route, edge.target])
  }
  return [GRAPH_NAV.start]
}
export function normalizeWheel(
  x: number,
  y: number,
  mode: number,
  height: number,
) {
  const multiplier = mode === 1 ? GRAPH_NAV.linePixels : mode === 2 ? height : 1
  return { x: x * multiplier, y: y * multiplier }
}
export function graphErrors() {
  const errors: string[] = []
  for (const node of Object.values(GRAPH_BY_ID))
    for (const edge of node.edges)
      if (!GRAPH_BY_ID[edge.target]) errors.push(`${node.id}: ${edge.target}`)
  for (const node of Object.values(GRAPH_BY_ID))
    if (pathTo(node.id).at(-1) !== node.id)
      errors.push(`unreachable: ${node.id}`)
  return errors
}
