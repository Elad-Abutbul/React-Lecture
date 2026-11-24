import { beforeEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from './App'
import { TASK_COPY as C, STORAGE_KEY, BONUS_KEY } from './constants/tasks'
beforeEach(() => localStorage.clear())
test('add, edit, complete, search, filter and delete derive three correct summaries', () => {
  render(<App />)
  expect(screen.getByLabelText(C.total)).toHaveTextContent('8')
  expect(screen.getByLabelText(C.completed)).toHaveTextContent('3')
  fireEvent.change(screen.getByLabelText(C.title), {
    target: { value: '  משימת בדיקה  ' },
  })
  fireEvent.click(screen.getByRole('button', { name: C.add + ' +' }))
  expect(screen.getByLabelText(C.total)).toHaveTextContent('9')
  fireEvent.click(screen.getByLabelText(C.edit + ': משימת בדיקה'))
  fireEvent.change(screen.getByLabelText(C.editTitle), {
    target: { value: 'כותרת חדשה' },
  })
  fireEvent.click(screen.getByRole('button', { name: C.save }))
  fireEvent.change(screen.getByLabelText(C.search), {
    target: { value: 'כותרת חדשה' },
  })
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  fireEvent.click(screen.getByLabelText(C.toggle + ': כותרת חדשה'))
  expect(screen.getByLabelText(C.completed)).toHaveTextContent('4')
  fireEvent.click(
    within(screen.getByRole('group', { name: C.filter })).getByRole('button', {
      name: C.active,
    }),
  )
  expect(screen.getByText(C.empty)).toBeVisible()
  fireEvent.click(
    within(screen.getByRole('group', { name: C.filter })).getByRole('button', {
      name: 'הכול',
    }),
  )
  fireEvent.click(screen.getByLabelText(C.remove + ': כותרת חדשה'))
  expect(screen.getByLabelText(C.total)).toHaveTextContent('8')
  expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
})
test('bonus opt-in persists valid tasks and categories; corrupt or blocked storage remains usable', () => {
  localStorage.setItem(BONUS_KEY, 'true')
  localStorage.setItem(STORAGE_KEY, '{bad json')
  const view = render(<App />)
  expect(screen.getByLabelText(C.total)).toHaveTextContent('8')
  expect(screen.getByLabelText(C.category)).toBeVisible()
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(8)
  view.unmount()
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('blocked')
  })
  expect(() => render(<App />)).not.toThrow()
  spy.mockRestore()
})
test('inactive previews do not write bonus data and blank submissions do not add tasks', () => {
  localStorage.setItem(BONUS_KEY, 'true')
  const spy = vi.spyOn(Storage.prototype, 'setItem')
  render(<App active={false} />)
  fireEvent.change(screen.getByLabelText(C.title), { target: { value: '  ' } })
  fireEvent.click(screen.getByRole('button', { name: C.add + ' +' }))
  expect(screen.getByLabelText(C.total)).toHaveTextContent('8')
  expect(spy).not.toHaveBeenCalled()
  spy.mockRestore()
})
