import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropsDemo } from './PropsDemo'
import { PROPS_UI } from '@/content/lessons'
test('changing parent input changes only its corresponding child', () => {
  render(<PropsDemo />)
  fireEvent.change(screen.getByLabelText(PROPS_UI.label), {
    target: { value: 'נועה' },
  })
  expect(screen.getByRole('heading', { name: 'שלום, נועה' })).toBeVisible()
  expect(
    screen.getByRole('heading', { name: PROPS_UI.greeting + PROPS_UI.second }),
  ).toBeVisible()
})
