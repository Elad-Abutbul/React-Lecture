import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { useRef } from 'react'
import { render, act } from '@testing-library/react'
import { useGraphStore } from '@/store/graph-store'
import { useGraphCamera } from './useGraphCamera'
vi.mock('./useReducedMotion', () => ({ useReducedMotion: () => false }))
const callbacks = new Map<number, FrameRequestCallback>()
let next = 0
function Camera({ width = 1200 }: { width?: number }) {
  const stage = useRef<HTMLDivElement>(null),
    progress = useRef<HTMLDivElement>(null)
  useGraphCamera(stage, progress, width, 900)
  return (
    <>
      <div ref={stage} data-testid="camera" />
      <div ref={progress} />
    </>
  )
}
function frames(start: number, end: number) {
  for (let now = start; now <= end; now += 16)
    act(() => {
      const pending = [...callbacks.values()]
      callbacks.clear()
      for (const callback of pending) callback(now)
    })
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['performance'] })
  callbacks.clear()
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    callbacks.set(++next, cb)
    return next
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id))
  useGraphStore.getState().reset()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
test('selection leaves camera in place; new input releases and reverses movement without a busy lock', () => {
  const view = render(<Camera />),
    camera = view.getByTestId('camera'),
    motion = useGraphStore.getState().motion
  const x = camera.dataset.cameraX
  act(() => useGraphStore.getState().select('yes'))
  frames(0, 1000)
  expect(camera.dataset.cameraX).toBe(x)
  act(() => motion.scroll(300, 1001))
  frames(1002, 1082)
  const before = Number(camera.dataset.cameraDistance)
  expect(before).toBeGreaterThan(0)
  act(() => motion.scroll(-10, 1083))
  frames(1098, 1114)
  expect(Number(camera.dataset.cameraDistance)).toBeLessThan(before)
  expect(camera.dataset.cameraBusy).toBe('false')
})
test('resizing preserves in-between position and unmount cancels the only frame subscription', () => {
  const view = render(<Camera />),
    motion = useGraphStore.getState().motion
  act(() => useGraphStore.getState().select('yes'))
  act(() => motion.scroll(300, 0))
  frames(0, 1000)
  const distance = motion.position
  view.rerender(<Camera width={800} />)
  expect(motion.position).toBe(distance)
  view.unmount()
  expect(callbacks.size).toBe(0)
  act(() => motion.scroll(200, 1001))
  expect(callbacks.size).toBe(0)
})

function CameraWithReaders({ width = 1200 }: { width?: number }) {
  const stage = useRef<HTMLDivElement>(null),
    progress = useRef<HTMLDivElement>(null),
    route = useGraphStore((s) => s.route),
    cursor = useGraphStore((s) => s.cursor)
  useGraphCamera(stage, progress, width, 900)
  return (
    <div ref={stage}>
      {route.map((id, i) => (
        <section
          key={id}
          data-world-node={id}
          className={i === cursor ? 'graph-node-active' : ''}
        >
          <article
            className="graph-reading"
            tabIndex={0}
            data-testid={`reader-${id}`}
          />
        </section>
      ))}
    </div>
  )
}
test('arrival waits for the matching reader DOM before focusing, without an animation lock', () => {
  const view = render(<CameraWithReaders />),
    store = () => useGraphStore.getState()
  act(() => {
    store().select('yes')
    store().motion.configure(store().route, 1)
  })
  frames(0, 64)
  expect(view.getByTestId('reader-verify')).toHaveFocus()
  expect(store().cursor).toBe(1)
})

test('arrival focus survives resizing after the active cursor changes but before arrival', () => {
  const view = render(<CameraWithReaders />),
    store = () => useGraphStore.getState()
  act(() => {
    store().select('yes')
    store().motion.scroll(1400, 0)
  })
  frames(0, 480)
  expect(store().cursor).toBe(1)
  view.rerender(<CameraWithReaders width={800} />)
  act(() => store().motion.scroll(900, 500))
  frames(500, 3500)
  expect(view.getByTestId('reader-verify')).toHaveFocus()
})

test('revisiting a decision restores its reader top while resize preserves current reading', () => {
  const view = render(<CameraWithReaders />),
    store = () => useGraphStore.getState()
  act(() => {
    store().select('yes')
    store().jump('verify')
  })
  frames(0, 64)
  const reader = view.getByTestId('reader-verify')
  reader.scrollTop = 120
  view.rerender(<CameraWithReaders width={800} />)
  frames(80, 128)
  expect(reader.scrollTop).toBe(120)
  act(() => {
    store().select('done')
    store().jump('project')
  })
  frames(160, 208)
  act(() => store().jump('verify'))
  frames(224, 304)
  expect(view.getByTestId('reader-verify')).toBe(reader)
  expect(reader.scrollTop).toBe(0)
})
