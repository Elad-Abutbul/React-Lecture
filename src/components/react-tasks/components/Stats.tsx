import { TASK_COPY as C } from '../constants/tasks'
export default function Stats({
  total,
  completed,
}: {
  total: number
  completed: number
}) {
  const values = [
    { label: C.total, value: total, color: 'text-violet-800 bg-violet-50' },
    {
      label: C.completed,
      value: completed,
      color: 'text-emerald-800 bg-emerald-50',
    },
    {
      label: C.active,
      value: total - completed,
      color: 'text-blue-800 bg-blue-50',
    },
  ]
  return (
    <section
      aria-label={C.summary}
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {values.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${item.color}`}
        >
          <h3 className="text-sm font-semibold">{item.label}</h3>
          <output
            aria-label={item.label}
            className="mt-2 block text-3xl font-bold"
          >
            {item.value}
          </output>
        </div>
      ))}
    </section>
  )
}
