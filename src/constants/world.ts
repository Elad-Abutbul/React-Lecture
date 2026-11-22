import { TREE_POSITIONS, TREE_CONNECTIONS } from './tree'
export const WORLD = {
  origin: { x: 8000, y: 1000 },
  initialGap: 1300,
  axisScale: 3.8,
  maxWidth: 1100,
  gutter: 28,
  chrome: 76,
  scrollStep: 1100,
  width: 24000,
  height: 30000,
  decisionZoom: 0.43,
  camera: { smooth: 0.3, duration: 1.1, ease: 'power3.inOut' },
  revealAt: 0.65,
  sceneSwitch: 0.5,
  prototypeIds: ['intro', 'start', 'node', 'why'],
  spring: { stiffness: 90, damping: 22 },
  finePointer: '(hover: hover) and (pointer: fine)',
  colors: { cyan: '#61dafb', purple: '#a78bfa' },
} as const
export const WORLD_POSITIONS: Record<string, { x: number; y: number }> = {
  intro: { ...WORLD.origin },
  ...Object.fromEntries(
    Object.entries(TREE_POSITIONS).map(([id, p]) => [
      id,
      {
        x: WORLD.origin.x + p.x * WORLD.axisScale,
        y: WORLD.origin.y + WORLD.initialGap + p.y * WORLD.axisScale,
      },
    ]),
  ),
}
export const WORLD_CONNECTIONS = [
  {
    id: 'intro-start',
    source: 'intro',
    target: 'start',
    choiceId: 'intro',
    label: '',
    retry: false,
  },
  ...TREE_CONNECTIONS,
]
export const WORLD_COPY = {
  brand: 'React Journey',
  world: 'עולם הלמידה של React',
  scroll: 'גללו כדי להתקדם בעולם',
  branches: 'גללו כדי לחשוף את הנתיבים',
  reveal: 'חשיפת הנתיבים',
  map: 'מפת המסע',
  close: 'סגירה',
  continue: 'כניסה לעולם',
  resume: 'ממשיכים מהמקום שלך',
  choose: 'בחירת נתיב',
  manual: 'הביצוע במחשב שלך. האישור כאן ידני בלבד.',
  explore: 'חקירת העולם',
  return: 'חזרה למסלול',
  chapter: 'המסע שלך',
  scrollHint: 'מגלים. בוחרים. בונים.',
  reduced: 'תנועה מופחתת',
  position: 'מיקום בעולם',
  learn: 'מעבר למעבדת הלמידה',
} as const
