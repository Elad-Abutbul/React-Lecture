import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { useRef } from 'react'
import { render, act } from '@testing-library/react'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { useGraphStore } from '@/store/graph-store'
import { useGraphCamera } from './useGraphCamera'
const animation = vi.hoisted(() => ({
  tweens: [] as {
    kill: ReturnType<typeof vi.fn>
    progress: ReturnType<typeof vi.fn>
  }[],
}))
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: (_target: unknown, config: { paused: boolean }) => {
      expect(config.paused).toBe(true)
      const tween = { kill: vi.fn(), progress: vi.fn() }
      animation.tweens.push(tween)
      return tween
    },
  },
}))
vi.mock('./useReducedMotion', () => ({ useReducedMotion: () => false }))
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
beforeEach(() => {
  vi.useFakeTimers()
  // Simulate a browser that does not deliver animation frames at all.
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  animation.tweens.length = 0
  useGraphStore.getState().reset()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
test('cancelled and superseded deadlines cannot unlock a newer camera flight', () => {
  const timers = vi.spyOn(globalThis, 'setTimeout'),
    view = render(<Camera />)
  const first = animation.tweens.at(-1)!,
    stale = timers.mock.calls.at(-1)![0] as () => void
  act(() => useGraphStore.getState().jump('verify'))
  expect(first.kill).toHaveBeenCalledOnce()
  act(stale)
  expect(useGraphStore.getState().transitioning).toBe(true)
  expect(view.getByTestId('camera')).toHaveAttribute('data-camera-busy', 'true')
  act(() => vi.advanceTimersByTime(GRAPH_NAV.camera.duration * 1000))
  expect(useGraphStore.getState().transitioning).toBe(false)
  expect(view.getByTestId('camera')).toHaveAttribute(
    'data-camera-x',
    String(GRAPH_BY_ID.verify.position.x),
  )
  expect(view.getByTestId('camera')).toHaveAttribute(
    'data-camera-y',
    String(GRAPH_BY_ID.verify.position.y),
  )
})
test('resize restarts a single camera flight and unmount cancels its frame and deadline', () => {
  const timers = vi.spyOn(globalThis, 'setTimeout'),
    view = render(<Camera />)
  const first = animation.tweens.at(-1)!,
    stale = timers.mock.calls.at(-1)![0] as () => void
  view.rerender(<Camera width={800} />)
  expect(first.kill).toHaveBeenCalledOnce()
  act(stale)
  expect(useGraphStore.getState().transitioning).toBe(true)
  const current = animation.tweens.at(-1)!,
    completion = timers.mock.calls.at(-1)![0] as () => void
  view.unmount()
  expect(current.kill).toHaveBeenCalledOnce()
  expect(vi.getTimerCount()).toBe(0)
  act(completion)
  expect(useGraphStore.getState().transitioning).toBe(true)
})
