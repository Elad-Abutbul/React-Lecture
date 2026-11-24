import { COURSE_CONFIG as C } from '@/constants/course'
export function courseSection(id: string): keyof typeof C.progressLabels {
  if (id === C.home) return 'home'
  if (/^L\d/.test(id) || id === C.bridge.id) return 'lecture'
  if (/^W\d/.test(id) || id.startsWith(C.lectureWorkshopPrefix))
    return 'workshop'
  if (id === C.reference.id) return 'gateway'
  return 'reference'
}
export function courseRange(route: readonly string[], cursor: number) {
  const section = courseSection(route[cursor])
  let first = cursor,
    last = cursor
  while (first > 0 && courseSection(route[first - 1]) === section) first--
  while (last < route.length - 1 && courseSection(route[last + 1]) === section)
    last++
  return { first, last, section }
}
export function courseProgress(
  route: readonly string[],
  stops: readonly number[],
  position: number,
  cursor: number,
) {
  const { first, last, section } = courseRange(route, cursor)
  if (section === 'home') return 0
  const length = stops[last] - stops[first]
  return length
    ? Math.max(0, Math.min(1, (position - stops[first]) / length))
    : 0
}
