import { beforeEach, test, expect, vi, afterEach } from 'vitest'
import { workshopTiming, loadDemoTasks, saveDemoTasks } from './hands-on'
import { HANDS_ON_UNITS } from '@/content/handsOn'
import { HANDS_ON } from '@/constants/handsOn'
import { useHandsOnStore, sanitizeWorkshop } from '@/store/hands-on-store'
beforeEach(() => {
  localStorage.clear()
  useHandsOnStore.getState().reset()
})
afterEach(() => vi.restoreAllMocks())
test('both plans have honest totals and bonuses remain outside the 90-minute plan', () => {
  expect(HANDS_ON_UNITS).toHaveLength(13)
  expect(workshopTiming('H11', 120)).toEqual({
    minutes: 5,
    cumulative: 120,
    total: 120,
  })
  expect(workshopTiming('pause-2', 90)).toEqual({
    minutes: 5,
    cumulative: 90,
    total: 90,
  })
  expect(workshopTiming('H10', 90).cumulative).toBeNull()
})
test('visits never claim external success, hints are bounded, and personal checks persist separately', () => {
  const store = () => useHandsOnStore.getState()
  store().visit('H04')
  expect(store().checked).toEqual([])
  for (let i = 0; i < 8; i++) store().hint('H04')
  expect(store().hints.H04).toBe(3)
  store().check('H04', true)
  store().skip('H04', true)
  expect(store().checked).toEqual([])
  expect(
    JSON.parse(localStorage.getItem(HANDS_ON.storage.key)!).state.skipped,
  ).toEqual(['H04'])
  expect(localStorage.getItem('react-world-navigation')).toBeNull()
  expect(
    sanitizeWorkshop({
      visited: ['H04', 'invalid', null],
      hints: { H04: 99, H07: NaN },
      plan: 90,
    }),
  ).toMatchObject({ visited: ['H04'], hints: { H04: 3 }, plan: 90 })
})
test('task storage validates item shapes and gracefully handles corrupt or blocked storage', () => {
  localStorage.setItem(
    HANDS_ON.demoKey,
    '[{"id":"1","title":"A","done":false},{"id":4}]',
  )
  expect(loadDemoTasks()).toEqual([{ id: '1', title: 'A', done: false }])
  localStorage.setItem(HANDS_ON.demoKey, 'bad JSON')
  expect(loadDemoTasks()).toEqual([])
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  expect(loadDemoTasks()).toEqual([])
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('full')
  })
  expect(saveDemoTasks([])).toBe(false)
})
