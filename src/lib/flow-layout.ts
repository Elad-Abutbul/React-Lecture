import type { Node, Edge } from '@xyflow/react'
import type { JourneyNode } from '@/types/journey'
import { JOURNEY_NODES } from '@/content/journey'
import { TREE_CONNECTIONS, TREE_POSITIONS } from '@/constants/tree'
export type FlowNode = Node<
  {
    journeyId: string
    title: string
    done: boolean
    active: boolean
    available: boolean
    onPath: boolean
    choiceLabel?: string
    sourceId?: string
    choiceId?: string
  },
  'journey'
>
export function flowLayout(
  path: readonly JourneyNode[],
  completed: readonly string[],
  current: string,
): { nodes: FlowNode[]; edges: Edge[] } {
  const active = new Set(path.map((n) => n.id))
  const outgoing = TREE_CONNECTIONS.filter((e) => e.source === current)
  return {
    nodes: JOURNEY_NODES.map((n) => {
      const candidate = outgoing.find((e) => e.target === n.id)
      return {
        id: n.id,
        type: 'journey',
        position: TREE_POSITIONS[n.id],
        data: {
          journeyId: n.id,
          title: n.title,
          done: completed.includes(n.id),
          active: n.id === current,
          onPath: active.has(n.id),
          available: !!candidate,
          choiceLabel: candidate?.label,
          sourceId: candidate?.source,
          choiceId: candidate?.choiceId,
        },
      }
    }),
    edges: TREE_CONNECTIONS.map((edge) => ({
      ...edge,
      type: 'journey',
      data: {
        active: path.some(
          (n, i) => n.id === edge.source && path[i + 1]?.id === edge.target,
        ),
        available: edge.source === current,
      },
      label: undefined,
    })),
  }
}
