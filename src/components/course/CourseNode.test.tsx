import { beforeEach, test, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CourseNode } from './CourseNode'
import { COURSE_CONFIG as C } from '@/constants/course'
import { useCourseStore } from '@/store/course-store'
beforeEach(() => {
  localStorage.clear()
  useCourseStore.setState({ hints: {}, checked: [], answers: {} })
})
test('first hint has explanation without code; full hint reveals working files only on request', async () => {
  const view = render(<CourseNode id="W01" active />)
  expect(
    screen.queryByRole('region', { name: C.labels.solution }),
  ).not.toBeInTheDocument()
  const details = view.container.querySelectorAll('details')
  fireEvent.click(screen.getByText(C.labels.basic))
  details[0].open = true
  fireEvent(details[0], new Event('toggle'))
  await waitFor(() =>
    expect(useCourseStore.getState().hints['W01-basic']).toBe(true),
  )
  expect(details[0].querySelector('pre')).toBeNull()
  details[1].open = true
  fireEvent(details[1], new Event('toggle'))
  await waitFor(() =>
    expect(
      screen.getByRole('region', { name: C.labels.solution }),
    ).toBeVisible(),
  )
  expect(screen.getByText('src/App.tsx')).toBeVisible()
  fireEvent.click(screen.getByRole('checkbox', { name: C.labels.completed }))
  expect(useCourseStore.getState().checked).toEqual(['W01'])
})

test('saved malformed course progress is sanitized without losing usable controls', async () => {
  localStorage.setItem(
    C.storage,
    JSON.stringify({
      state: {
        hints: { 'W01-basic': true, wrong: 42 },
        checked: null,
        answers: { '0': 'Props', bad: 'oops' },
      },
    }),
  )
  await useCourseStore.persist.rehydrate()
  expect(useCourseStore.getState().checked).toEqual([])
  expect(useCourseStore.getState().hints).toEqual({ 'W01-basic': true })
  expect(useCourseStore.getState().answers).toEqual({ '0': 'Props' })
})
