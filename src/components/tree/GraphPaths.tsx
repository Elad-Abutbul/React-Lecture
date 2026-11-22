import type { CSSProperties } from 'react'
import { useGraphStore } from '@/store/graph-store'
import { WORLD_GRAPH, GRAPH_BY_ID } from '@/content/worldGraph'
export function GraphPaths({ route }: { route: readonly string[] }) {
  const visited = useGraphStore((s) => s.visited)
  return (
    <svg
      className="world-connections graph-connections"
      width="120000"
      height="160000"
      aria-hidden="true"
    >
      {WORLD_GRAPH.flatMap((node) =>
        node.edges.map((edge) => {
          const target = GRAPH_BY_ID[edge.target]?.position
          if (!target) return null
          const i = route.findIndex(
            (id, index) => id === node.id && route[index + 1] === edge.target,
          )
          return (
            <path
              key={`${node.id}-${edge.id}`}
              d={`M ${node.position.x} ${node.position.y} C ${node.position.x} ${(node.position.y + target.y) / 2} ${target.x} ${(node.position.y + target.y) / 2} ${target.x} ${target.y}`}
              fill="none"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              style={{ '--edge-index': i } as CSSProperties}
              className={`world-path ${i >= 0 ? 'world-path-selected' : visited.includes(node.id) && visited.includes(edge.target) ? 'graph-visited-edge' : 'world-path-option'} graph-edge-${edge.direction}`}
            />
          )
        }),
      )}
    </svg>
  )
}
