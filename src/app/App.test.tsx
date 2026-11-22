import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'
import { APP_CONTENT } from '@/content/app'

test('renders the application with its Hebrew introduction', () => {
  render(<App />)

  const main = screen.getByRole('main')

  expect(
    within(main).getByRole('heading', { level: 1, name: APP_CONTENT.title }),
  ).toBeVisible()
  expect(within(main).getByText(APP_CONTENT.description)).toBeVisible()
})
