import type { WorldNode } from '@/types/worldGraph'
import { GRAPH_COPY } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { useGraphStore } from '@/store/graph-store'
export function GraphBranches({ node }: { node: WorldNode }) {
  if (node.edges.length < 2) return null
  const edges = [...node.edges].sort((a, b) =>
    a.direction === b.direction ? 0 : a.direction === 'left' ? -1 : 1,
  )
  return (
    <aside
      className={`graph-branches graph-branches-${edges.length}`}
      aria-label={GRAPH_COPY.branches}
    >
      <svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        {edges.map((edge, i) => (
          <path
            key={edge.id}
            fill="none"
            d={`M 500 110 C 500 250 ${(1000 * (i + 0.5)) / edges.length} 320 ${(1000 * (i + 0.5)) / edges.length} 500`}
            className={`branch-line branch-line-${edge.direction}`}
            pathLength="1"
          />
        ))}
      </svg>
      <div className="graph-regions">
        {edges.map((edge) => (
          <button
            type="button"
            key={edge.id}
            data-edge-id={edge.id}
            className={`graph-branch branch-${edge.direction}`}
            onClick={() => useGraphStore.getState().select(edge.id)}
            aria-label={edge.label}
          >
            <span className="graph-branch-label">
              <span aria-hidden="true" dir="ltr">
                {edge.direction === 'left'
                  ? GRAPH_COPY.leftArrow
                  : edge.direction === 'right'
                    ? GRAPH_COPY.rightArrow
                    : GRAPH_COPY.forwardArrow}
              </span>
              <strong>{edge.label}</strong>
            </span>
            <span className="graph-branch-preview">
              {GRAPH_BY_ID[edge.target]?.title}
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
