import { test, expect } from 'vitest'
import { createGraphMotion, criticalSpring } from './graph-motion'
import { createGraphPath, graphCurve } from './graph-path'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_MOTION as C } from '@/constants/graphMotion'
const route = ['node', 'verify', 'project']
function settle(
  motion: ReturnType<typeof createGraphMotion>,
  start = 0,
  end = start + 3000,
) {
  for (let now = start; now <= end; now += 16) motion.tick(now)
}
function between() {
  const motion = createGraphMotion(route)
  motion.scroll(400, 0)
  settle(motion)
  return motion
}
test.each([2, 20, 200])(
  'between nodes %s pixels stays proportional without attracting empty space',
  (pixels) => {
    const motion = between(),
      before = motion.position
    motion.scroll(pixels, 4000)
    expect(motion.target - before).toBeCloseTo(pixels * C.pixelsPerWheelUnit)
    settle(motion, 4000)
    expect(motion.position).toBeCloseTo(before + pixels * C.pixelsPerWheelUnit)
    expect(motion.snapping).toBe(false)
  },
)
test('branch configuration does not start travel to its destination', () => {
  const motion = createGraphMotion(['node'])
  motion.configure(['node', 'verify'])
  settle(motion)
  expect(motion.position).toBe(0)
  expect(motion.point).toMatchObject(GRAPH_BY_ID.node.position)
})
test('incidental jitter stays captured while deliberate input releases immediately', () => {
  const motion = createGraphMotion(route)
  for (let i = 0; i < 100; i++) {
    motion.scroll(i % 2 ? -2 : 2, i * 16)
    motion.tick(i * 16)
  }
  expect(motion.position).toBe(0)
  expect(motion.snapping).toBe(true)
  motion.scroll(80, 2000)
  expect(motion.snapping).toBe(false)
  expect(motion.target).toBeCloseTo(80 * C.pixelsPerWheelUnit)
  motion.tick(2016)
  expect(motion.position).toBeGreaterThan(0)
})
test('coherent fractional input accumulates through release without dropping its distance', () => {
  const motion = createGraphMotion(route)
  for (let i = 0; i < 20; i++) motion.scroll(1.5, i * 12)
  expect(motion.target).toBeCloseTo(30 * C.pixelsPerWheelUnit)
  expect(motion.snapping).toBe(false)
})
test.each([-1, 1])(
  'approaching a content node from direction %s captures a generous readable region',
  (sign) => {
    const motion = createGraphMotion(route, 1),
      stop = motion.position
    motion.scroll(sign * 300, 0)
    settle(motion)
    expect(motion.position).toBeCloseTo(stop + sign * 435)
    motion.scroll(-sign * 150, 4000)
    settle(motion, 4000, 8000)
    expect(motion.position).toBe(stop)
    expect(motion.snapping).toBe(true)
  },
)
test('hysteresis allows deliberate departure and rearms after leaving or returning', () => {
  const motion = createGraphMotion(route)
  motion.scroll(80, 0)
  settle(motion)
  expect(motion.position).toBeCloseTo(116)
  expect(motion.snapping).toBe(false)
  motion.scroll(160, 4000)
  settle(motion, 4000)
  expect(motion.position).toBeCloseTo(348)
  motion.scroll(-100, 8000)
  settle(motion, 8000, 12000)
  expect(motion.position).toBe(0)
  expect(motion.snapping).toBe(true)
})
test('small reversal between nodes follows input instead of targeting the previous stop', () => {
  const motion = between()
  motion.scroll(300, 4000)
  motion.tick(4016)
  const position = motion.position
  motion.scroll(-4, 4017)
  expect(motion.target).toBeCloseTo(position - 4 * C.pixelsPerWheelUnit)
  motion.tick(4033)
  expect(motion.position).toBeLessThan(position)
  expect(motion.position).toBeGreaterThan(0)
})
test('selecting a branch near a decision preserves the viewpoint and gently restores its framing', () => {
  const motion = createGraphMotion(['node', 'verify'])
  motion.scroll(100, 0)
  settle(motion)
  const before = motion.point
  motion.configure(['node', 'os'])
  expect(motion.point.x).toBeCloseTo(before.x)
  expect(motion.point.y).toBeCloseTo(before.y)
  expect(motion.position).toBe(0)
  motion.tick(4000)
  expect(
    Math.hypot(motion.point.x - before.x, motion.point.y - before.y),
  ).toBeLessThan(20)
  settle(motion, 4000, 8000)
  expect(motion.point).toMatchObject(GRAPH_BY_ID.node.position)
  expect(motion.target).toBe(0)
})
test('momentum remains proportional and bounded without an invented inertial impulse', () => {
  const motion = between(),
    before = motion.position,
    packets = [2, 8, 20, 40, 32, 20, 10, 4, 1]
  for (let i = 0; i < packets.length; i++) {
    motion.scroll(packets[i], 4000 + i * 16)
    motion.tick(4000 + i * 16)
  }
  expect(motion.target).toBeCloseTo(
    before + packets.reduce((a, b) => a + b) * C.pixelsPerWheelUnit,
  )
  const position = motion.position
  motion.scroll(-12, 5000)
  motion.tick(5016)
  expect(motion.position).toBeLessThan(position)
})
test('large packets and route endpoints cannot overshoot', () => {
  const motion = createGraphMotion(['node', 'verify'])
  motion.scroll(100000, 0)
  motion.tick(16, true)
  expect(motion.position).toBe(C.maxInput * C.pixelsPerWheelUnit)
  motion.scroll(100000, 32)
  motion.tick(48, true)
  expect(motion.position).toBeLessThanOrEqual(motion.path.length)
})
test('reduced motion keeps local magnetic positioning gentle', () => {
  const motion = createGraphMotion(route)
  motion.scroll(80, 0)
  motion.tick(16, true)
  motion.scroll(-30, 32)
  motion.tick(48, true)
  const before = motion.position
  motion.tick(500, true)
  motion.tick(516, true)
  expect(motion.snapping).toBe(true)
  expect(motion.position).toBeLessThan(before)
  expect(motion.position).toBeGreaterThan(0)
})
test('a delayed frame realizes deliberate input before considering another capture', () => {
  const motion = createGraphMotion(route)
  motion.scroll(80, 0)
  motion.tick(1000)
  expect(motion.position).toBeGreaterThan(0)
  expect(motion.snapping).toBe(false)
})
test('shared curve geometry reaches exact endpoints and stays continuous backwards', () => {
  const a = GRAPH_BY_ID.node.position,
    b = GRAPH_BY_ID.verify.position,
    path = createGraphPath(['node', 'verify'])
  expect(graphCurve(a, b, 0)).toEqual(a)
  expect(graphCurve(a, b, 1)).toEqual(b)
  expect(path.at(path.length)).toMatchObject(b)
  const p = path.at(path.length / 2),
    q = path.at(path.length / 2 - 1)
  expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeCloseTo(1, 2)
})
test('arrival spring remains monotonic and reverses without bouncing', () => {
  let frame = { value: 0, velocity: 0 }
  for (let i = 0; i < 80; i++) {
    const next = criticalSpring(
      frame.value,
      frame.velocity,
      1,
      0.016,
      C.revealFrequency,
    )
    expect(next.value).toBeGreaterThanOrEqual(frame.value)
    expect(next.value).toBeLessThanOrEqual(1)
    frame = next
  }
  expect(frame.value).toBeCloseTo(1, 5)
  frame = criticalSpring(
    frame.value,
    frame.velocity,
    0,
    0.016,
    C.revealFrequency,
  )
  expect(frame.value).toBeLessThan(1)
  expect(frame.value).toBeGreaterThan(0.9)
})

test('a frame loop may finish only after endpoint velocity also settles', () => {
  const motion = createGraphMotion(['node', 'verify'])
  motion.scroll(1400, 0)
  settle(motion, 0, 480)
  motion.scroll(900, 500)
  for (let now = 500; now < 4000; now += 16) {
    const alive = motion.tick(now)
    if (!alive)
      expect(Math.abs(motion.velocity)).toBeLessThanOrEqual(C.settleVelocity)
  }
  expect(motion.position).toBe(motion.path.length)
})
