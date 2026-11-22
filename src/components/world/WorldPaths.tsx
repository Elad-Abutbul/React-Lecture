import { WORLD, WORLD_CONNECTIONS, WORLD_POSITIONS } from '@/constants/world'
export function WorldPaths({
  route,
  active,
}: {
  route: readonly string[]
  active: string
}) {
  return (
    <svg
      className="world-connections"
      width={WORLD.width}
      height={WORLD.height}
      aria-hidden="true"
    >
      {WORLD_CONNECTIONS.filter((edge) => route.includes(edge.source)).map(
        (edge) => {
          const a = WORLD_POSITIONS[edge.source],
            b = WORLD_POSITIONS[edge.target]
          const selected = route.some(
            (id, index) =>
              id === edge.source && route[index + 1] === edge.target,
          )
          const d = `M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`
          return (
            <path
              key={edge.id}
              d={d}
              pathLength={1}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className={`world-path ${selected ? 'world-path-selected' : edge.source === active ? 'world-path-option' : ''}`}
            />
          )
        },
      )}
      {route.map((id) => {
        const p = WORLD_POSITIONS[id]
        return (
          <g
            key={id}
            transform={`translate(${p.x},${p.y})`}
            className={id === active ? 'world-marker-active' : 'world-marker'}
          >
            <circle r={WORLD.markerRadius} />
            <circle r={WORLD.markerCore} />
          </g>
        )
      })}
    </svg>
  )
}
