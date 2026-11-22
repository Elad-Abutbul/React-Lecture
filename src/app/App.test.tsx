import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'
import { JOURNEY_NODES, JOURNEY_START } from '@/content/journey'
test('opens with a large accessible Node.js decision and no yes/no click buttons', () => {
  render(<App />)
  const main = screen.getByRole('main')
  const node = JOURNEY_NODES.find((n) => n.id === JOURNEY_START)!
  expect(
    within(main).getByRole('heading', { level: 1, name: node.title }),
  ).toBeVisible()
  expect(
    within(main).queryByRole('button', { name: 'כן' }),
  ).not.toBeInTheDocument()
  expect(screen.queryByText('המסע שלך')).not.toBeInTheDocument()
})
