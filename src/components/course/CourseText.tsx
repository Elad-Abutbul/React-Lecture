import { Fragment } from 'react'
import { CodeSnippet } from '../hands-on/CodeSnippet'
function inline(text: string) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g)
    .map((part, i) =>
      part.startsWith('`') ? (
        <bdi key={i} dir="ltr">
          <code>{part.slice(1, -1)}</code>
        </bdi>
      ) : part.startsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : part.startsWith('[') ? (
        <a
          key={i}
          href={part.slice(part.indexOf('](') + 2, -1)}
          target="_blank"
          rel="noreferrer"
          className="text-react underline"
        >
          {part.slice(1, part.indexOf(']'))}
        </a>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    )
}
export function CourseText({ text }: { text: string }) {
  return (
    <div className="course-prose">
      {text.split(/(```[\s\S]*?```)/g).map((part, i) => {
        if (part.startsWith('```')) {
          const start = part.indexOf('\n'),
            language = part.slice(3, start).trim()
          return (
            <CodeSnippet
              key={i}
              filename={
                language === 'bash'
                  ? 'Terminal'
                  : language === 'text'
                    ? 'Project structure'
                    : `דוגמה · ${language}`
              }
              code={part.slice(start + 1, -3).trim()}
            />
          )
        }
        return part
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, j) => (
            <p key={`${i}-${j}`} className="whitespace-pre-wrap">
              {inline(paragraph.replace(/^---$/gm, '').trim())}
            </p>
          ))
      })}
    </div>
  )
}
