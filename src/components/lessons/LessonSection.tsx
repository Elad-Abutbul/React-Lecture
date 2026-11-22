import type { ReactNode } from 'react'
import type { Lesson } from '@/types/lesson'
import { CodeBlock } from './CodeBlock'
import { KnowledgeCheck } from './KnowledgeCheck'
export function LessonSection({
  lesson,
  children,
}: {
  lesson: Lesson
  children: ReactNode
}) {
  return (
    <article id={`lesson-${lesson.id}`} className="lesson-card">
      <div className="mb-7 max-w-3xl">
        <h3 className="text-3xl font-semibold">{lesson.title}</h3>
        <p className="mt-4 text-muted">{lesson.body}</p>
      </div>
      <div className="lesson-grid">
        <div className="demo-panel">{children}</div>
        <CodeBlock code={lesson.code} />
      </div>
      <KnowledgeCheck question={lesson.check} />
    </article>
  )
}
