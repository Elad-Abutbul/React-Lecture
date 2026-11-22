import { expect, test } from 'vitest'
import { flowLayout } from './flow-layout'
import { getActivePath } from './journey-engine'
import { TREE_POSITIONS, TREE_CONNECTIONS } from '@/constants/tree'
import { JOURNEY_NODES } from '@/content/journey'
test('all canonical nodes have distinct spatial positions', () => {
  expect(Object.keys(TREE_POSITIONS)).toHaveLength(JOURNEY_NODES.length)
  expect(
    new Set(Object.values(TREE_POSITIONS).map((p) => `${p.x},${p.y}`)).size,
  ).toBe(JOURNEY_NODES.length)
})
test('available branch nodes lie on opposing diagonals', () => {
  const graph = flowLayout(getActivePath({}), [], 'start')
  const options = graph.nodes.filter((n) => n.data.available)
  expect(options).toHaveLength(2)
  expect(options[0].position.x * options[1].position.x).toBeLessThan(0)
})
test('shared targets occur once and retain all incoming edges', () => {
  const graph = flowLayout(getActivePath({ start: 'yes' }), ['start'], 'node')
  expect(graph.nodes.filter((n) => n.id === 'verify')).toHaveLength(1)
  expect(TREE_CONNECTIONS.filter((e) => e.target === 'verify')).toHaveLength(4)
  expect(TREE_CONNECTIONS.filter((e) => e.target === 'browser')).toHaveLength(2)
})
