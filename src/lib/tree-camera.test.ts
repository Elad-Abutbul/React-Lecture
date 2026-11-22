import { expect, test } from 'vitest'
import { cameraTarget, interpolatePath } from './tree-camera'
import { TREE_NAV, TREE_POSITIONS } from '@/constants/tree'
test('decision framing reveals child branches at a bounded zoom', () => {
  const target = cameraTarget('start', 900, 600)
  expect(target.zoom).toBeLessThanOrEqual(TREE_NAV.decisionZoom)
  for (const id of ['start', 'node', 'why']) {
    const p = TREE_POSITIONS[id]
    expect(p.x * target.zoom + target.x).toBeGreaterThanOrEqual(0)
    expect(
      (p.x + TREE_NAV.nodeWidth) * target.zoom + target.x,
    ).toBeLessThanOrEqual(900)
  }
})
test('scroll interpolation travels diagonally on the selected path', () => {
  const halfway = interpolatePath(['start', 'node'], 0.5)
  expect(halfway).toEqual({ x: 160, y: 160 })
  expect(interpolatePath(['start', 'node'], 9)).toEqual(TREE_POSITIONS.node)
})
