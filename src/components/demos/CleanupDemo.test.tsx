import { afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CleanupDemo } from './CleanupDemo'
import { TIMER_UI } from '@/content/lessons'
afterEach(() => vi.useRealTimers())
test('stopping and removing the component clear its interval', () => {
  vi.useFakeTimers()
  const view = render(<CleanupDemo />)
  fireEvent.click(screen.getByRole('button', { name: TIMER_UI.start }))
  act(() => vi.advanceTimersByTime(3100))
  expect(screen.getByLabelText(TIMER_UI.seconds)).toHaveTextContent('3')
  fireEvent.click(screen.getByRole('button', { name: TIMER_UI.stop }))
  expect(vi.getTimerCount()).toBe(0)
  fireEvent.click(screen.getByRole('button', { name: TIMER_UI.start }))
  fireEvent.click(screen.getByRole('button', { name: TIMER_UI.remove }))
  expect(vi.getTimerCount()).toBe(0)
  view.unmount()
  expect(vi.getTimerCount()).toBe(0)
})
