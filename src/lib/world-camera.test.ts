import { test, expect } from 'vitest'
import { interpolateWorld, worldCameraTarget } from './world-camera'
import { WORLD_POSITIONS } from '@/constants/world'
test('the prototype first travels vertically then diagonally', () => {
  const route = ['intro', 'start', 'node']
  expect(WORLD_POSITIONS.intro.x).toBe(WORLD_POSITIONS.start.x)
  expect(WORLD_POSITIONS.node.x).not.toBe(WORLD_POSITIONS.start.x)
  expect(interpolateWorld(route, 1.5).y).toBeGreaterThan(
    WORLD_POSITIONS.start.y,
  )
  expect(interpolateWorld(route, 1.5).x).toBeGreaterThan(
    WORLD_POSITIONS.start.x,
  )
})
test('decision zoom reveals opposite branches without changing choices', () => {
  const target = worldCameraTarget('start', true, 1280, 800)
  expect(target.zoom).toBeLessThan(1)
  expect(WORLD_POSITIONS.why.x).toBeLessThan(WORLD_POSITIONS.start.x)
  expect(WORLD_POSITIONS.node.x).toBeGreaterThan(WORLD_POSITIONS.start.x)
})
