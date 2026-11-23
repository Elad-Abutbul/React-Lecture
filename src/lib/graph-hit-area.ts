export function pointInReading(
  element: HTMLElement | null,
  x: number,
  y: number,
) {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  )
}
export function readingOwnsWheel(
  element: HTMLElement | null,
  event: WheelEvent,
) {
  return (
    !!element &&
    ((event.target instanceof Node && element.contains(event.target)) ||
      pointInReading(element, event.clientX, event.clientY))
  )
}
