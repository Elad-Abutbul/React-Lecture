import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EffectDemo } from './EffectDemo'
import { EFFECT_UI } from '@/content/lessons'
test('synchronizes title and restores it on unmount', () => {
  document.title = 'Original'
  const view = render(<EffectDemo />)
  expect(document.title).toBe(EFFECT_UI.prefix + '0')
  fireEvent.click(screen.getByRole('button', { name: EFFECT_UI.increment }))
  expect(document.title).toBe(EFFECT_UI.prefix + '1')
  view.unmount()
  expect(document.title).toBe('Original')
})
