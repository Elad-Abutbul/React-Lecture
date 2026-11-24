import { FILTER_LABELS, TASK_COPY as C } from '../constants/tasks'
import type { TaskFilter } from '../types/task'
export default function FilterTabs({
  value,
  onChange,
}: {
  value: TaskFilter
  onChange: (value: TaskFilter) => void
}) {
  return (
    <div role="group" aria-label={C.filter} className="flex flex-wrap gap-2">
      {(Object.keys(FILTER_LABELS) as TaskFilter[]).map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
          className={`rounded-xl px-5 py-3 font-semibold ${value === filter ? 'bg-violet-100 text-violet-800' : 'bg-slate-200 text-slate-800'}`}
        >
          {FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  )
}
