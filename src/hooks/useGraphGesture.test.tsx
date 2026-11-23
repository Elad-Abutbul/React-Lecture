import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { StrictMode } from 'react'
import { useGraphGesture } from './useGraphGesture'
import { useGraphStore } from '@/store/graph-store'
function Controller() {
  useGraphGesture()
  return null
}
function wheel(x: number, y: number, ms = 8) {
  vi.advanceTimersByTime(ms)
  fireEvent(
    window,
    new WheelEvent('wheel', {
      deltaX: x,
      deltaY: y,
      bubbles: true,
      cancelable: true,
    }),
  )
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['performance'] })
  localStorage.clear()
  useGraphStore.getState().reset()
})
afterEach(() => vi.useRealTimers())
test('accumulates positive sub-two-pixel wheel samples into a RIGHT branch selection', () => {
  render(<Controller />)
  for (let i = 0; i < 160; i++) wheel(1.5, 0)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'verify',
  )
})
test('accumulates negative sub-two-pixel wheel samples into a LEFT branch selection', () => {
  render(<Controller />)
  for (let i = 0; i < 160; i++) wheel(-1.5, 0)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'os',
  )
})
test('does not add vertical movement to the horizontal branch threshold', () => {
  render(<Controller />)
  wheel(0, 110)
  wheel(110, 0)
  expect(useGraphStore.getState().cursor).toBe(0)
})
test('a deliberate horizontal gesture is not swallowed by the previous vertical reading lock', () => {
  useGraphStore.getState().jump('verify')
  useGraphStore.getState().arrive()
  function ReadingController() {
    useGraphGesture()
    return (
      <div className="graph-node-active">
        <article className="graph-reading" />
      </div>
    )
  }
  const view = render(<ReadingController />),
    reader = view.container.querySelector('.graph-reading')!
  Object.defineProperties(reader, {
    clientHeight: { value: 100 },
    scrollHeight: { value: 500 },
  })
  wheel(0, 40)
  wheel(220, 0, 80)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'project',
  )
})
test('StrictMode remount registers one controller and unmount removes every listener', () => {
  const add = vi.spyOn(window, 'addEventListener'),
    remove = vi.spyOn(window, 'removeEventListener')
  const view = render(
    <StrictMode>
      <Controller />
    </StrictMode>,
  )
  const types = [
    'wheel',
    'keydown',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
  ]
  for (const type of types) {
    const additions = add.mock.calls.filter(([name]) => name === type)
    const removals = remove.mock.calls.filter(([name]) => name === type)
    expect(additions.length - removals.length, type).toBe(1)
  }
  view.unmount()
  for (const type of types) {
    const additions = add.mock.calls.filter(([name]) => name === type)
    const removals = remove.mock.calls.filter(([name]) => name === type)
    expect(removals.map(([, handler]) => handler)).toEqual(
      additions.map(([, handler]) => handler),
    )
  }
  wheel(240, 0)
  expect(useGraphStore.getState().cursor).toBe(0)
  add.mockRestore()
  remove.mockRestore()
})
test('busy keys cannot navigate or start native scrolling, and ignored controls retain input', () => {
  const view = render(
    <>
      <Controller />
      <input aria-label="utility" />
    </>,
  )
  wheel(240, 0)
  const revision = useGraphStore.getState().revision
  const key = new KeyboardEvent('keydown', {
    key: 'ArrowLeft',
    bubbles: true,
    cancelable: true,
  })
  fireEvent(window, key)
  expect(key.defaultPrevented).toBe(true)
  expect(useGraphStore.getState().revision).toBe(revision)
  useGraphStore.getState().arrive()
  fireEvent.keyDown(view.getByRole('textbox'), { key: 'ArrowLeft' })
  fireEvent(
    view.getByRole('textbox'),
    new WheelEvent('wheel', { deltaX: -240, bubbles: true, cancelable: true }),
  )
  expect(useGraphStore.getState().revision).toBe(revision)
})

test('held navigation keys are consumed and touches begun during flight cannot leak into the next stop', () => {
  render(<Controller />)
  wheel(240, 0)
  const revision = useGraphStore.getState().revision
  const repeat = new KeyboardEvent('keydown', {
    key: 'ArrowRight',
    repeat: true,
    cancelable: true,
  })
  fireEvent(window, repeat)
  expect(repeat.defaultPrevented).toBe(true)
  function touch(type: string, x: number) {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'touches', {
      value: [{ clientX: x, clientY: 300 }],
    })
    fireEvent(window, event)
  }
  touch('touchstart', 300)
  useGraphStore.getState().arrive()
  touch('touchmove', 50)
  expect(useGraphStore.getState().revision).toBe(revision)
  touch('touchstart', 300)
  touch('touchcancel', 300)
  touch('touchmove', 50)
  expect(useGraphStore.getState().revision).toBe(revision)
  touch('touchstart', 300)
  touch('touchmove', 50)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'project',
  )
})
