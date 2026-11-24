export type TaskCategory = 'study' | 'personal' | 'work'
export type Task = {
  id: string
  title: string
  completed: boolean
  category?: TaskCategory
}
export type TaskFilter = 'all' | 'active' | 'completed'
