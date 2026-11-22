import { HANDS_ON_UNITS } from './handsOn'
import { HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import type { WorldNode, WorldEdge } from '@/types/worldGraph'
const edge = (
  id: string,
  target: string,
  label: string,
  direction: WorldEdge['direction'] = 'forward',
): WorldEdge => ({ id, target, label, direction })
const positions: Record<string, { x: number; y: number }> = {
  'workshop-plan': { x: -1200, y: 5350 },
  'workshop-90': { x: -2100, y: 5800 },
  'workshop-120': { x: -300, y: 5800 },
  H01: { x: -1500, y: 6400 },
  H02: { x: -2300, y: 6800 },
  'H02-enter': { x: -1500, y: 7100 },
  'H02-install': { x: -700, y: 7400 },
  H03: { x: -1500, y: 7700 },
  'H03-html': { x: -2300, y: 8000 },
  'H03-main': { x: -1500, y: 8300 },
  'H03-app': { x: -700, y: 8600 },
  H04: { x: -1500, y: 8900 },
  H05: { x: -2300, y: 9200 },
  'pause-1': { x: -1450, y: 9500 },
  H06: { x: -3100, y: 9800 },
  H07: { x: -2300, y: 10100 },
  H08: { x: -1500, y: 10400 },
  'pause-2': { x: -2300, y: 10700 },
  H09: { x: -1450, y: 11000 },
  H10: { x: -650, y: 11300 },
  'H10-cleanup': { x: -1450, y: 11600 },
  H11: { x: -2250, y: 11900 },
  'workshop-summary-90': { x: -3150, y: 11500 },
  'workshop-summary-120': { x: -1450, y: 12300 },
}
const pos = (id: string) => ({
  x: GRAPH_NAV.origin.x + positions[id].x,
  y: GRAPH_NAV.origin.y + positions[id].y,
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
