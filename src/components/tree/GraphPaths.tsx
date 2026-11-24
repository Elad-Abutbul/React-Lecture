import type { CSSProperties } from 'react'
import { useGraphStore } from '@/store/graph-store'
import { WORLD_GRAPH, GRAPH_BY_ID } from '@/content/worldGraph'
import { graphCurveD } from '@/lib/graph-path'
import { GRAPH_NAV } from '@/constants/graphNavigation'
export function GraphPaths({ route }: { route: readonly string[] }) {
  const traversed = useGraphStore((state) => state.traversed)
  return (
    <svg
      className="world-connections graph-connections"
      width={GRAPH_NAV.bounds.width}
      height={GRAPH_NAV.bounds.height}
      aria-hidden="true"
    >
      {WORLD_GRAPH.flatMap((node) =>
        node.edges.map((edge) => {
          const target = GRAPH_BY_ID[edge.target]?.position
          if (!target) return null
          const index = route.findIndex(
            (id, i) => id === node.id && route[i + 1] === edge.target,
          )
          const d = graphCurveD(node.position, target)
          return (
            <g key={`${node.id}-${edge.id}`}>
              <path
                data-source={node.id}
                data-target={edge.target}
                d={d}
                fill="none"
                vectorEffect="non-scaling-stroke"
                className={`world-path ${traversed.includes(`${node.id}::${edge.target}`) ? 'graph-visited-edge' : 'graph-future-edge'} graph-edge-${edge.direction}`}
              />
              {index >= 0 && (
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ '--edge-index': index } as CSSProperties}
                  className={`world-path world-path-selected graph-edge-${edge.direction}`}
                />
              )}
            </g>
          )
        }),
      )}
    </svg>
  )
}
