import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CounterDemo } from './CounterDemo'
import { STATE_UI } from '@/content/lessons'
test('state changes the rendered value while a local variable does not', () => {
  render(<CounterDemo />)
  fireEvent.click(screen.getByRole('button', { name: STATE_UI.addPlain }))
  expect(screen.getByLabelText(STATE_UI.plainValue)).toHaveTextContent('0')
  fireEvent.click(screen.getByRole('button', { name: STATE_UI.addState }))
  fireEvent.click(screen.getByRole('button', { name: STATE_UI.addState }))
  expect(screen.getByLabelText(STATE_UI.stateValue)).toHaveTextContent('2')
})
