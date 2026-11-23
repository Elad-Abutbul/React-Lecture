import { test, expect } from 'vitest'
import { createGraphGesture, type WheelSample } from './graph-gesture'
test.each([
  [650, 650, 'right'],
  [-650, 650, 'left'],
  [300, 350, 'right'],
  [-300, 350, 'left'],
  [650, -650, 'up'],
] as const)('QA-01: %s/%s resolves to %s at a decision', (x, y, direction) => {
  const input: WheelSample & { branching: boolean } = {
    x,
    y,
    at: 0,
    stop: 'node',
    transitioning: false,
    canReadUp: false,
    canReadDown: false,
    branching: true,
  }
  expect(createGraphGesture().sample(input)).toEqual({
    kind: 'navigate',
    direction,
  })
})
