import { test, expect } from 'vitest'
import {
  extendPath,
  graphErrors,
  normalizeWheel,
  pathTo,
} from './graph-navigation'
import { WORLD_GRAPH, GRAPH_BY_ID } from '@/content/worldGraph'
import { useGraphStore, sanitizeGraph } from '@/store/graph-store'
test('every instructional node is reachable and every connection resolves', () => {
  expect(graphErrors()).toEqual([])
  expect(WORLD_GRAPH.length).toBeGreaterThan(80)
  expect(pathTo('resources').at(-1)).toBe('resources')
})
test('single paths expand automatically but stop at a meaningful decision', () => {
  expect(extendPath(['windows'])).toEqual(['windows', 'verify'])
  expect(extendPath(['existing'])).toEqual([
    'existing',
    'scripts',
    'scripts-result',
  ])
})
test('wheel line/page modes normalize without changing the physical direction', () => {
  expect(normalizeWheel(-3, 2, 1, 800)).toEqual({ x: -48, y: 32 })
  expect(normalizeWheel(0.4, 0.3, 2, 800)).toEqual({ x: 320, y: 240 })
})
test('branch changes preserve visited history while replacing the active suffix, with safe corruption handling', () => {
  const store = () => useGraphStore.getState()
  store().reset()
  store().select('yes')
  store().jump('verify')
  store().select('done')
  expect(store().route).toContain('project')
  store().jump('project')
  store().jump('node')
  store().select('no')
  expect(store().route).toEqual(['node', 'os'])
  expect(store().visited).toContain('verify')
  expect(store().choices.node).toBe('no')
  expect(
    sanitizeGraph({ route: ['node', 'missing'], cursor: 999 }).route,
  ).toEqual(['node'])
})
test('troubleshooting rejoins its original command and does not create a dead end', () => {
  for (const node of WORLD_GRAPH.filter((n) =>
    n.edges.some((e) => e.id === 'error'),
  )) {
    const failed = node.edges.find((e) => e.id === 'error')!
    const branch = extendPath([failed.target])
    const end = GRAPH_BY_ID[branch.at(-1)!]
    expect(end.edges.length).toBeGreaterThan(0)
  }
})
test('repeated retries rejoin the original stop without unbounded history or lost visited paths', () => {
  const store = () => useGraphStore.getState()
  store().reset()
  store().select('yes')
  store().jump('verify')
  for (let i = 0; i < 10; i++) {
    store().select('error')
    const motion = store().motion
    const last = motion.path.stops.at(-1)!
    // Drive the existing continuous path through each retry stop.
    for (let n = 0; n < 30 && motion.position < last; n++) {
      motion.scroll(600, n * 1000)
      for (let t = 0; t < 1000; t += 16) {
        motion.tick(n * 1000 + t)
        store().synchronize()
      }
      if (store().route.length === 2) break
    }
    expect(store().route).toEqual(['node', 'verify'])
  }
  expect(store().visited).toEqual(
    expect.arrayContaining(['verify-help-0', 'verify-help-1']),
  )
  expect(store().traversed).toContain('verify-help-1::verify')
  expect(store().choices).toEqual({ node: 'yes' })
})
test('migration expands a newly introduced single path rather than leaving a navigation dead end', () => {
  const prefix = pathTo('existing-run')
  const recovered = sanitizeGraph({
    route: prefix,
    cursor: prefix.length - 1,
    visited: prefix,
  })
  expect(recovered.route.at(-1)).toBe('existing-run-result')
})
test('selecting a branch only configures a path, without moving or visiting its target', () => {
  const store = () => useGraphStore.getState()
  store().reset()
  const before = store().motion.point
  store().select('yes')
  expect(store().cursor).toBe(0)
  expect(store().motion.point).toEqual(before)
  expect(store().visited).toEqual(['node'])
  store().select('no')
  expect(store().route).toEqual(['node', 'os'])
  expect(store().motion.position).toBe(0)
})
test('every directional edge actually moves the camera in its labelled direction', () => {
  for (const node of WORLD_GRAPH)
    for (const edge of node.edges) {
      if (edge.direction === 'forward') continue
      const dx = GRAPH_BY_ID[edge.target].position.x - node.position.x
      expect(Math.sign(dx), `${node.id} -> ${edge.target}`).toBe(
        edge.direction === 'right' ? 1 : -1,
      )
    }
})
test('explicit map jumps and reset share the same continuous position without stale animations', () => {
  const store = () => useGraphStore.getState()
  store().reset()
  store().jump('verify')
  expect(store().motion.point.x).toBe(GRAPH_BY_ID.verify.position.x)
  store().jump('project')
  expect(store().motion.point.y).toBe(GRAPH_BY_ID.project.position.y)
  store().reset()
  expect(store().motion.position).toBe(0)
})
