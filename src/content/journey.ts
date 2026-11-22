import type { JourneyNode, Choice } from '@/types/journey'
import { LINKS } from '@/constants/links'
export const JOURNEY_START = 'start'
const go = (nextNodeId: string, label = 'ממשיכים'): Choice => ({
  id: 'done',
  label,
  nextNodeId,
})
const issue = (nextNodeId: string): Choice => ({
  id: 'error',
  label: 'נתקלתי בבעיה',
  nextNodeId,
  complete: false,
})
export const JOURNEY_NODES: readonly JourneyNode[] = [
  {
    id: 'start',
    kind: 'question',
    title: 'רוצה להתחיל לבנות עם React?',
    description: 'נבחר מסלול שמתאים לנקודת הפתיחה שלך.',
    choices: [
      { id: 'yes', label: 'כן, מתחילים', nextNodeId: 'node' },
      { id: 'no', label: 'עוד לא, למה React?', nextNodeId: 'why' },
    ],
  },
  {
    id: 'why',
    kind: 'explanation',
    title: 'מה React פותר?',
    description:
      'React עוזר לארגן ממשק כרכיבים שהמראה שלהם נגזר מהנתונים. באתר קטן אפשר בהחלט להשתמש ב־JavaScript רגיל.',
    choices: [{ ...go('start', 'בחזרה למסלול'), retry: true }],
  },
  {
    id: 'node',
    kind: 'question',
    title: 'Node.js כבר מותקן אצלך?',
    description:
      'Node.js מאפשר להפעיל את כלי הפיתוח. אין לאתר אפשרות לבדוק את המחשב שלך.',
    choices: [
      { id: 'yes', label: 'כן, נבדוק גרסאות', nextNodeId: 'verify' },
      { id: 'no', label: 'לא / לא בטוח', nextNodeId: 'os' },
    ],
  },
  {
    id: 'os',
    kind: 'question',
    title: 'מה מערכת ההפעלה שלך?',
    description: 'ההתקנה נעשית במחשב שלך, מחוץ לאתר.',
    choices: [
      { id: 'windows', label: 'Windows', nextNodeId: 'windows' },
      { id: 'mac', label: 'macOS', nextNodeId: 'mac' },
    ],
  },
  ...(['windows', 'mac'] as const).map((id) => ({
    id,
    kind: 'explanation' as const,
    title:
      id === 'windows' ? 'התקנת Node.js ב־Windows' : 'התקנת Node.js ב־macOS',
    description:
      'מורידים את מתקין LTS המתאים למחשב מהאתר הרשמי, מפעילים אותו ופועלים לפי ההוראות. npm נכלל בהתקנה. בסיום סוגרים ופותחים את הטרמינל. בוחרים גרסת Node שנתמכת בגרסת Vite הנוכחית, לפי התיעוד הרשמי.',
    helpUrl: LINKS.node,
    choices: [go('verify', 'התקנתי, בודקים')],
  })),
  {
    id: 'verify',
    kind: 'checkpoint',
    title: 'בודקים את ההתקנה ידנית',
    description:
      'מריצים את שתי הפקודות בטרמינל ומשווים לדרישות Node בתיעוד Vite. רק אחרי שראית פלט תקין בוחרים הצלחה.',
    checkpoint: { manual: true, commandIds: ['NODE_VERSION', 'NPM_VERSION'] },
    helpUrl: LINKS.vite,
    choices: [go('project', 'הבדיקה הצליחה'), issue('node-help')],
  },
  {
    id: 'node-help',
    kind: 'errorHelp',
    title: 'פותרים את בדיקת Node',
    description: 'שגיאה היא חלק מהדרך. בודקים את ההנחיות ואז מנסים שוב.',
    helpKey: 'node',
    choices: [{ ...go('verify', 'ננסה את הבדיקה שוב'), retry: true }],
  },
  {
    id: 'project',
    kind: 'question',
    title: 'כבר יש לך פרויקט React?',
    description: 'אפשר להמשיך עם פרויקט קיים או ליצור פרויקט חדש.',
    choices: [
      { id: 'new', label: 'לא, יוצרים פרויקט חדש', nextNodeId: 'create' },
      { id: 'existing', label: 'כן, יש פרויקט קיים', nextNodeId: 'existing' },
    ],
  },
  {
    id: 'existing',
    kind: 'explanation',
    title: 'פותחים את הפרויקט הקיים',
    description:
      'פותחים את תיקיית הפרויקט בעורך ובטרמינל. קוראים את README ואת scripts ב־package.json, ומתקינים תלויות באמצעות מנהל החבילות של הפרויקט. אין צורך להפעיל שוב את create vite.',
    choices: [go('scripts', 'התיקייה פתוחה והתלויות מותקנות')],
  },
  {
    id: 'scripts',
    kind: 'command',
    title: 'מזהים את סקריפט הפיתוח',
    description: 'לפרויקטים שונים יכולים להיות שמות שונים לסקריפטים.',
    commandId: 'SCRIPTS',
    choices: [
      go('existing-run', 'ראיתי את רשימת הסקריפטים'),
      issue('browser-help'),
    ],
  },
  {
    id: 'existing-run',
    kind: 'explanation',
    title: 'מפעילים לפי scripts הקיימים',
    description:
      'מריצים את סקריפט הפיתוח שמוגדר בפרויקט באמצעות npm run ואחריו שם הסקריפט. אם הוא נקרא dev, הפקודה היא npm run dev; אם start, משתמשים ב־npm run start. פותחים את הכתובת שהטרמינל מציג.',
    choices: [go('browser', 'הפעלתי את סקריפט הפיתוח'), issue('browser-help')],
  },
  {
    id: 'create',
    kind: 'command',
    title: 'יוצרים את הפרויקט',
    description: 'הפקודה יוצרת את תיקיית הפרויקט החדש.',
    commandId: 'CREATE_REACT',
    choices: [go('enter', 'בוצע'), issue('browser-help')],
  },
  {
    id: 'enter',
    kind: 'command',
    title: 'נכנסים לתיקייה',
    description: 'כל הפקודות הבאות רצות מתוך תיקיית הפרויקט.',
    commandId: 'ENTER_PROJECT',
    choices: [go('install', 'בוצע'), issue('browser-help')],
  },
  {
    id: 'install',
    kind: 'command',
    title: 'מתקינים את התלויות',
    description: 'כעת מתקינים את החבילות של הפרויקט שנוצר.',
    commandId: 'INSTALL',
    choices: [go('dev', 'בוצע'), issue('browser-help')],
  },
  {
    id: 'dev',
    kind: 'command',
    title: 'מפעילים את שרת הפיתוח',
    description: 'הטרמינל צריך להישאר פתוח כל עוד עובדים.',
    commandId: 'DEV',
    choices: [go('browser', 'בוצע'), issue('browser-help')],
  },
  {
    id: 'browser',
    kind: 'checkpoint',
    title: 'רואה את האתר בדפדפן?',
    description:
      'פותחים את כתובת Local המדויקת שהשרת הציג. האישור כאן הוא שלך בלבד.',
    choices: [go('tools', 'כן, האתר עובד'), issue('browser-help')],
  },
  {
    id: 'browser-help',
    kind: 'errorHelp',
    title: 'האתר עדיין לא עולה?',
    description:
      'בודקים את הטרמינל, את כתובת Local ואת השגיאה. אפשר לחזור ידנית לכל צומת קודם כדי לתקן את הפקודה ולנסות שוב.',
    helpKey: 'browser',
    choices: [{ ...go('project', 'בחזרה לבחירת הפרויקט'), retry: true }],
  },
  {
    id: 'tools',
    kind: 'explanation',
    title: 'כלי עזר, לבחירתך',
    description:
      'VS Code יכול לעזור בעריכת קוד ו־Git בניהול גרסאות. הם אינם תנאי להקמת React. קישורי ההתקנה זמינים כאן אם צריך.',
    choices: [go('success', 'ממשיכים להכיר את הקבצים')],
  },
  {
    id: 'success',
    kind: 'success',
    title: 'הסביבה מוכנה. אפשר לבנות!',
    description:
      'האתר רץ אצלך. עכשיו נכיר את הקבצים ואת הרכיבים שמרכיבים את הממשק.',
    choices: [],
  },
]
export const JOURNEY_COPY = {
  reset: 'מתחילים מחדש',
  resetTitle: 'לאפס את ההתקדמות?',
  resetDescription: 'הבחירות והשלבים שהשלמת במסלול ההתקנה יימחקו מהמכשיר הזה.',
  confirm: 'כן, להמשיך',
  cancel: 'ביטול',
  changeTitle: 'לשנות את המסלול?',
  changeDescription: 'התקדמות שתלויה בבחירה הקודמת תוסר. שאר המסע יישמר.',
  pending: 'ממתין',
  current: 'השלב הנוכחי',
  completed: 'הושלם',
  copy: 'העתק פקודה',
  copied: 'הועתק',
  copyFailed: 'לא ניתן להעתיק. אפשר לסמן את הפקודה ולהעתיק ידנית.',
  expected: 'מה אמורים לראות?',
  manual: 'הפקודות לא מורצות באתר. מריצים אצלך במחשב ומאשרים ידנית.',
  help: 'פתיחת המדריך הרשמי',
  files: 'אל מפת הקבצים',
  optional: 'כלי עזר אופציונליים',
  map: 'מפת המסלול',
  details: 'פרטי השלב',
  mapHint:
    'המפה מציגה את המסלול שבחרת. בוחרים שלב כדי לקרוא את פרטיו; הגלילה נשארת רגילה.',
  progress: 'התקדמות ההתקנה',
  choose: 'אפשר לשנות תשובה בכל שלב.',
  loading: 'טוענים את המפה…',
} as const
