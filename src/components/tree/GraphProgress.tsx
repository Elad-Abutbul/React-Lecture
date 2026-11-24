import { courseRange } from '@/lib/course-progress'
import { COURSE_CONFIG } from '@/constants/course'
import { useGraphStore } from '@/store/graph-store'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_NAV, GRAPH_COPY } from '@/constants/graphNavigation'
import type { RefObject } from 'react'
export function GraphProgress({
  progressRef,
}: {
  progressRef: RefObject<HTMLDivElement | null>
}) {
  const route = useGraphStore((s) => s.route),
    cursor = useGraphStore((s) => s.cursor),
    choices = useGraphStore((s) => s.choices),
    visited = useGraphStore((s) => s.visited)
  const { first, last, section } = courseRange(route, cursor),
    label = COURSE_CONFIG.progressLabels[section],
    stops = useGraphStore.getState().motion.path.stops,
    length = stops[last] - stops[first]
  const entries = route
    .slice(Math.max(0, cursor - GRAPH_NAV.trailLimit + 1), cursor + 1)
    .filter((id) => visited.includes(id))
  return (
    <>
      {visited.length > 1 && (
        <nav className="world-trail" aria-label={GRAPH_COPY.path}>
          <ol>
            {entries.map((id, index) => (
              <li key={`${id}-${index}`}>
                <button
                  type="button"
                  aria-current={
                    index === entries.length - 1 ? 'step' : undefined
                  }
                  onClick={() => useGraphStore.getState().jump(id)}
                  title={GRAPH_BY_ID[id].title}
                >
                  <span>{GRAPH_BY_ID[id].title}</span>
                  <small>
                    {
                      GRAPH_BY_ID[id].edges.find(
                        (edge) => edge.id === choices[id],
                      )?.label
                    }
                  </small>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="world-position" ref={progressRef}>
        <div className="world-position-label">
          <span>{label}</span>
          <span data-position-label dir="ltr">
            0%
          </span>
        </div>
        <div
          className="world-position-track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <span className="world-position-fill" />
          <span className="world-position-pin" />
          {route.slice(first, last + 1).map((id, localIndex) => {
            const i = first + localIndex
            return (
              <span
                key={`${id}-${i}`}
                className={`world-position-stop ${i === cursor ? 'is-current' : ''}`}
                style={{
                  left: `${length ? ((stops[i] - stops[first]) / length) * 100 : 0}%`,
                }}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
