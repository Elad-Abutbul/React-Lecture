import { COMPONENTS, PROPS, STATE, CLEANUP } from './lessons'
export const LABS_COPY = {
  title: 'המעבדה: ארבע עצירות בקוד חי',
  description:
    'בוחרים תחנה, משנים את הממשק וקוראים את הקוד. הדוגמאות הן רכיבי React מוכנים; האתר אינו מריץ קוד שהקלדתם.',
  stations: 'תחנות המעבדה',
} as const
export const LAB_STATIONS = [
  {
    id: 'components',
    filename: 'Step01Components.tsx',
    title: 'Components',
    code: COMPONENTS.code,
  },
  {
    id: 'props',
    filename: 'Step02Props.tsx',
    title: 'Props',
    code: PROPS.code,
  },
  {
    id: 'state',
    filename: 'Step03State.tsx',
    title: 'State',
    code: STATE.code,
  },
  {
    id: 'effect',
    filename: 'Step04Effect.tsx',
    title: 'Effect',
    code: CLEANUP.code,
  },
] as const
