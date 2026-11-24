import { resetLegacyGraph } from '@/test/legacyGraph'
import { beforeEach, test, expect } from 'vitest'
import { useGraphStore, sanitizeGraph } from './graph-store'
const store = () => useGraphStore.getState()
beforeEach(() => resetLegacyGraph())
function backToStart() {
  let now = 0
  for (let n = 0; n < 12 && store().motion.position > 0; n++) {
    store().motion.scroll(-1400, now)
    for (let i = 0; i < 2000; i += 16) {
      store().motion.tick(now + i)
      store().synchronize()
    }
    now += 2200
  }
}
test('backtracking several nodes arms original decisions without dropping their content or history', () => {
  store().select('yes')
  store().jump('verify')
  store().select('done')
  store().jump('project')
  store().select('existing')
  store().jump('existing')
  backToStart()
  expect(store().cursor).toBe(0)
  expect(store().pendingChoices).toEqual(
    expect.arrayContaining(['node', 'verify', 'project']),
  )
  expect(store().choices.node).toBe('yes')
  expect(store().visited).toContain('existing')
  store().select('no')
  expect(store().route).toEqual(['node', 'os'])
  expect(store().choices.node).toBe('no')
  expect(store().pendingChoices).toEqual([])
  expect(store().visited).toContain('existing')
})
test('explicitly choosing the previous branch clears the pending choice without starting travel', () => {
  store().select('yes')
  store().jump('verify')
  store().jump('node')
  expect(store().pendingChoices).toContain('node')
  store().select('yes')
  expect(store().pendingChoices).not.toContain('node')
  expect(store().motion.position).toBe(0)
  expect(store().motion.target).toBe(0)
})
test.each(['yes', 'no'])(
  'choosing %s near a decision does not mistake recentering for backward navigation',
  (edge) => {
    store().select('yes')
    store().motion.scroll(100, 0)
    for (let now = 0; now < 600; now += 16) {
      store().motion.tick(now)
      store().synchronize()
    }
    expect(store().motion.position).toBeGreaterThan(100)
    store().select(edge)
    store().motion.tick(620)
    store().synchronize()
    expect(store().pendingChoices).not.toContain('node')
    expect(store().choices.node).toBe(edge)
    store().motion.scroll(100, 650)
    store().motion.tick(670)
    store().synchronize()
    expect(store().motion.position).toBeGreaterThan(0)
  },
)
test('restoring saved progress asks again at a decision and validates pending identifiers', () => {
  const restored = sanitizeGraph({
    route: ['node', 'verify'],
    cursor: 0,
    visited: ['node', 'verify'],
    pendingChoices: ['missing', 12],
  })
  expect(restored.route).toEqual(['node', 'verify'])
  expect(restored.pendingChoices).toEqual(['node'])
  expect(restored.visited).toContain('verify')
})
