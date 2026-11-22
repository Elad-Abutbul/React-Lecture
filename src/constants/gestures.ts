export type BranchDirection = 'left' | 'right'
export const GESTURE = {
  threshold: 180,
  minDelta: 2,
  diagonalRatio: 0.65,
  idleReset: 240,
  cooldown: 1050,
  linePixels: 16,
  ignoreSelector:
    'input, textarea, select, [contenteditable="true"], [role="tablist"], [role="dialog"], [data-gesture-ignore]',
} as const
export const KEY_DIRECTIONS: Record<string, BranchDirection> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
}
export const BRANCH_DIRECTIONS: Record<
  string,
  Record<BranchDirection, { choiceId: string; label: string }>
> = {
  start: {
    right: { choiceId: 'yes', label: 'כן' },
    left: { choiceId: 'no', label: 'לא' },
  },
  node: {
    right: { choiceId: 'yes', label: 'כן' },
    left: { choiceId: 'no', label: 'לא' },
  },
  os: {
    right: { choiceId: 'mac', label: 'macOS' },
    left: { choiceId: 'windows', label: 'Windows' },
  },
  project: {
    right: { choiceId: 'existing', label: 'כן' },
    left: { choiceId: 'new', label: 'לא' },
  },
}
export const DIRECTION_META = {
  left: { arrow: '←', key: '←', label: 'שמאלה' },
  right: { arrow: '→', key: '→', label: 'ימינה' },
} as const
export const GESTURE_COPY = {
  question: 'בוחרים כיוון',
  instructions:
    'החליקו אופקית ב־trackpad או השתמשו במקשי החצים. גלילה אנכית נעה לאורך הנתיב.',
  wheel: 'עם גלגלת עכבר: לחצו על חץ ימין או חץ שמאל במקלדת.',
  touch: 'החליקו בבירור לכיוון הענף הרצוי.',
  guard: 'מחוות קטנות אינן בוחרות ענף.',
  announcement: 'נבחר כיוון',
  available: 'הנתיבים הזמינים',
} as const
