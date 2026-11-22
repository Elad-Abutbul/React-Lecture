import { WHY_REACT, REACT_VITE, COMPONENTS, JSX } from './lessons'
export const LEARNING_SCENES = [
  { id: WHY_REACT.id, title: WHY_REACT.title, lesson: WHY_REACT },
  { id: REACT_VITE.id, title: REACT_VITE.title, lesson: REACT_VITE },
  { id: 'files', title: 'מפת הקבצים', lesson: null },
  { id: COMPONENTS.id, title: COMPONENTS.title, lesson: COMPONENTS },
  { id: JSX.id, title: JSX.title, lesson: JSX },
] as const
export const LEARNING_POSITIONS: Record<string, { x: number; y: number }> =
  Object.fromEntries(
    [
      'declarative',
      'react-vite',
      'files',
      'components',
      'jsx',
      'props',
      'state',
      'snapshot',
      'render',
      'effect',
      'cleanup',
      'labs',
      'quiz',
    ].map((id, index) => [
      id,
      { x: 13000 + ((index % 3) - 1) * 1400, y: 3000 + index * 1300 },
    ]),
  )
