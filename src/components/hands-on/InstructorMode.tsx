import { useState, useEffect } from 'react'
import { HANDS_ON, HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { HANDS_ON_UNITS } from '@/content/handsOn'
import { useHandsOnStore } from '@/store/hands-on-store'
import { useGraphStore } from '@/store/graph-store'
import { plannedMinutes } from '@/lib/hands-on'
import { Button } from '../ui/button'
export function InstructorMode({
  id,
  onSolution,
  onQuestion,
}: {
  id: string
  onSolution?: () => void
  onQuestion?: () => void
}) {
  const plan = useHandsOnStore((s) => s.plan),
    instructor = useHandsOnStore((s) => s.instructor)
  const duration = plannedMinutes(id, plan) * HANDS_ON.secondsPerMinute
  const [remaining, setRemaining] = useState(duration),
    [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const interval = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      HANDS_ON.timerTick,
    )
    return () => clearInterval(interval)
  }, [running])
  return (
    <details className="workshop-instructor">
      <summary>{COPY.instructor}</summary>
      <label className="flex min-h-11 items-center gap-2">
        <input
          type="checkbox"
          checked={instructor}
          onChange={(e) =>
            useHandsOnStore.getState().setInstructor(e.target.checked)
          }
        />
        {COPY.instructor}
      </label>
      {instructor && (
        <div className="my-2 flex flex-wrap gap-2">
          {onSolution && (
            <Button size="sm" variant="outline" onClick={onSolution}>
              {COPY.instructorSolution}
            </Button>
          )}
          {onQuestion && (
            <Button size="sm" variant="outline" onClick={onQuestion}>
              {COPY.instructorQuestion}
            </Button>
          )}
        </div>
      )}
      <label>
        {COPY.station}
        <select
          className="field"
          value={id}
          onChange={(e) => useGraphStore.getState().jump(e.target.value)}
        >
          {HANDS_ON_UNITS.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.id} · {unit.title}
            </option>
          ))}
        </select>
      </label>
      <p className="my-2">
        {COPY.timer}:{' '}
        <time dir="ltr">
          {Math.floor(remaining / HANDS_ON.secondsPerMinute)}:
          {String(remaining % HANDS_ON.secondsPerMinute).padStart(2, '0')}
        </time>
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRunning((value) => !value)}
        >
          {running ? COPY.stop : COPY.start}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setRemaining(duration)
            setRunning(false)
          }}
        >
          {COPY.resetTimer}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            useHandsOnStore.getState().reset()
            useHandsOnStore.getState().visit(id)
          }}
        >
          {COPY.reset}
        </Button>
      </div>
      {remaining === 0 && <p role="status">{COPY.timerDone}</p>}
      <p className="mt-2 text-xs text-muted">{COPY.classCheck}</p>
    </details>
  )
}
