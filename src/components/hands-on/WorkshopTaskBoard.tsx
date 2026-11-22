import { useState, useEffect, type FormEvent } from 'react'
import { HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { loadDemoTasks, saveDemoTasks, type DemoTask } from '@/lib/hands-on'
import { Button } from '../ui/button'
export function WorkshopTaskBoard() {
  const [tasks, setTasks] = useState<DemoTask[]>(loadDemoTasks),
    [input, setInput] = useState('')
  useEffect(() => {
    saveDemoTasks(tasks)
  }, [tasks])
  function add(event: FormEvent) {
    event.preventDefault()
    const title = input.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, done: false },
    ])
    setInput('')
  }
  return (
    <section aria-label={COPY.tasks} className="workshop-demo">
      <form onSubmit={add} className="flex flex-wrap items-end gap-2">
        <label className="grow">
          {COPY.newTask}
          <input
            className="field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <Button type="submit">{COPY.addTask}</Button>
      </form>
      <p className="my-2 text-react">
        {COPY.remaining}: {tasks.filter((t) => !t.done).length}
      </p>
      {!tasks.length && <p>{COPY.empty}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === task.id ? { ...t, done: !t.done } : t,
                    ),
                  )
                }
              />
              <span>{task.title}</span>
              <small>{task.done ? COPY.done : COPY.pending}</small>
            </label>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">{COPY.memory}</p>
    </section>
  )
}
