import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import {
  createRoot,
  _roots,
  advance,
  type RootState,
} from '@react-three/fiber/dist/react-three-fiber.esm.js'
beforeEach(() => vi.useFakeTimers({ toFake: ['performance'] }))
afterEach(() => {
  _roots.clear()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
test('OBS-01: a fresh renderer uses Timer without a deprecated Clock warning and keeps frame timing', () => {
  const warnings = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined),
    canvas = document.createElement('canvas')
  createRoot(canvas)
  const store = _roots.get(canvas)!.store,
    clock = store.getState().clock
  store.setState({ gl: { xr: { isPresenting: false } } as RootState['gl'] })
  expect(
    warnings.mock.calls.filter((args) => String(args[0]).includes('Clock:')),
  ).toEqual([])
  clock.start()
  vi.advanceTimersByTime(100)
  expect(clock.getDelta()).toBeCloseTo(0.1, 5)
  expect(clock.elapsedTime).toBeCloseTo(0.1, 5)
  clock.stop()
  vi.advanceTimersByTime(500)
  expect(clock.getDelta()).toBe(0)
  clock.start()
  expect(clock.elapsedTime).toBe(0)
  vi.advanceTimersByTime(50)
  expect(clock.getElapsedTime()).toBeCloseTo(0.05, 5)
  store.getState().setFrameloop('never')
  expect(clock.elapsedTime).toBe(0)
  expect(clock.running).toBe(false)
  store.getState().setFrameloop('demand')
  vi.advanceTimersByTime(25)
  expect(clock.getDelta()).toBeCloseTo(0.025, 5)
})

test('OBS-01: manually advanced renderer frames retain delta and elapsed semantics', () => {
  const warnings = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined),
    canvas = document.createElement('canvas')
  createRoot(canvas)
  const store = _roots.get(canvas)!.store,
    state = store.getState(),
    deltas: number[] = []
  store.setState({ gl: { xr: { isPresenting: false } } as RootState['gl'] })
  state.setFrameloop('never')
  const unsubscribe = state.internal.subscribe(
    { current: (_state, delta) => deltas.push(delta) },
    1,
    store,
  )
  advance(2.5, false, store.getState())
  advance(3, false, store.getState())
  expect(deltas).toEqual([2.5, 0.5])
  expect(state.clock.oldTime).toBe(2.5)
  expect(state.clock.elapsedTime).toBe(3)
  expect(
    warnings.mock.calls.filter((args) => String(args[0]).includes('Clock:')),
  ).toEqual([])
  unsubscribe()
})
