import { test, expect } from 'vitest'
import { accumulateGesture } from './gesture-engine'
import { GESTURE, BRANCH_DIRECTIONS } from '@/constants/gestures'
const empty = { sum: 0, lastAt: 0 }
test('small horizontal gestures do not choose a branch', () =>
  expect(accumulateGesture(empty, 12, 0, 100).direction).toBeNull())
test('accumulates an intentional right diagonal gesture', () => {
  const a = accumulateGesture(empty, 100, 80, 100)
  expect(a.direction).toBeNull()
  expect(accumulateGesture(a.state, 100, 90, 150).direction).toBe('right')
})
test('supports left gestures without RTL inversion', () =>
  expect(accumulateGesture(empty, -GESTURE.threshold, 0, 100).direction).toBe(
    'left',
  ))
test('vertical wheel gestures never choose a branch', () =>
  expect(accumulateGesture(empty, 30, 200, 100).state.sum).toBe(0))
test('stale intent is discarded', () =>
  expect(
    accumulateGesture(
      { sum: 170, lastAt: 100 },
      20,
      0,
      100 + GESTURE.idleReset + 1,
    ).direction,
  ).toBeNull())
test('physical right maps to yes and physical left to installation', () => {
  expect(BRANCH_DIRECTIONS.node.right.choiceId).toBe('yes')
  expect(BRANCH_DIRECTIONS.node.left.choiceId).toBe('no')
})
