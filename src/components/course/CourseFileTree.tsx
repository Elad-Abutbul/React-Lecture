import { useState } from 'react'
import { COURSE_FILES } from '@/content/courseFiles'
import { COURSE_CONFIG } from '@/constants/course'
import { CodeSnippet } from '../hands-on/CodeSnippet'
export function CourseFileTree() {
  const [index, setIndex] = useState(0),
    file = COURSE_FILES[index]
  return (
    <section aria-label={COURSE_CONFIG.labels.files}>
      <div
        role="group"
        aria-label={COURSE_CONFIG.labels.files}
        className="flex flex-wrap gap-2"
      >
        {COURSE_FILES.map((item, i) => (
          <button
            key={item.path}
            type="button"
            className="rounded-lg border border-react/30 p-3 text-sm"
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            <bdi dir="ltr">{item.path}</bdi>
          </button>
        ))}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{file.role}</h3>
      <p>{file.description}</p>
      <CodeSnippet filename={file.path} code={file.code} />
    </section>
  )
}
