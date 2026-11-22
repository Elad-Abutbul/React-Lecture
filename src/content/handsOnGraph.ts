import { HANDS_ON_UNITS } from './handsOn'
import { HANDS_ON_POSITIONS, HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import type { WorldNode, WorldEdge } from '@/types/worldGraph'
const edge = (
  id: string,
  target: string,
  label: string,
  direction: WorldEdge['direction'] = 'forward',
): WorldEdge => ({ id, target, label, direction })

const pos = (id: string) => ({
  x: GRAPH_NAV.origin.x + HANDS_ON_POSITIONS[id].x,
  y: GRAPH_NAV.origin.y + HANDS_ON_POSITIONS[id].y,
})
const sequence = [
  'H01',
  'H02',
  'H02-enter',
  'H02-install',
  'H03',
  'H03-html',
  'H03-main',
  'H03-app',
  'H04',
  'H05',
  'pause-1',
  'H06',
  'H07',
  'H08',
  'pause-2',
  'H09',
  'H10',
  'H10-cleanup',
  'H11',
  'workshop-summary-120',
]
const path = (id: string) => [
  edge(
    'path',
    sequence[sequence.indexOf(id) + 1] ?? 'success',
    'גלילה לאורך הנתיב',
  ),
]
export const HANDS_ON_GRAPH: WorldNode[] = [
  {
    id: 'workshop-plan',
    title: COPY.planTitle,
    description: COPY.planDescription,
    kind: 'decision',
    position: pos('workshop-plan'),
    edges: [
      edge('plan-90', 'workshop-90', COPY.shortPlan, 'left'),
      edge('plan-120', 'workshop-120', COPY.longPlan, 'right'),
    ],
  },
  ...([90, 120] as const).map((plan) => ({
    id: `workshop-${plan}`,
    title: plan === 90 ? COPY.shortPlan : COPY.longPlan,
    description: plan === 90 ? COPY.planNote : COPY.local,
    kind: 'workshop' as const,
    sourceId: `plan-${plan}`,
    position: pos(`workshop-${plan}`),
    edges: [edge('path', 'H01', 'גלילה לאורך הנתיב')],
  })),
  ...HANDS_ON_UNITS.map((unit) => ({
    id: unit.id,
    title: `${unit.id} · ${unit.title}`,
    description: unit.goal,
    kind: 'workshop' as const,
    sourceId: unit.id,
    position: pos(unit.id),
    edges:
      unit.id === 'H05'
        ? [
            edge('short', 'H06', 'תרגול רציף · תוכנית 90', 'left'),
            edge('pause', 'pause-1', 'עצירה ובדיקת כיתה · תוכנית 120', 'right'),
          ]
        : unit.id === 'pause-2'
          ? [
              edge('summary', 'workshop-summary-90', COPY.shortEnd, 'left'),
              edge('bonus', 'H09', COPY.full, 'right'),
            ]
          : path(unit.id),
  })),
  {
    id: 'H02-enter',
    title: 'H02 · נכנסים לתיקיית הפרויקט',
    description: 'מריצים מתוך התיקייה שנוצרה, בלי ליצור פרויקט נוסף.',
    kind: 'installation',
    sourceId: 'H02',
    position: pos('H02-enter'),
    commandIds: ['ENTER_PROJECT'],
    edges: path('H02-enter'),
  },
  {
    id: 'H02-install',
    title: 'H02 · מתקינים תלויות',
    description: 'מוודאים ש־package.json נמצא בתיקייה הנוכחית.',
    kind: 'installation',
    sourceId: 'H02',
    position: pos('H02-install'),
    commandIds: ['INSTALL'],
    edges: path('H02-install'),
  },
  ...(['html', 'main', 'app'] as const).map((id) => ({
    id: `H03-${id}`,
    title:
      id === 'html'
        ? 'H03 · index.html'
        : id === 'main'
          ? 'H03 · src/main.tsx'
          : 'H03 · src/App.tsx',
    description: 'מזהים את התפקיד ואת החיבור לקובץ הבא.',
    kind: 'file' as const,
    sourceId: id,
    position: pos(`H03-${id}`),
    edges: path(`H03-${id}`),
  })),
  {
    id: 'H10-cleanup',
    title: 'H10 · Cleanup בניסוי נפרד',
    description:
      'טיימר נוצר ב־Effect ומתבטל ב־clearInterval. הדוגמה נפרדת מלוח המשימות.',
    kind: 'workshop',
    sourceId: 'cleanup',
    position: pos('H10-cleanup'),
    edges: path('H10-cleanup'),
  },
  ...([90, 120] as const).map((plan) => ({
    id: `workshop-summary-${plan}`,
    title: COPY.summary,
    description: COPY.summaryBody,
    kind: 'workshop' as const,
    sourceId: `summary-${plan}`,
    position: pos(`workshop-summary-${plan}`),
    edges: [edge('merge', 'success', 'חיבור לצומת הלמידה המשותף')],
  })),
]
