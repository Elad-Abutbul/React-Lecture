import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '@/app/App'
import { COURSE_CONFIG } from '@/constants/course'
test('opens with exactly the lecture-left and hands-on-right decisions', () => {
  render(<App />)
  const main = screen.getByRole('main')

  expect(
    within(main).getByRole('heading', { level: 1, name: COURSE_CONFIG.title }),
  ).toBeVisible()
  expect(
    within(main).queryByRole('button', { name: 'כן' }),
  ).not.toBeInTheDocument()
  expect(main.querySelectorAll('.graph-branch')).toHaveLength(2)
  expect(main.querySelector('[data-direction=left]')).toHaveTextContent('הרצאה')
  expect(main.querySelector('[data-direction=right]')).toHaveTextContent(
    'סדנה מעשית',
  )
  expect(screen.queryByText('המסע שלך')).not.toBeInTheDocument()
})
