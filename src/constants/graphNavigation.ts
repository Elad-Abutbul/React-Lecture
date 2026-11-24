export const GRAPH_NAV = {
  bounds: { width: 120000, height: 160000 },
  start: 'node',
  storage: { key: 'react-world-navigation', version: 2 },
  touchThreshold: 70,
  downKeys: ['ArrowDown', 'PageDown', ' '] as string[],
  upKeys: ['ArrowUp', 'PageUp'] as string[],
  parallax: { x: -70, y: -50, period: 4000 },
  linePixels: 16,
  trailLimit: 4,
  maxHistory: 256,
  origin: { x: 8000, y: 1000 },
  stride: 950,
  learning: { x: 3000, y: 12500, lanes: 3, laneShift: 280, branchScale: 1.5 },
  help: { x: 1000, y: 750, stepX: 350, stepY: 650 },
  createHelp: { x: -400, y: 6000 },
  outcomeGap: 450,
  projection: {
    width: 1000,
    height: 600,
    startX: 500,
    startY: 110,
    curveY: 250,
    approachY: 320,
    endY: 500,
  },
  branchX: 850,
  ghostScale: 0.4,
  ignore:
    'input, textarea, select, [contenteditable="true"], [role="dialog"], [role="tablist"], [data-gesture-ignore]',
} as const
export const GRAPH_COPY = {
  scroll: 'גללו כדי לנוע לאורך הנתיב · למעלה חוזרים בהדרגה',
  branch: 'בחרו ענף בהחלקה לכיוונו או בלחיצה · ואז גללו כדי לנוע לאורכו',
  touch: 'החליקו לכיוון הענף או געו באזור שלו',
  intentRight: 'ממשיכים להחליק ימינה',
  intentLeft: 'ממשיכים להחליק שמאלה',
  small: 'נדרשת גלילה מכוונת; תנועה קטנה לא משנה נתיב',
  branches: 'הענפים הזמינים',
  path: 'הנתיב שבחרת',
  position: 'מיקום בנתיב שביקרת בו',
  visited: 'ביקרת ב־',
  nodes: 'צמתים',
  external:
    'מבצעים במחשב שלך ומשווים לפלט. הגלילה מציינת ביקור בלבד ואינה מאמתת ביצוע.',
  read: 'גלילה לאורך הנתיב',
  right: 'ימינה ולמטה',
  left: 'שמאלה ולמטה',
  forward: 'לאורך הקו',
  rightArrow: '↘',
  leftArrow: '↙',
  forwardArrow: '↓',
  correct: 'הבנת את הרעיון',
  feedback: 'מסתכלים על ההסבר',
  reset: 'איפוס הביקורים המקומיים',
  resetDone: 'הביקורים אופסו',
  map: 'מפת העץ',
  search: 'סינון צמתים',
  mapDescription:
    'כל הצמתים הם חלק מאותו עץ. בחירה במפה מזיזה את המצלמה ואינה מאמתת עבודה חיצונית.',
  close: 'סגירה',
  end: 'הגעת לקצה הנתיב. אפשר לגלול למעלה ולחקור ענף אחר.',
  workshop: 'סדנת Hands-on · עד 120 דקות',
  installation: 'התקנה בלבד',
  code: 'קוד לדוגמה',
  demo: 'ניסוי חי',
  question: 'בדיקת הבנה',
  help: 'המדריך הרשמי',
} as const
export const INSTALL_POSITIONS: Record<string, { x: number; y: number }> = {
  node: { x: 0, y: 0 },
  os: { x: -900, y: 900 },
  windows: { x: -1600, y: 1800 },
  mac: { x: -200, y: 1800 },
  verify: { x: 900, y: 2700 },
  project: { x: 1300, y: 3600 },
  create: { x: 0, y: 4500 },
  'create-result': { x: 850, y: 5400 },
  enter: { x: 1250, y: 6300 },
  install: { x: 1650, y: 7200 },
  dev: { x: 2050, y: 8100 },
  existing: { x: 1800, y: 4500 },
  scripts: { x: 2200, y: 5400 },
  'existing-run': { x: 2600, y: 7200 },
  browser: { x: 3000, y: 9000 },
  tools: { x: 3400, y: 10000 },
  success: { x: 3000, y: 12000 },
}

export const COMMAND_OUTCOMES: Record<
  string,
  { question: string; label: string }
> = {
  enter: { question: 'באיזו תיקייה נמצא הטרמינל?', label: 'בתיקיית my-app' },
  install: {
    question: 'מה מופיע בסיום התקנת החבילות?',
    label: 'התלויות הותקנו',
  },
  dev: { question: 'מה מציג שרת הפיתוח?', label: 'כתובת Local פעילה' },
  'existing-run': {
    question: 'מה מציג סקריפט הפיתוח?',
    label: 'כתובת Local פעילה',
  },
  scripts: {
    question: 'מה הופיע ברשימת scripts?',
    label: 'סקריפט הפיתוח מופיע',
  },
}

export const GRAPH_GESTURE = {
  // Threshold applies to accumulated travel, never to individual high-resolution samples.
  epsilon: 0.001,
  axisLock: 24,
  threshold: 180,
  branchThreshold: 120,
  branchRatio: 0.75,
  axisRatio: 1.25,
  quietMs: 240,
  intentQuietMs: 650,
  readingBoundary: 1,
  keyboardPage: 0.7,
} as const

export const GRAPH_BRANCH_LAYOUT = { topRatio: 0.48, readingGap: 12 } as const
