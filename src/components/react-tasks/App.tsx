import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import AddTaskForm from './components/AddTaskForm'
import FilterTabs from './components/FilterTabs'
import TaskList from './components/TaskList'
import {
  BONUS_KEY,
  CATEGORY_LABELS,
  INITIAL_TASKS,
  STORAGE_KEY,
  TASK_COPY as C,
} from './constants/tasks'
import type { Task, TaskFilter, TaskCategory } from './types/task'
function readBonus() {
  try {
    return localStorage.getItem(BONUS_KEY) === 'true'
  } catch {
    return false
  }
}
function readTasks(bonus: boolean): Task[] {
  if (!bonus) return INITIAL_TASKS
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null',
    )
    if (!Array.isArray(data)) return INITIAL_TASKS
    const ids = new Set<string>()
    return data.every((task) => {
      if (
        !task ||
        typeof task !== 'object' ||
        typeof task.id !== 'string' ||
        ids.has(task.id) ||
        typeof task.title !== 'string' ||
        !task.title.trim() ||
        typeof task.completed !== 'boolean' ||
        (task.category !== undefined &&
          !Object.hasOwn(CATEGORY_LABELS, task.category))
      )
        return false
      ids.add(task.id)
      return true
    })
      ? data
      : INITIAL_TASKS
  } catch {
    return INITIAL_TASKS
  }
}
export default function TaskManager({ active = true }: { active?: boolean }) {
  const [bonus, setBonus] = useState(readBonus),
    [tasks, setTasks] = useState<Task[]>(() => readTasks(readBonus())),
    [filter, setFilter] = useState<TaskFilter>('all'),
    [query, setQuery] = useState(''),
    [category, setCategory] = useState('all'),
    [tab, setTab] = useState<'tasks' | 'guide'>('tasks')
  useEffect(() => {
    if (!active || !bonus) return
    try {
      localStorage.setItem(BONUS_KEY, 'true')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* Storage can be unavailable; the in-memory app remains usable. */
    }
  }, [tasks, bonus, active])
  function addTask(title: string, category: TaskCategory) {
    if (!title.trim()) return
    setTasks((previous) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
        ...(bonus ? { category } : {}),
      },
      ...previous,
    ])
  }
  function toggleTask(id: string) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }
  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id))
  }
  function editTask(id: string, title: string) {
    if (!title.trim()) return
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, title: title.trim() } : task,
      ),
    )
  }
  const completed = tasks.filter((task) => task.completed).length
  const visible = tasks.filter(
    (task) =>
      (filter === 'all' ||
        (filter === 'completed' ? task.completed : !task.completed)) &&
      task.title
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()) &&
      (!bonus || category === 'all' || task.category === category),
  )
  return (
    <section
      dir="rtl"
      aria-label={C.brand}
      className="task-manager overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-950"
    >
      <Navbar tab={tab} onChange={setTab} />
      <div className="mx-auto grid max-w-5xl gap-5 p-4 sm:p-6">
        <Hero />
        {tab === 'guide' ? (
          <div className="space-y-4 rounded-xl bg-white p-5">
            <p>{C.guideText}</p>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={bonus}
                onChange={(e) => {
                  setBonus(e.target.checked)
                  if (!e.target.checked) {
                    try {
                      localStorage.removeItem(BONUS_KEY)
                    } catch {
                      /* Storage may be blocked. */
                    }
                  }
                }}
              />
              {C.bonus}
            </label>
          </div>
        ) : (
          <>
            <Stats total={tasks.length} completed={completed} />
            <input
              aria-label={C.search}
              placeholder={C.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-400 bg-white p-3 text-slate-950"
            />
            <AddTaskForm onAdd={addTask} bonus={bonus} />
            <FilterTabs value={filter} onChange={setFilter} />
            {bonus && (
              <select
                aria-label={C.categoryFilter}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white p-3"
              >
                <option value="all">{C.allCategories}</option>
                {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            )}
            <TaskList
              tasks={visible}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
              bonus={bonus}
            />
          </>
        )}
        <p className="text-center text-xs text-slate-600">{C.footer}</p>
      </div>
    </section>
  )
}
