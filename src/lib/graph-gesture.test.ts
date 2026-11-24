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
  expect(s.sample(0, 400, { stop: 'b', canReadDown: true })).toEqual({
    kind: 'read',
    delta: 400,
  })
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

test('QA-03: short travel exposes progress and a deliberate opposite direction resets intent', () => {
  const s = session()
  expect(s.sample(80, 0).kind).toBe('none')
  expect(s.engine.preview()).toEqual({ direction: 'right', progress: 2 / 3 })
  expect(s.sample(-40, 0).kind).toBe('none')
  expect(s.engine.preview()).toEqual({ direction: 'left', progress: 1 / 3 })
  expect(s.sample(-80, 0)).toEqual({ kind: 'navigate', direction: 'left' })
  expect(s.engine.preview()).toBeNull()
})
test('QA-03: five short packets form one command, while quiet starts a new intent', () => {
  const s = session(),
    results = Array.from({ length: 5 }, () => s.sample(80, 0))
  expect(results.filter((r) => r.kind === 'navigate')).toHaveLength(1)
  expect(s.sample(80, 0, {}, 300).kind).toBe('none')
  expect(s.engine.preview()?.progress).toBe(2 / 3)
  expect(s.sample(40, 0)).toEqual({ kind: 'navigate', direction: 'right' })
})

test.each([1, -1])(
  'QA-03: partial intent survives short pauses without extending the navigation momentum lock (%s)',
  (sign) => {
    const s = session()
    s.sample(sign * 80, 0)
    expect(s.sample(sign * 40, 0, {}, 350)).toEqual({
      kind: 'navigate',
      direction: sign > 0 ? 'right' : 'left',
    })
    expect(s.engine.preview()).toBeNull()
    // An accepted gesture still re-arms after the original short quiet interval.
    expect(s.sample(sign * 120, 0, {}, 300)).toEqual({
      kind: 'navigate',
      direction: sign > 0 ? 'right' : 'left',
    })
    const expired = session()
    expired.sample(sign * 80, 0)
    expect(expired.sample(sign * 40, 0, {}, 700).kind).toBe('none')
    expect(expired.engine.preview()?.progress).toBe(1 / 3)
  },
)

test('arrival momentum can read content without becoming a new branch decision', () => {
  const engine = createGraphGesture()
  engine.sample({
    x: 0,
    y: 240,
    at: 0,
    stop: 'before',
    transitioning: true,
    branching: false,
    canReadUp: false,
    canReadDown: false,
  })
  expect(
    engine.sample({
      x: 0,
      y: 50,
      at: 16,
      stop: 'after',
      transitioning: false,
      branching: true,
      canReadUp: false,
      canReadDown: true,
    }),
  ).toEqual({ kind: 'read', delta: 50 })
})

test('a classifier change at arrival cannot turn the same diagonal momentum into a second choice', () => {
  const engine = createGraphGesture()
  const sample = (
    stop: string,
    at: number,
    between: boolean,
    branching: boolean,
    reading = false,
  ) =>
    engine.sample({
      x: 600,
      y: 650,
      at,
      stop,
      transitioning: between,
      branching,
      canReadDown: reading,
      canReadUp: false,
    })
  sample('windows', 0, true, false)
  sample('verify', 32, true, false)
  expect(sample('verify', 64, false, false, true).kind).toBe('read')
  expect(sample('verify', 96, false, true, true).kind).toBe('none')
  expect(engine.preview()).toBeNull()
  expect(sample('verify', 400, false, true).kind).toBe('navigate')
})
