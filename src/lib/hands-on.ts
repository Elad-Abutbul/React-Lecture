import { HANDS_ON } from '@/constants/handsOn'
import { HANDS_ON_BY_ID } from '@/content/handsOn'
export function plannedMinutes(id: string, plan: 90 | 120) {
  return plan === 90 && id in HANDS_ON.shortMinutes
    ? HANDS_ON.shortMinutes[id as keyof typeof HANDS_ON.shortMinutes]
    : (HANDS_ON_BY_ID[id]?.minutes ?? 0)
}
export function workshopTiming(id: string, plan: 90 | 120) {
  const ids: readonly string[] = HANDS_ON.plans[plan],
    index = ids.indexOf(id)
  return {
    minutes: index < 0 ? 0 : plannedMinutes(id, plan),
    cumulative:
      index < 0
        ? null
        : ids
            .slice(0, index + 1)
            .reduce((total, id) => total + plannedMinutes(id, plan), 0),
    total: ids.reduce((total, id) => total + plannedMinutes(id, plan), 0),
  }
}
export type DemoTask = { id: string; title: string; done: boolean }
export function loadDemoTasks(): DemoTask[] {
  try {
    const data: unknown = JSON.parse(
      localStorage.getItem(HANDS_ON.demoKey) ?? '[]',
    )
    return Array.isArray(data)
      ? data.filter(
          (task): task is DemoTask =>
            typeof task === 'object' &&
            task !== null &&
            typeof task.id === 'string' &&
            typeof task.title === 'string' &&
            typeof task.done === 'boolean',
        )
      : []
  } catch {
    return []
  }
}
export function saveDemoTasks(tasks: DemoTask[]) {
  try {
    localStorage.setItem(HANDS_ON.demoKey, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
