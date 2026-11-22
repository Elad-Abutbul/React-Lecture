import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'
import { HERO } from '@/content/hero'

test('renders the application with its Hebrew introduction', () => {
  render(<App />)

  const main = screen.getByRole('main')

  expect(
    within(main).getByRole('heading', { level: 1, name: HERO.title }),
  ).toBeVisible()
  expect(within(main).getByText(HERO.description)).toBeVisible()
})
