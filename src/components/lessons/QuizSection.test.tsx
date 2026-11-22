import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizSection } from './QuizSection'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { LESSON_UI } from '@/content/lessons'
test('wrong answers explain the concept and allow a correct retry', () => {
  render(<QuizSection />)
  const q = QUIZ_QUESTIONS[0]
  fireEvent.click(screen.getByRole('button', { name: q.options[1] }))
  expect(screen.getByRole('status')).toHaveTextContent(LESSON_UI.tryAgain)
  expect(screen.getByRole('status')).toHaveTextContent(q.explanation)
  fireEvent.click(screen.getByRole('button', { name: q.options[0] }))
  expect(screen.getByRole('status')).toHaveTextContent(LESSON_UI.correct)
})
