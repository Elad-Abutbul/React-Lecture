import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ExerciseNode } from './ExerciseNode'
import { CodeSnippet } from './CodeSnippet'
import { WorkshopTaskBoard } from './WorkshopTaskBoard'
import { InstructorMode } from './InstructorMode'
import { useHandsOnStore } from '@/store/hands-on-store'
import { HANDS_ON_SOLUTIONS } from '@/content/handsOnSolutions'
import { HANDS_ON_COPY as COPY } from '@/constants/handsOn'
const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
beforeEach(() => {
  localStorage.clear()
  useHandsOnStore.getState().reset()
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})
afterEach(() => {
  vi.useRealTimers()
  if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard)
  else Reflect.deleteProperty(navigator, 'clipboard')
})
test('solution remains hidden behind two hints, exact full source copies without navigating', async () => {
  render(<ExerciseNode id="H04" />)
  expect(screen.queryByText(COPY.source)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: COPY.hints }))
  fireEvent.click(screen.getByRole('button', { name: COPY.hint1 }))
  fireEvent.click(screen.getByRole('button', { name: COPY.hint2 }))
  expect(screen.queryByText(COPY.source)).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: COPY.solution }))
  fireEvent.click(screen.getByRole('button', { name: COPY.copy }))
  await waitFor(() =>
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      HANDS_ON_SOLUTIONS.H04['src/App.tsx'],
    ),
  )
  expect(useHandsOnStore.getState().checked).toEqual([])
})
test('copy failures explain a download alternative instead of claiming success', async () => {
  vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
    new Error('blocked'),
  )
  render(<CodeSnippet code="exact source" filename="App.tsx" />)
  fireEvent.click(screen.getByRole('button', { name: COPY.copy }))
  await waitFor(() =>
    expect(screen.getByRole('status')).toHaveTextContent(COPY.copyFailed),
  )
})
test('the live task board adds trims toggles and restores tasks on remount', () => {
  const view = render(<WorkshopTaskBoard />)
  fireEvent.change(screen.getByRole('textbox', { name: COPY.newTask }), {
    target: { value: '  My task  ' },
  })
  fireEvent.click(screen.getByRole('button', { name: COPY.addTask }))
  expect(screen.getByText('My task')).toBeVisible()
  fireEvent.click(screen.getByRole('checkbox'))
  expect(screen.getByText(`${COPY.remaining}: 0`)).toBeVisible()
  view.unmount()
  render(<WorkshopTaskBoard />)
  expect(screen.getByRole('checkbox')).toBeChecked()
})
test('instructor timer starts manually and never advances navigation', () => {
  vi.useFakeTimers()
  const view = render(<InstructorMode id="H04" />)
  fireEvent.click(screen.getByText(COPY.instructor, { selector: 'summary' }))
  act(() => vi.advanceTimersByTime(3000))
  expect(screen.getByText('10:00')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: COPY.start }))
  act(() => vi.advanceTimersByTime(2000))
  expect(screen.getByText('9:58')).toBeInTheDocument()
  view.unmount()
  expect(vi.getTimerCount()).toBe(0)
})
