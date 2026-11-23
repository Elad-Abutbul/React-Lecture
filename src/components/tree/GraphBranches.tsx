import { useRef } from 'react'
import { useGraphBranchLayout } from '@/hooks/useGraphBranchLayout'
import { pointInReading } from '@/lib/graph-hit-area'
import type { WorldNode } from '@/types/worldGraph'
import { GRAPH_COPY, GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { useGraphStore } from '@/store/graph-store'
export function GraphBranches({ node }: { node: WorldNode }) {
  const projection = GRAPH_NAV.projection
  const busy = useGraphStore((state) => state.transitioning)
  const aside = useRef<HTMLElement>(null),
    regions = useRef<HTMLDivElement>(null)
  useGraphBranchLayout(aside, regions, busy)
  if (node.edges.length < 2) return null
  const edges = [...node.edges].sort((a, b) =>
    a.direction === b.direction ? 0 : a.direction === 'left' ? -1 : 1,
  )
  return (
    <aside
      ref={aside}
      className={`graph-branches graph-branches-${edges.length}`}
      aria-label={GRAPH_COPY.branches}
      aria-hidden={busy}
    >
      <svg
        viewBox={`0 0 ${projection.width} ${projection.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {edges.map((edge, i) => (
          <path
            key={edge.id}
            fill="none"
            d={`M ${projection.startX} ${projection.startY} C ${projection.startX} ${projection.curveY} ${(projection.width * (i + 0.5)) / edges.length} ${projection.approachY} ${(projection.width * (i + 0.5)) / edges.length} ${projection.endY}`}
            className={`branch-line branch-line-${edge.direction}`}
            pathLength="1"
          />
        ))}
      </svg>
      <div ref={regions} className="graph-regions">
        {edges.map((edge) => (
          <button
            type="button"
            disabled={busy}
            key={edge.id}
            data-edge-id={edge.id}
            className={`graph-branch branch-${edge.direction}`}
            onClick={(event) => {
              const reading = document.querySelector<HTMLElement>(
                '.graph-node-active .graph-reading',
              )
              if (!pointInReading(reading, event.clientX, event.clientY))
                useGraphStore.getState().select(edge.id)
            }}
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
