import { useState } from 'react'
import { CATEGORY_LABELS, TASK_COPY as C } from '../constants/tasks'
import type { Task } from '../types/task'
export type TaskActions = {
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}
export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  bonus = false,
}: TaskActions & { task: Task; bonus?: boolean }) {
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(task.title)
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 last:border-0">
      <input
        type="checkbox"
        aria-label={`${C.toggle}: ${task.title}`}
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 accent-violet-700"
      />
      {editing ? (
        <form
          className="flex min-w-0 flex-1 flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!draft.trim()) return
            onEdit(task.id, draft.trim())
            setEditing(false)
          }}
        >
          <input
            aria-label={C.editTitle}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-400 p-2 text-slate-950"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-700 p-2 text-white"
          >
            {C.save}
          </button>
          <button
            type="button"
            className="p-2 text-slate-700"
            onClick={() => setEditing(false)}
          >
            {C.cancel}
          </button>
        </form>
      ) : (
        <span
          className={`min-w-0 flex-1 break-words ${task.completed ? 'text-slate-600 line-through' : 'text-slate-950'}`}
        >
          {task.title}
        </span>
      )}
      {bonus && task.category && (
        <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs text-cyan-900">
          {CATEGORY_LABELS[task.category]}
        </span>
      )}
      <button
        type="button"
        aria-label={`${C.edit}: ${task.title}`}
        onClick={() => {
          setDraft(task.title)
          setEditing(true)
        }}
        className="rounded-lg p-3 text-slate-700 hover:bg-violet-50"
      >
        ✎
      </button>
      <button
        type="button"
        aria-label={`${C.remove}: ${task.title}`}
        onClick={() => onDelete(task.id)}
        className="rounded-lg p-3 text-red-700 hover:bg-red-50"
      >
        ×
      </button>
    </li>
  )
}
