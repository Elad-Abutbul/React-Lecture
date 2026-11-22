import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { QUIZ_COPY, QUIZ_QUESTIONS } from '@/content/quiz'
import { KnowledgeCheck } from './KnowledgeCheck'
export function QuizSection() {
  const [id, setId] = useState(QUIZ_QUESTIONS[0].id)
  const question = QUIZ_QUESTIONS.find((q) => q.id === id)!
  return (
    <article className="focus-content learning-focus">
      <h1 className="focus-title">{QUIZ_COPY.title}</h1>
      <p className="focus-description">{QUIZ_COPY.description}</p>
      <Tabs.Root dir="rtl" value={id} onValueChange={setId} data-gesture-ignore>
        <Tabs.List className="scene-tabs" aria-label={QUIZ_COPY.topics}>
          {QUIZ_QUESTIONS.map((q) => (
            <Tabs.Trigger key={q.id} value={q.id}>
              {q.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <KnowledgeCheck key={id} question={question} />
      </Tabs.Root>
    </article>
  )
}
