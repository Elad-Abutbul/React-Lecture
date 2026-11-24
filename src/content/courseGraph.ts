import { COURSE_CONFIG as C } from '@/constants/course'
import { LECTURE } from './lecture'
import { WORKSHOP } from './workshop'
import type { WorldNode } from '@/types/worldGraph'
export const COURSE_GRAPH: WorldNode[] = [
  {
    id: C.home,
    title: C.title,
    description: C.description,
    kind: 'decision',
    position: C.origin,
    edges: [
      {
        id: 'lecture',
        target: 'L00',
        label: C.lectureLabel,
        direction: 'left',
      },
      {
        id: 'workshop',
        target: 'W00',
        label: C.workshopLabel,
        direction: 'right',
      },
    ],
  },
  ...LECTURE.map((stop, index): WorldNode => ({
    id: stop.id,
    title: `${stop.id} · ${stop.title}`,
    description: '',
    kind: 'lesson',
    sourceId: stop.id,
    position: { x: C.lecture.x, y: C.lecture.y + index * C.stride },
    edges: [
      {
        id: 'path',
        target: LECTURE[index + 1]?.id ?? C.bridge.id,
        label: 'גלילה לאורך ההרצאה',
        direction: 'forward',
      },
    ],
  })),
  {
    id: C.bridge.id,
    title: C.bridge.title,
    description: C.bridge.description,
    kind: 'lesson',
    position: { x: C.lecture.x, y: C.lecture.y + LECTURE.length * C.stride },
    edges: [
      {
        id: 'workshop',
        target: `${C.lectureWorkshopPrefix}W00`,
        label: C.workshopLabel,
        direction: 'forward',
      },
    ],
  },
  ...WORKSHOP.map((step, index): WorldNode => ({
    id: step.id,
    title: `${step.id} · ${step.title}`,
    description: step.goal,
    kind: 'workshop',
    sourceId: step.id,
    position: { x: C.workshop.x, y: C.workshop.y + index * C.stride },
    edges: [
      {
        id: 'path',
        target: WORKSHOP[index + 1]?.id ?? C.reference.id,
        label: 'גלילה לאורך הסדנה',
        direction: 'forward',
      },
    ],
  })),
  ...WORKSHOP.map((step, index): WorldNode => ({
    id: `${C.lectureWorkshopPrefix}${step.id}`,
    title: `${step.id} · ${step.title}`,
    description: step.goal,
    kind: 'workshop',
    sourceId: step.id,
    position: {
      x: C.lecture.x,
      y: C.lecture.y + (LECTURE.length + index + 1) * C.stride,
    },
    edges: [
      {
        id: 'path',
        target: WORKSHOP[index + 1]
          ? `${C.lectureWorkshopPrefix}${WORKSHOP[index + 1].id}`
          : C.reference.id,
        label: 'גלילה לאורך הסדנה',
        direction: 'forward',
      },
    ],
  })),
  {
    id: C.reference.id,
    title: C.reference.title,
    description: C.reference.description,
    kind: 'installation',
    position: {
      x: C.workshop.x + 2000,
      y: C.workshop.y + WORKSHOP.length * C.stride,
    },
    edges: [
      {
        id: 'reference',
        target: C.referenceEntry,
        label: C.reference.title,
        direction: 'forward',
      },
    ],
  },
]
export const COURSE_IDS = new Set(COURSE_GRAPH.map((node) => node.id))
