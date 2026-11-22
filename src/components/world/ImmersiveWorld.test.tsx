import { beforeEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImmersiveWorld } from './ImmersiveWorld'
import { useGraphStore } from '@/store/graph-store'
vi.mock('@/hooks/useGraphCamera', () => ({ useGraphCamera: () => undefined }))
beforeEach(() => {
  localStorage.clear()
  useGraphStore.getState().reset()
})
test('decisions use the same state machine without blocking warnings', () => {
  render(<ImmersiveWorld />)
  fireEvent.keyDown(document.body, { key: 'ArrowRight' })
  expect(useGraphStore.getState().route).toEqual(['node', 'verify'])
  expect(
    screen.getByRole('heading', { name: 'בודקים את ההתקנה ידנית' }),
  ).toBeVisible()
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'הבדיקה הצליחה' }),
  ).not.toBeInTheDocument()
})
test('single-path commands expose copy utilities without progression buttons', () => {
  useGraphStore.getState().jump('enter')
  render(<ImmersiveWorld />)
  expect(
    screen.getByRole('button', { name: 'העתק פקודה: cd my-app' }),
  ).toBeVisible()
  expect(screen.queryByRole('button', { name: 'בוצע' })).not.toBeInTheDocument()
})
