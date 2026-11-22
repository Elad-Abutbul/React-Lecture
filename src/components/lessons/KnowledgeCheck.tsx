import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CheckQuestion } from '@/types/lesson'
import { LESSON_UI } from '@/content/lessons'
export function KnowledgeCheck({ question }: { question: CheckQuestion }) {
  const [answer, setAnswer] = useState<number | null>(null)
  return (
    <fieldset className="knowledge-check">
      <legend className="px-2 text-sm text-violet">{LESSON_UI.check}</legend>
      <p className="font-semibold">{question.prompt}</p>
      <div className="my-4 flex flex-wrap gap-3">
        {question.options.map((option, index) => (
          <Button
            key={option}
            variant={answer === index ? 'secondary' : 'outline'}
            aria-pressed={answer === index}
            className="h-auto min-h-11 whitespace-normal"
            onClick={() => setAnswer(index)}
          >
            {option}
          </Button>
        ))}
      </div>
      <p role="status" className="text-sm text-muted">
        {answer !== null && (
          <>
            <strong
              className={
                answer === question.answer ? 'text-success' : 'text-warning'
              }
            >
              {answer === question.answer
                ? LESSON_UI.correct
                : LESSON_UI.tryAgain}{' '}
            </strong>
            {question.explanation}
          </>
        )}
      </p>
    </fieldset>
  )
}
