import { REFERENCES_COPY } from '@/constants/links'
import { QUIZ_COPY } from './quiz'
import { LABS_COPY } from './labs'
import {
  WHY_REACT,
  REACT_VITE,
  COMPONENTS,
  JSX,
  PROPS,
  STATE,
  SNAPSHOT,
  EFFECT,
  CLEANUP,
} from './lessons'
export const LEARNING_SCENES = [
  { id: WHY_REACT.id, title: WHY_REACT.title, lesson: WHY_REACT },
  { id: REACT_VITE.id, title: REACT_VITE.title, lesson: REACT_VITE },
  { id: 'files', title: 'מפת הקבצים', lesson: null },
  { id: COMPONENTS.id, title: COMPONENTS.title, lesson: COMPONENTS },
  { id: JSX.id, title: JSX.title, lesson: JSX },
  { id: PROPS.id, title: PROPS.title, lesson: PROPS },
  { id: STATE.id, title: STATE.title, lesson: STATE },
  { id: SNAPSHOT.id, title: SNAPSHOT.title, lesson: SNAPSHOT },
  { id: EFFECT.id, title: EFFECT.title, lesson: EFFECT },
  { id: CLEANUP.id, title: CLEANUP.title, lesson: CLEANUP },
  { id: 'labs', title: LABS_COPY.title, lesson: null },
  { id: 'quiz', title: QUIZ_COPY.title, lesson: null },
  { id: 'resources', title: REFERENCES_COPY.title, lesson: null },
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
      'resources',
    ].map((id, index) => [
      id,
      { x: 13000 + ((index % 3) - 1) * 1400, y: 3000 + index * 1300 },
    ]),
  )
export const LEARNING_MENU_LABELS: Record<string, string> = {
  declarative: 'למה React?',
  'react-vite': 'React ו־Vite',
  files: 'מפת הקבצים',
  components: 'Components',
  jsx: 'JSX / TSX',
  props: 'Props',
  state: 'State',
  snapshot: 'Snapshot',
  effect: 'useEffect',
  cleanup: 'Cleanup',
  labs: 'מעבדה',
  quiz: 'בדיקת הבנה',
  resources: 'מקורות',
}
