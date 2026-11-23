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

test.each([1, -1])(
  'QA-03: a gradual diagonal wheel trace with jitter and decay commits once (%s)',
  (sign) => {
    const controller = createGraphGesture(),
      results = []
    const acceleration = [
      1.5, 2.5, 5, 9, 14, 20, 28, 35, 40, 36, 28, 20, 12, 8, 4, 2,
    ]
    const packets = [
      ...acceleration,
      ...Array.from({ length: 80 }, (_, i) => 18 * Math.exp(-i / 25)),
    ]
    let selected = false
    for (let i = 0; i < packets.length; i++) {
      const result = controller.sample({
        x: packets[i] * sign,
        y: packets[i] * (i % 2 ? 1.05 : 0.95),
        at: i * 12,
        stop: selected ? 'child' : 'node',
        transitioning: selected && i < 75,
        canReadUp: false,
        canReadDown: false,
        branching: true,
      })
      if (result.kind === 'navigate') {
        results.push(result)
        controller.commit(result.direction)
        selected = true
      }
    }
    expect(results).toEqual([
      { kind: 'navigate', direction: sign > 0 ? 'right' : 'left' },
    ])
  },
)
