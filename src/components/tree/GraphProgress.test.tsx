import { test, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { GraphProgress } from './GraphProgress'
import { useGraphStore } from '@/store/graph-store'
test('labels and stop markers use the same local workshop coordinate range as the camera bar', () => {
  useGraphStore.getState().reset()
  const view = render(<GraphProgress progressRef={{ current: null }} />)
  expect(screen.getByRole('progressbar', { name: 'בחירת מסלול' })).toBeVisible()
  act(() => {
    useGraphStore.getState().select('workshop')
    useGraphStore.getState().jump('W00')
  })
  expect(
    screen.getByRole('progressbar', { name: 'התקדמות בסדנה' }),
  ).toBeVisible()
  expect(view.container.querySelectorAll('.world-position-stop')).toHaveLength(
    11,
  )
  expect(
    view.container.querySelector('.world-position-stop.is-current'),
  ).toHaveStyle({ left: '0%' })
  act(() => useGraphStore.getState().jump('W10'))
  expect(
    view.container.querySelector('.world-position-stop.is-current'),
  ).toHaveStyle({ left: '100%' })
})
