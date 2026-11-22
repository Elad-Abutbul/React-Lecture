import { JOURNEY_NODES, JOURNEY_START } from '@/content/journey'
import type { Choices, JourneyNode } from '@/types/journey'
export function getNextNode(
  node: JourneyNode,
  choices: Choices,
  nodes: readonly JourneyNode[] = JOURNEY_NODES,
) {
  const choice = node.choices.find((c) => c.id === choices[node.id])
  return nodes.find((n) => n.id === choice?.nextNodeId)
}
export function getActivePath(
  choices: Choices,
  nodes: readonly JourneyNode[] = JOURNEY_NODES,
  start = JOURNEY_START,
) {
  const path: JourneyNode[] = []
  const seen = new Set<string>()
  let node = nodes.find((n) => n.id === start)
  while (node && !seen.has(node.id)) {
    path.push(node)
    seen.add(node.id)
    node = getNextNode(node, choices, nodes)
  }
  return path
}
export function reconcileChoices(
  choices: Choices,
  completedNodeIds: readonly string[],
  nodes: readonly JourneyNode[] = JOURNEY_NODES,
) {
  const path = getActivePath(choices, nodes)
  const valid = new Map(path.map((n) => [n.id, n]))
  const reconciled: Choices = {}
  for (const node of path) {
    if (node.choices.some((c) => c.id === choices[node.id]))
      reconciled[node.id] = choices[node.id]
  }
  return {
    choices: reconciled,
    completedNodeIds: [...new Set(completedNodeIds)].filter((id) => {
      const node = valid.get(id)
      return (
        node &&
        (!node.choices.length ||
          node.choices.some(
            (c) => c.id === reconciled[id] && c.complete !== false,
          ))
      )
    }),
  }
}
export function validateJourneyGraph(
  nodes: readonly JourneyNode[],
  start = JOURNEY_START,
) {
  const errors: string[] = []
  const byId = new Map(nodes.map((n) => [n.id, n]))
  if (byId.size !== nodes.length) errors.push('duplicate node')
  if (!byId.has(start)) errors.push('missing start')
  for (const node of nodes) {
    const ids = new Set<string>()
    for (const c of node.choices) {
      if (!byId.has(c.nextNodeId))
        errors.push(`missing target: ${c.nextNodeId}`)
      if (ids.has(c.id)) errors.push(`duplicate choice: ${node.id}`)
      ids.add(c.id)
    }
  }
  const visiting = new Set<string>()
  const visited = new Set<string>()
  function visit(id: string) {
    if (visiting.has(id)) {
      errors.push(`cycle: ${id}`)
      return
    }
    if (visited.has(id)) return
    visiting.add(id)
    for (const c of byId.get(id)?.choices ?? [])
      if (!c.retry) visit(c.nextNodeId)
    visiting.delete(id)
    visited.add(id)
  }
  for (const n of nodes) visit(n.id)
  return errors
}
export function getJourneyProgress(
  choices: Choices,
  completed: readonly string[],
) {
  const path = getActivePath(choices)
  const count = path.filter((n) => completed.includes(n.id)).length
  function depth(node: JourneyNode, seen: Set<string>): number {
    if (seen.has(node.id)) return 0
    const nextSeen = new Set([...seen, node.id])
    const children = node.choices
      .filter((c) => !c.retry && c.complete !== false)
      .map((c) => JOURNEY_NODES.find((n) => n.id === c.nextNodeId))
      .filter((n): n is JourneyNode => !!n)
    return 1 + Math.max(0, ...children.map((n) => depth(n, nextSeen)))
  }
  const total = path.length - 1 + depth(path.at(-1)!, new Set())
  return {
    count,
    total,
    percent: Math.round((count / Math.max(1, total)) * 100),
  }
}
