export type LearningSection = 'lecture' | 'workshop'
export type CodeExample = { path: string; code: string }
export type LectureStop = {
  id: string
  title: string
  minutes: number
  body: string
  instructor?: string
  demo?: string
  question: string
  answer: string
  expected: string
  example?: CodeExample
}
export type WorkshopStep = {
  id: string
  title: string
  minutes: number
  goal: string
  concept: string
  instructions: string[]
  expectedResult: string
  basicHint: string
  fullHintExplanation: string
  files: string[]
  highlight: 'navbar' | 'layout' | 'stats' | 'form' | 'filters' | 'list'
  selfCheck: string[]
  bonus?: boolean
}
