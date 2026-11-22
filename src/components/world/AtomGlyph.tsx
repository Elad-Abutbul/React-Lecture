export function AtomGlyph() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="50" cy="50" rx="44" ry="16" />
        <ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(60 50 50)" />
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="16"
          transform="rotate(120 50 50)"
        />
      </g>
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  )
}
