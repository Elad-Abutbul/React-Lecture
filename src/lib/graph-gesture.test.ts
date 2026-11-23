import { test, expect } from 'vitest'
import { createGraphGesture, type WheelSample } from './graph-gesture'
function session() {
  const engine = createGraphGesture()
  let at = 0
  return {
    engine,
    sample(x: number, y: number, extra: Partial<WheelSample> = {}, ms = 8) {
      at += ms
      const result = engine.sample({
        x,
        y,
        at,
        stop: 'a',
        transitioning: false,
        canReadUp: false,
        canReadDown: false,
        branching: true,
        ...extra,
      })
      if (result.kind === 'navigate') engine.commit(result.direction)
      return result
    },
  }
}
test.each([1, -1])(
  'high-resolution samples accumulate with physical sign %s',
  (sign) => {
    const s = session(),
      results = Array.from({ length: 300 }, () => s.sample(sign * 1.5, 0))
    expect(results.filter((r) => r.kind === 'navigate')).toEqual([
      { kind: 'navigate', direction: sign > 0 ? 'right' : 'left' },
    ])
  },
)
test('axis changes do not share a threshold, and small jitter cannot flip intent', () => {
  const s = session()
  expect(s.sample(0, 110).kind).toBe('none')
  expect(s.sample(110, 0).kind).toBe('none')
  expect(s.sample(-1, 0).kind).toBe('none')
  expect(s.sample(71, 0)).toEqual({ kind: 'navigate', direction: 'right' })
})
test.each([
  [240, 150, 'right'],
  [-240, 150, 'left'],
  [100, 240, 'down'],
  [-100, -240, 'up'],
] as const)('dominant diagonal %s/%s resolves to %s', (x, y, direction) => {
  expect(session().sample(x, y)).toEqual({ kind: 'navigate', direction })
})
test('balanced downward diagonal chooses its horizontal branch once', () => {
  const s = session(),
    results = Array.from({ length: 50 }, () => s.sample(20, 20))
  expect(results.filter((r) => r.kind === 'navigate')).toEqual([
    { kind: 'navigate', direction: 'right' },
  ])
})
test('one long burst and decaying momentum cannot skip a second stop', () => {
  const s = session()
  expect(s.sample(240, 0).kind).toBe('navigate')
  for (let i = 0; i < 60; i++)
    expect(
      s.sample(100, 0, { stop: 'b', transitioning: i < 30 }, 20).kind,
    ).toBe('none')
  for (let i = 30; i > 0; i--)
    expect(s.sample(i, 0, { stop: 'b' }, 20).kind).toBe('none')
  expect(s.sample(240, 0, { stop: 'b' }, 300)).toEqual({
    kind: 'navigate',
    direction: 'right',
  })
})
test('busy input is consumed without leaving navigation permanently locked', () => {
  const s = session()
  expect(s.sample(0, 240, { transitioning: true }).kind).toBe('none')
  expect(s.sample(0, 240).kind).toBe('none')
  expect(s.sample(0, 240, {}, 300)).toEqual({
    kind: 'navigate',
    direction: 'down',
  })
})
test('deliberate reversal works after arrival, while elastic bounce does not', () => {
  const s = session()
  s.sample(0, 240)
  expect(s.sample(0, -15, { stop: 'b' }).kind).toBe('none')
  expect(s.sample(0, 5, { stop: 'b' }).kind).toBe('none')
  expect(s.sample(0, -180, { stop: 'b' })).toEqual({
    kind: 'navigate',
    direction: 'up',
  })
})
test('a reading gesture stays in its reader through its boundary; a fresh gesture advances', () => {
  const s = session()
  expect(s.sample(0, 40, { canReadDown: true })).toEqual({
    kind: 'read',
    delta: 40,
  })
  expect(s.sample(0, 500)).toEqual({ kind: 'read', delta: 500 })
  expect(s.sample(0, 200, {}, 300)).toEqual({
    kind: 'navigate',
    direction: 'down',
  })
})
test('horizontal intent exits reading, and reading momentum cannot leak to another stop', () => {
  const s = session()
  s.sample(0, 40, { canReadDown: true })
  expect(s.sample(190, 0, { canReadDown: true })).toEqual({
    kind: 'navigate',
    direction: 'right',
  })
  expect(s.sample(0, 400, { stop: 'b', canReadDown: true }).kind).toBe('none')
  expect(s.sample(0, 40, { stop: 'b', canReadDown: true }, 300)).toEqual({
    kind: 'read',
    delta: 40,
  })
})
test('zero and invalid samples never prolong momentum lock', () => {
  const s = session()
  s.sample(240, 0)
  expect(s.sample(0, 0, {}, 200).kind).toBe('none')
  expect(s.sample(NaN, 0, {}, 20).kind).toBe('none')
  expect(s.sample(240, 0, {}, 30).kind).toBe('navigate')
})
