import { useState, useEffect } from 'react'
import { HANDS_ON_BY_ID } from '@/content/handsOn'
import { HANDS_ON_SOLUTIONS } from '@/content/handsOnSolutions'
import { HANDS_ON, HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { useHandsOnStore } from '@/store/hands-on-store'
import { workshopTiming } from '@/lib/hands-on'
import { KnowledgeCheck } from '../lessons/KnowledgeCheck'
import { SceneConsole } from '../world/SceneConsole'
import type { CommandId } from '@/constants/commands'
import { CodeSnippet } from './CodeSnippet'
import { InstructorMode } from './InstructorMode'
import { WorkshopTaskBoard } from './WorkshopTaskBoard'
import { Button } from '../ui/button'
export function ExerciseNode({ id }: { id: string }) {
  const unit = HANDS_ON_BY_ID[id],
    plan = useHandsOnStore((s) => s.plan),
    hints = useHandsOnStore((s) => s.hints[id] ?? 0),
    checked = useHandsOnStore((s) => s.checked.includes(id)),
    skipped = useHandsOnStore((s) => s.skipped.includes(id)),
    visited = useHandsOnStore((s) => s.visited),
    checkedCount = useHandsOnStore((s) => s.checked),
    instructor = useHandsOnStore((s) => s.instructor)
  const [panel, setPanel] = useState<'task' | 'hints' | 'check' | 'demo'>(
      'task',
    ),
    [filename, setFilename] = useState('')
  useEffect(() => {
    useHandsOnStore.getState().visit(id)
  }, [id])
  if (!unit) return null
  const planIds: readonly string[] = HANDS_ON.plans[plan]
  const timing = workshopTiming(id, plan),
    files = HANDS_ON_SOLUTIONS[id] ?? {},
    file = filename in files ? filename : Object.keys(files)[0]
  return (
    <div className={`workshop-exercise ${instructor ? 'is-instructor' : ''}`}>
      <p className="workshop-meta">
        <bdi>{id}</bdi> ·{' '}
        {timing.cumulative === null ? (
          COPY.bonus
        ) : (
          <>
            {timing.minutes} {COPY.minutes}
          </>
        )}{' '}
        {timing.cumulative !== null && (
          <>
            · {COPY.cumulative}: {timing.cumulative}/{timing.total}
          </>
        )}{' '}
        · {COPY.visited}: {visited.filter((id) => planIds.includes(id)).length}/
        {planIds.length} · {COPY.checked}:{' '}
        {checkedCount.filter((id) => planIds.includes(id)).length}/
        {planIds.length}
      </p>
      <div className="workshop-tools" role="group" aria-label={COPY.task}>
        {(
          [
            'task',
            'hints',
            'check',
            ...(['H08', 'H10', 'H11'].includes(id) ? ['demo'] : []),
          ] as ('task' | 'hints' | 'check' | 'demo')[]
        ).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={panel === key ? 'secondary' : 'ghost'}
            aria-pressed={panel === key}
            onClick={() => setPanel(key)}
          >
            {key === 'task'
              ? COPY.task
              : key === 'hints'
                ? COPY.hints
                : key === 'check'
                  ? COPY.check
                  : COPY.tasks}
          </Button>
        ))}
      </div>
      {panel === 'task' && (
        <>
          <p>
            <strong>{COPY.goal}: </strong>
            {unit.goal}
          </p>
          <p className="text-muted">{unit.idea}</p>
          <p>{unit.mission}</p>
          {unit.commandIds?.length ? (
            unit.commandIds.map((command) => (
              <SceneConsole key={command} commandId={command as CommandId} />
            ))
          ) : (
            <CodeSnippet code={unit.scaffold} filename={COPY.scaffold} />
          )}
          <p className="text-sm text-react">
            <strong>{COPY.try}: </strong>
            {unit.tryNow}
          </p>
        </>
      )}
      {panel === 'hints' && (
        <>
          {unit.hints.slice(0, Math.min(hints, 2)).map((hint) => (
            <p key={hint} className="my-2 text-muted">
              {hint}
            </p>
          ))}
          <Button
            variant="outline"
            onClick={() => useHandsOnStore.getState().hint(id)}
          >
            {hints === 0
              ? COPY.hint1
              : hints === 1
                ? COPY.hint2
                : COPY.solution}
          </Button>
          {hints >= 3 && (
            <div className="mt-3">
              {Object.keys(files).length ? (
                <>
                  <label>
                    {COPY.source}
                    <select
                      className="field"
                      value={file}
                      onChange={(e) => setFilename(e.target.value)}
                    >
                      {Object.keys(files).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <CodeSnippet code={files[file]} filename={file} />
                </>
              ) : (
                <p>{unit.success}</p>
              )}
            </div>
          )}
        </>
      )}
      {panel === 'check' && (
        <>
          <p className="mb-3">{unit.success}</p>
          <KnowledgeCheck question={unit.question} />
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) =>
                useHandsOnStore.getState().check(id, e.target.checked)
              }
            />
            {COPY.selfCheck}
          </label>
          <label className="flex min-h-11 items-center gap-2">
            <input
              type="checkbox"
              checked={skipped}
              onChange={(e) =>
                useHandsOnStore.getState().skip(id, e.target.checked)
              }
            />
            {COPY.skipped}
          </label>
          <p className="text-xs text-muted">{COPY.local}</p>
        </>
      )}
      {panel === 'demo' && <WorkshopTaskBoard />}
      {unit.pause && <p className="mt-3 text-violet">{COPY.classCheck}</p>}
      <InstructorMode
        key={`${id}-${plan}`}
        id={id}
        onSolution={() => {
          useHandsOnStore.getState().reveal(id)
          setPanel('hints')
        }}
        onQuestion={() => setPanel('check')}
      />
    </div>
  )
}
