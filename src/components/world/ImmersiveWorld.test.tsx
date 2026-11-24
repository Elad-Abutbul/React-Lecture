import { resetLegacyGraph } from '@/test/legacyGraph'
import { beforeEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ImmersiveWorld } from './ImmersiveWorld'
import { useGraphStore } from '@/store/graph-store'
vi.mock('@/hooks/useGraphCamera', () => ({ useGraphCamera: () => undefined }))
beforeEach(() => {
  localStorage.clear()
  resetLegacyGraph()
})
test('decisions use the same state machine without blocking warnings', () => {
  render(<ImmersiveWorld />)
  fireEvent.keyDown(document.body, { key: 'ArrowRight' })
  expect(useGraphStore.getState().route).toEqual(['node', 'verify'])
  expect(
    screen.getByRole('heading', { name: 'יש לך Node.js מותקן?' }),
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

test('short horizontal intent highlights its branch without changing the route', () => {
  const view = render(<ImmersiveWorld />)
  fireEvent(
    window,
    new WheelEvent('wheel', { deltaX: 80, bubbles: true, cancelable: true }),
  )
  const button = view.container.querySelector('.branch-right')!
  expect(button).toHaveAttribute('data-gesture-intent', 'true')
  expect(button).toHaveTextContent('67%')
  expect(useGraphStore.getState().cursor).toBe(0)
  fireEvent(
    window,
    new WheelEvent('wheel', { deltaX: 80, bubbles: true, cancelable: true }),
  )
  expect(useGraphStore.getState().route[useGraphStore.getState().cursor]).toBe(
    'node',
  )
  expect(useGraphStore.getState().choices.node).toBe('yes')
  expect(view.container.querySelector('[data-gesture-intent]')).toBeNull()
})

test('decision definitions keep their full original content when revisited, independently of the trail', () => {
  const view = render(<ImmersiveWorld />)
  const reader = view.container.querySelector(
    '[data-world-node="node"] .graph-reading',
  )
  fireEvent.keyDown(window, { key: 'ArrowRight' })
  act(() => useGraphStore.getState().jump('existing'))
  expect(
    view.container.querySelector('[data-world-node="node"] .graph-reading'),
  ).toBe(reader)
  act(() => useGraphStore.getState().jump('node'))
  expect(
    screen.getByRole('heading', { name: 'יש לך Node.js מותקן?' }),
  ).toBeVisible()
  expect(
    screen.getByRole('button', { name: /^כן · בדיקת גרסאות/ }),
  ).toBeVisible()
  expect(
    screen.getByRole('button', { name: /^לא · התקנת Node.js/ }),
  ).toBeVisible()
  expect(view.container.querySelector('.graph-ghost')).toBeNull()
  expect(useGraphStore.getState().pendingChoices).toContain('node')
  fireEvent.click(view.container.querySelector('[data-edge-id="no"]')!)
  expect(useGraphStore.getState().choices.node).toBe('no')
  expect(useGraphStore.getState().pendingChoices).not.toContain('node')
})
