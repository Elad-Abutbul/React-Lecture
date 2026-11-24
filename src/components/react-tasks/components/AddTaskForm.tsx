import { useState, type SubmitEvent } from 'react'
import { CATEGORY_LABELS, TASK_COPY as C } from '../constants/tasks'
import type { TaskCategory } from '../types/task'
export default function AddTaskForm({
  onAdd,
  bonus = false,
}: {
  onAdd: (title: string, category: TaskCategory) => void
  bonus?: boolean
}) {
  const [title, setTitle] = useState(''),
    [category, setCategory] = useState<TaskCategory>('personal')
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = title.trim()
    if (!clean) return
    onAdd(clean, category)
    setTitle('')
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap gap-3">
      <input
        aria-label={C.title}
        placeholder={C.placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-slate-400 bg-white p-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-violet-600"
      />
      {bonus && (
        <select
          aria-label={C.category}
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-950"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800"
      >
        {C.add} +
      </button>
    </form>
  )
}
