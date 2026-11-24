import { resetLegacyGraph } from '@/test/legacyGraph'
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
  resetLegacyGraph()
})
afterEach(() => vi.useRealTimers())
test('accumulates positive sub-two-pixel wheel samples into a RIGHT branch selection', () => {
  render(<Controller />)
  for (let i = 0; i < 160; i++) wheel(1.5, 0)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'node',
  )
  expect(useGraphStore.getState().choices.node).toBe('yes')
})
test('accumulates negative sub-two-pixel wheel samples into a LEFT branch selection', () => {
  render(<Controller />)
  for (let i = 0; i < 160; i++) wheel(-1.5, 0)
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'node',
  )
  expect(useGraphStore.getState().choices.node).toBe('no')
})
test('does not add vertical movement to the horizontal branch threshold', () => {
  render(<Controller />)
  wheel(0, 110)
  wheel(110, 0)
  expect(useGraphStore.getState().cursor).toBe(0)
})
test('a deliberate horizontal gesture is not swallowed by the previous vertical reading lock', () => {
  useGraphStore.getState().jump('verify')
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
    'verify',
  )
  expect(useGraphStore.getState().choices.verify).toBe('done')
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
test('new keys and wheel input stay responsive during movement; utility controls retain input', () => {
  const view = render(
    <>
      <Controller />
      <input aria-label="utility" />
    </>,
  )
  wheel(240, 0)
  wheel(0, 200)
  const motion = useGraphStore.getState().motion,
    before = motion.target
  fireEvent.keyDown(window, { key: 'ArrowUp' })
  expect(motion.target).toBeLessThan(before)
  const target = motion.target
  fireEvent.keyDown(view.getByRole('textbox'), { key: 'ArrowDown' })
  fireEvent(
    view.getByRole('textbox'),
    new WheelEvent('wheel', { deltaY: 200, bubbles: true, cancelable: true }),
  )
  expect(motion.target).toBe(target)
})
test('touch samples move proportionally after selection and touchcancel ends the drag', () => {
  render(<Controller />)
  const touch = (type: string, x: number, y = 300) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'touches', {
      value: [{ clientX: x, clientY: y }],
    })
    fireEvent(window, event)
  }
  touch('touchstart', 300)
  touch('touchmove', 100)
  expect(useGraphStore.getState().choices.node).toBe('yes')
  expect(useGraphStore.getState().motion.target).toBe(0)
  touch('touchmove', 50)
  expect(useGraphStore.getState().motion.target).toBeGreaterThan(0)
  const target = useGraphStore.getState().motion.target
  touch('touchcancel', 50)
  touch('touchmove', 0)
  expect(useGraphStore.getState().motion.target).toBe(target)
})

test.each([
  ['done', 1100],
  ['error', 600],
] as const)(
  'QA-02: a stale %s overlay cannot steal wheel input inside the reader',
  (edge, x) => {
    useGraphStore.getState().jump('verify')
    function Overlap() {
      useGraphGesture()
      return (
        <>
          <div className="graph-node-active">
            <article className="graph-reading" />
          </div>
          <button data-edge-id={edge}>branch overlay</button>
        </>
      )
    }
    const view = render(<Overlap />),
      reading = view.container.querySelector<HTMLElement>('.graph-reading')!
    Object.defineProperties(reading, {
      clientHeight: { value: 100 },
      scrollHeight: { value: 500 },
    })
    vi.spyOn(reading, 'getBoundingClientRect').mockReturnValue({
      x: 400,
      y: 200,
      left: 400,
      top: 200,
      width: 800,
      height: 300,
      right: 1200,
      bottom: 500,
      toJSON: () => ({}),
    })
    fireEvent(
      view.getByRole('button'),
      new WheelEvent('wheel', {
        deltaY: 300,
        clientX: x,
        clientY: 420,
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(
      useGraphStore.getState().route[useGraphStore.getState().cursor],
    ).toBe('verify')
    expect(reading.scrollTop).toBe(300)
  },
)

test('QA-01/03: selecting either branch after a keyboard return does not mix wheel axes', () => {
  render(<Controller />)
  wheel(240, 0)
  expect(useGraphStore.getState().choices.node).toBe('yes')
  fireEvent.keyDown(window, { key: 'ArrowUp' })
  wheel(-300, 350)
  expect(useGraphStore.getState().choices.node).toBe('no')
  expect(useGraphStore.getState().motion.position).toBe(0)
})

test('zero wheel packets cannot release an idle magnetic stop', () => {
  render(<Controller />)
  const motion = useGraphStore.getState().motion
  motion.tick(0)
  expect(motion.snapping).toBe(true)
  wheel(0, 0)
  expect(motion.snapping).toBe(true)
})

test('after choosing a focused branch, vertical arrow keys still move the camera', () => {
  const view = render(
    <>
      <Controller />
      <button onClick={() => useGraphStore.getState().select('yes')}>
        choose
      </button>
    </>,
  )
  const button = view.getByRole('button')
  button.focus()
  fireEvent.click(button)
  fireEvent.keyDown(button, { key: 'ArrowDown' })
  expect(useGraphStore.getState().motion.target).toBeGreaterThan(0)
})
