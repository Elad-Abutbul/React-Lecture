import type { Node, Edge } from '@xyflow/react'
import type { JourneyNode } from '@/types/journey'
import { FLOW } from '@/constants/flow'
export type FlowNode = Node<
  { journeyId: string; title: string; done: boolean; active: boolean },
  'journey'
>
export function flowLayout(
  path: readonly JourneyNode[],
  completed: readonly string[],
  current: string,
): { nodes: FlowNode[]; edges: Edge[] } {
  return {
    nodes: path.map((n, index) => ({
      id: n.id,
      type: 'journey',
      position: { x: 0, y: index * FLOW.rowGap },
      data: {
        journeyId: n.id,
        title: n.title,
        done: completed.includes(n.id),
        active: current === n.id,
      },
    })),
    edges: path.slice(1).map((n, i) => ({
      id: `${path[i].id}-${n.id}`,
      source: path[i].id,
      target: n.id,
      type: 'smoothstep',
    })),
  }
}
