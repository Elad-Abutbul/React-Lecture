import type { CheckQuestion } from './lesson'
export type WorkshopUnit = {
  id: string
  title: string
  minutes: number
  goal: string
  idea: string
  mission: string
  tryNow: string
  success: string
  hints: readonly string[]
  question: CheckQuestion
  scaffold: string
  commandIds?: readonly string[]
  pause?: boolean
}
