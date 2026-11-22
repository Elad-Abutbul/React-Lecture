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
  store().arrive()
  store().select('done')
  expect(store().route).toContain('project')
  store().arrive()
  store().visit(0)
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
