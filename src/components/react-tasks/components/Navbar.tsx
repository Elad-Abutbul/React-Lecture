import { TASK_COPY as C } from '../constants/tasks'
type Props = {
  tab: 'tasks' | 'guide'
  onChange: (tab: 'tasks' | 'guide') => void
}
export default function Navbar({ tab, onChange }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white p-5">
      <b dir="ltr" className="flex items-center gap-2 text-xl text-slate-950">
        <span aria-hidden="true" className="text-4xl text-cyan-600">
          ⚛
        </span>
        {C.brand}
      </b>
      <div role="group" aria-label={C.navigation} className="flex gap-2">
        {(['tasks', 'guide'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={tab === value}
            onClick={() => onChange(value)}
            className={`rounded-xl px-5 py-3 font-semibold ${tab === value ? 'bg-violet-100 text-violet-800' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            {C[value]}
          </button>
        ))}
      </div>
    </header>
  )
}
