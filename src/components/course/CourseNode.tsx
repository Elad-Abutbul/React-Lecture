import { useState } from 'react'
import {
  COURSE_CONFIG as C,
  COURSE_QUIZ,
  COURSE_QUIZ_OPTIONS,
} from '@/constants/course'
import {
  LECTURE,
  INSTALLATION_GUIDE,
  INSTALLATION_TROUBLESHOOTING,
} from '@/content/lecture'
import { WORKSHOP } from '@/content/workshop'
import { COURSE_BUILDS } from '@/content/courseBuilds'
import { useCourseStore } from '@/store/course-store'
import { LEARNING_DEMOS } from '../world/WorldLearningScene'
import { CourseFileTree } from './CourseFileTree'
import { SnapshotDemo } from '../demos/SnapshotDemo'
import { CounterDemo } from '../demos/CounterDemo'
import { EffectDemo } from '../demos/EffectDemo'
import { CleanupDemo } from '../demos/CleanupDemo'
import { CodeSnippet } from '../hands-on/CodeSnippet'
import TaskManager from '../react-tasks/App'
import { CourseText } from './CourseText'
import { TargetReference } from './TargetReference'
function TailwindPlayground() {
  const [roomy, setRoomy] = useState(false),
    [rounded, setRounded] = useState(true)
  return (
    <section aria-label={C.labels.playground} className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-react/40 p-3"
          onClick={() => setRoomy(!roomy)}
        >
          {roomy ? C.labels.compact : C.labels.roomy}
        </button>
        <button
          type="button"
          className="rounded-lg border border-react/40 p-3"
          onClick={() => setRounded(!rounded)}
        >
          {rounded ? C.labels.square : C.labels.rounded}
        </button>
      </div>
      <div
        className={`bg-cyan-100 font-semibold text-slate-950 ${roomy ? 'p-8' : 'p-3'} ${rounded ? 'rounded-2xl' : 'rounded-none'}`}
      >
        {C.labels.preview}
      </div>
      <code dir="ltr">{`bg-cyan-100 ${roomy ? 'p-8' : 'p-3'} ${rounded ? 'rounded-2xl' : 'rounded-none'}`}</code>
    </section>
  )
}
function CourseQuiz() {
  const answers = useCourseStore((s) => s.answers),
    answer = useCourseStore((s) => s.answer)
  return (
    <section aria-label={C.labels.quiz}>
      {COURSE_QUIZ.map((item, i) => (
        <fieldset
          key={item.question}
          className="my-5 rounded-xl border border-react/30 p-4"
        >
          <legend>{item.question}</legend>
          <div className="my-3 flex flex-wrap gap-2">
            {COURSE_QUIZ_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className="rounded-lg border border-react/30 p-2"
                aria-pressed={answers[String(i)] === option}
                onClick={() => answer(String(i), option)}
              >
                {option}
              </button>
            ))}
          </div>
          {answers[String(i)] && (
            <p role="status">
              {answers[String(i)] === item.answer ? '✓' : '↻'}{' '}
              {item.explanation}
            </p>
          )}
        </fieldset>
      ))}
    </section>
  )
}
function Demo({ id }: { id: string }) {
  if (id === 'tailwind') return <TailwindPlayground />
  if (id === 'snapshot') return <SnapshotDemo />
  if (id === 'state') return <CounterDemo />
  if (id === 'effects')
    return (
      <>
        <EffectDemo />
        <CleanupDemo />
      </>
    )
  const Component = LEARNING_DEMOS[id]
  return Component ? <Component /> : null
}
export function CourseNode({ id, active }: { id: string; active: boolean }) {
  const hints = useCourseStore((s) => s.hints),
    hint = useCourseStore((s) => s.hint),
    checked = useCourseStore((s) => s.checked),
    check = useCourseStore((s) => s.check)
  const lecture = LECTURE.find((s) => s.id === id),
    step = WORKSHOP.find((s) => s.id === id)
  if (lecture)
    return (
      <div className="course-node" data-course-stop={id}>
        <p className="text-sm text-violet">
          {C.lectureLabel} · {lecture.minutes} {C.labels.minutes}
        </p>
        <CourseText text={lecture.body} />
        {lecture.example && (
          <CodeSnippet
            code={lecture.example.code}
            filename={lecture.example.path}
          />
        )}
        <section>
          <h2>{C.labels.expected}</h2>
          <p>{lecture.expected}</p>
        </section>
        {id === 'L01' && (
          <section className="course-installation">
            {INSTALLATION_GUIDE.map((section) => (
              <details key={section.id}>
                <summary>
                  {section.id} · {section.title}
                </summary>
                <CourseText text={section.body} />
              </details>
            ))}
            <details>
              <summary>{C.labels.troubleshooting}</summary>
              {INSTALLATION_TROUBLESHOOTING.map((tip) => (
                <section key={tip.title}>
                  <h3>{tip.title}</h3>
                  <CourseText text={tip.body} />
                </section>
              ))}
            </details>
          </section>
        )}
        {id === 'L02' && (
          <>
            <h2>{C.labels.files}</h2>
            <CourseFileTree />
          </>
        )}
        {lecture.demo && active && (
          <section aria-label={C.labels.demo} className="graph-demo">
            <Demo id={lecture.demo} />
          </section>
        )}
        {id === 'L11' ? (
          <CourseQuiz />
        ) : (
          <section>
            <h2>{lecture.question}</h2>
            <details>
              <summary>{C.labels.answer}</summary>
              <p>{lecture.answer}</p>
            </details>
          </section>
        )}
        <details>
          <summary>{C.labels.instructor}</summary>
          <CourseText text={lecture.instructor ?? lecture.expected} />
          <p>{C.labels.reading}</p>
        </details>
        <a
          href={
            C.sources[
              id === 'L06'
                ? 'tailwind'
                : id === 'L08'
                  ? 'snapshot'
                  : id === 'L09'
                    ? 'render'
                    : id === 'L10'
                      ? 'effect'
                      : id === 'L01'
                        ? 'vite'
                        : 'react'
            ]
          }
          target="_blank"
          rel="noreferrer"
          className="text-react underline"
        >
          {C.labels.source}
        </a>
      </div>
    )
  if (!step) return null
  const files = COURSE_BUILDS[id] ?? {}
  return (
    <div className="course-node" data-course-stop={id}>
      <p className="text-sm text-violet">
        {C.workshopLabel} · {step.minutes} {C.labels.minutes}
        {step.bonus ? ` · ${C.labels.bonus}` : ''}
      </p>
      <TargetReference highlight={step.highlight} />
      {id === 'W00' && (
        <details>
          <summary>{C.labels.setup}</summary>
          {INSTALLATION_GUIDE.slice(1, 4).map((section) => (
            <section key={section.id}>
              <h3>{section.title}</h3>
              <CourseText text={section.body} />
            </section>
          ))}
        </details>
      )}
      <section>
        <h2>{C.labels.objective}</h2>
        <p>{step.goal}</p>
        <p>{step.concept}</p>
      </section>
      <section>
        <h2>{C.labels.instructions}</h2>
        <ol>
          {step.instructions.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2>{C.labels.expected}</h2>
        <p>{step.expectedResult}</p>
      </section>
      {(['basic', 'full'] as const).map((level) => (
        <details
          key={level}
          open={!!hints[`${id}-${level}`]}
          onToggle={(e) => {
            if (hints[`${id}-${level}`] !== e.currentTarget.open)
              hint(`${id}-${level}`, e.currentTarget.open)
          }}
        >
          <summary>{C.labels[level]}</summary>
          <p>{level === 'basic' ? step.basicHint : step.fullHintExplanation}</p>
          {level === 'full' && hints[`${id}-${level}`] && (
            <section aria-label={C.labels.solution}>
              {Object.entries(files).map(([path, code]) => (
                <CodeSnippet key={path} code={code} filename={path} />
              ))}
            </section>
          )}
        </details>
      ))}
      <section>
        <h2>{C.labels.check}</h2>
        <ul>
          {step.selfCheck.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <label className="my-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={checked.includes(id)}
            onChange={(e) => check(id, e.target.checked)}
          />
          {C.labels.completed}
        </label>
        <p className="text-xs text-muted">{C.labels.reading}</p>
      </section>
      {(id === 'W09' || id === 'W10') && active && (
        <TaskManager active={active} />
      )}
    </div>
  )
}
