export type CheckQuestion = {
  prompt: string
  options: readonly string[]
  answer: number
  explanation: string
}
export type Lesson = {
  id: string
  title: string
  body: string
  code: string
  check: CheckQuestion
}
