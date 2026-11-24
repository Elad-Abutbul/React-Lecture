import { TASK_COPY as C } from '../constants/tasks'
import TaskItem, { type TaskActions } from './TaskItem'
import type { Task } from '../types/task'
export default function TaskList({
  tasks,
  bonus = false,
  ...actions
}: TaskActions & { tasks: Task[]; bonus?: boolean }) {
  return tasks.length ? (
    <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} bonus={bonus} {...actions} />
      ))}
    </ul>
  ) : (
    <p className="rounded-2xl bg-white p-8 text-center text-slate-600">
      {C.empty}
    </p>
  )
}
