import { COMMANDS } from '@/constants/commands'
import type { Lesson } from '@/types/lesson'
export const LESSON_UI = {
  check: 'רגע של בדיקה',
  correct: 'בדיוק.',
  tryAgain: 'עוד ניסיון?',
  increment: 'הוספה',
  reset: 'איפוס',
  manual: 'Vanilla JavaScript',
  react: 'React',
  result: 'התוצאה',
  code: 'הקוד',
  run: 'להריץ את הניסוי',
  next: 'לניסוי הבא',
} as const
export const WHY_REACT: Lesson = {
  id: 'declarative',
  title: 'מתארים את הממשק. React מעדכן אותו.',
  body: 'בקוד קטן, JavaScript רגיל עובד מצוין. כשממשק גדל, התיאום הידני בין נתונים לאלמנטים נעשה מורכב. React הוא ספריית JavaScript לבניית ממשקים ברכיבים — לא שפה, לא CSS ולא שרת. הוא עוזר להגדיר מה צריך להופיע לפי המצב, במקום לפרט כל עדכון DOM.',
  code: '// Vanilla JS: how\ncount += 1\nlabel.textContent = String(count)\n\n// React: what\nconst [count, setCount] = useState(0)\nreturn <button onClick={() => setCount(n => n + 1)}>{count}</button>',
  check: {
    prompt: 'האם כל אתר צריך React?',
    options: ['כן, תמיד', 'לא. בוחרים לפי מורכבות הממשק'],
    answer: 1,
    explanation:
      'React מספק ארגון ועדכוני ממשק הצהרתיים. באתר קטן ופשוט אפשר לעבוד מצוין גם בלעדיו.',
  },
}
export const COUNTER_CONFIG = { initial: 0, step: 1 } as const
export const REACT_VITE: Lesson = {
  id: 'react-vite',
  title: 'React בונה ממשק. Vite מפעיל את סביבת העבודה.',
  body: 'React ו־Vite עושים עבודות שונות ומשלימות. בוחרים תבנית React + TypeScript, ואז מתקינים תלויות ומפעילים שרת פיתוח.',
  code: [
    COMMANDS.CREATE_REACT,
    COMMANDS.ENTER_PROJECT,
    COMMANDS.INSTALL,
    COMMANDS.DEV,
  ]
    .map((c) => c.code)
    .join('\n'),
  check: {
    prompt: 'מי מספק שרת פיתוח ובנייה לפרודקשן?',
    options: ['React', 'Vite'],
    answer: 1,
    explanation:
      'Vite הוא כלי הפיתוח והבנייה. React הוא הספרייה שמרכיבה ומעדכנת את ממשק המשתמש.',
  },
}
export const TOOL_ROLES = [
  {
    name: 'React',
    role: 'ספריית ממשק',
    description: 'רכיבים, JSX, Props, State ו־Hooks.',
  },
  {
    name: 'Vite',
    role: 'כלי פיתוח',
    description: 'יצירת פרויקט, שרת פיתוח, טעינת שינויים ובנייה לפרודקשן.',
  },
] as const
export const COMPONENTS: Lesson = {
  id: 'components',
  title: 'פונקציה אחת. חלק אחד בממשק.',
  body: 'קומפוננטה היא פונקציה עם שם שמתחיל באות גדולה ומחזירה JSX. מרכיבים רכיבים זה בתוך זה ומשתמשים באותו רכיב בכמה מקומות.',
  code: 'function Welcome() {\n  return <h3>Welcome!</h3>\n}\n\nexport default function App() {\n  return <>\n    <Welcome />\n    <Welcome />\n  </>\n}',
  check: {
    prompt: 'איך משתמשים שוב באותו רכיב?',
    options: ['כותבים מחדש את כל הפונקציה', 'מציגים מופע נוסף של הרכיב'],
    answer: 1,
    explanation:
      'אותה הגדרת קומפוננטה יכולה לשמש כמה מופעים. כל מופע יכול לקבל נתונים משלו.',
  },
}
export const JSX: Lesson = {
  id: 'jsx',
  title: 'זה נראה כמו HTML. זו בעצם TSX.',
  body: 'מחוץ ל־return כותבים טיפוסים, משתנים ופונקציות. בתוך ה־return כותבים JSX עם ביטויי JavaScript בסוגריים מסולסלים. קובץ עם JSX מסתיים ב־.tsx; קובץ TypeScript ללא JSX יכול להסתיים ב־.ts.',
  code: 'type Props = { name: string }\nfunction Greeting({ name }: Props) {\n  const message = "Hello " + name\n  return <h2 className="title">{message}</h2>\n}',
  check: {
    prompt: 'איך מציגים ערך של משתנה בתוך JSX?',
    options: ['בעזרת {name}', 'כותבים name כטקסט רגיל'],
    answer: 0,
    explanation:
      'סוגריים מסולסלים מאפשרים להכניס ביטויי JavaScript לתיאור הממשק.',
  },
}
export const COMPONENT_UI = {
  greeting: 'ברוכים הבאים לרכיב!',
  add: 'להוסיף מופע',
  remove: 'להסיר מופע',
  instances: 'מופעים של אותו רכיב',
  initial: 2,
  min: 1,
  max: 4,
  name: 'מה השם שלך?',
  defaultName: 'דנה',
  hello: 'שלום, ',
  rules: [
    'מחזירים אלמנט שורש אחד, או Fragment: <>...</>.',
    'className במקום class; אירועים נכתבים למשל onClick.',
    'ביטויים דינמיים נכנסים בתוך {}.',
  ],
} as const
export const PROPS: Lesson = {
  id: 'props',
  title: 'ההורה שולח. הילד מציג.',
  body: 'Props הם קלט לקריאה בלבד, מהורה לילד. אותו רכיב יכול להופיע עם ערכים שונים, בלי לשנות את הקוד שלו. משנים את השם בהורה ורואים את הילד מתעדכן.',
  code: 'type GreetingProps = { readonly name: string }\nfunction Greeting({ name }: GreetingProps) {\n  return <h3>Hello {name}!</h3>\n}\n\nfunction Parent() {\n  return <>\n    <Greeting name="Dana" />\n    <Greeting name="Yuval" />\n  </>\n}',
  check: {
    prompt: 'באיזה כיוון עוברים Props?',
    options: ['מהורה לילד', 'מילד להורה'],
    answer: 0,
    explanation:
      'ההורה קובע את הקלט. הילד קורא ומציג אותו; הוא אינו משנה את ה־Props.',
  },
}
export const PROPS_UI = {
  label: 'השם שההורה שולח',
  initial: 'דנה',
  second: 'יובל',
  greeting: 'שלום, ',
  parent: 'הורה',
  child: 'שני מופעים של אותו ילד',
} as const
export const STATE: Lesson = {
  id: 'state',
  title: 'כדי שהממשק ישתנה, React צריך לדעת שמשהו השתנה.',
  body: 'useState שומר ערך בין רינדורים. setCount מבקש רינדור חדש עם הערך הבא. שינוי משתנה רגיל לבדו לא מבקש מ־React לעדכן את התצוגה; המשתנה המקומי גם נוצר מחדש ברינדור הבא.',
  code: "import { useState } from 'react'\n\nfunction Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <button onClick={() => setCount(prev => prev + 1)}>\n      {count}\n    </button>\n  )\n}",
  check: {
    prompt: 'מה מבקש מ־React לרנדר עם ערך חדש?',
    options: ['שינוי משתנה רגיל', 'קריאה לפונקציית העדכון של State'],
    answer: 1,
    explanation:
      'React שומר את ה־State ומרנדר מחדש בעקבות בקשת עדכון. הוא אינו עוקב אחר כל משתנה JavaScript.',
  },
}
export const STATE_UI = {
  state: 'עם State',
  plain: 'משתנה רגיל',
  addState: 'הוספה ל־State',
  addPlain: 'שינוי המשתנה הרגיל',
  stateValue: 'ערך ה־State',
  plainValue: 'ערך המשתנה בתצוגה',
  note: 'בכוונה לא רואים עדכון בצד המשתנה הרגיל: שינויו אינו מבקש רינדור. ברינדור הבא הוא נוצר מחדש.',
  reset: 'איפוס המונה',
} as const
export const SNAPSHOT: Lesson = {
  id: 'snapshot',
  title: 'ה־handler רואה צילום מצב. הרינדור הבא רואה ערך חדש.',
  body: 'setCount מבקש רינדור נוסף; הוא אינו משנה את count בתוך ה־handler שכבר רץ. עדכון פונקציונלי מתבסס על העדכון שקדם לו בתור. לא כל Render גורם לשינוי ב־DOM.',
  code: 'function handleClick() {\n  setCount(count + 1)\n  console.log(count) // snapshot of this render\n}\n\n// Queue three updates safely:\nsetCount(prev => prev + 1)\nsetCount(prev => prev + 1)\nsetCount(prev => prev + 1)',
  check: {
    prompt: 'אם count היה 0, מה ידפיס console.log מיד אחרי setCount?',
    options: ['0', '1'],
    answer: 0,
    explanation:
      'ה־handler שייך לרינדור שבו count היה 0. בקשת העדכון תופיע ברינדור הבא, ולא תשנה את המשתנה שכבר נקלט.',
  },
}
export const SNAPSHOT_UI = {
  before: 'הערך באותו handler',
  after: 'הערך ברינדור הנוכחי',
  single: 'בקשת עדכון אחת',
  batchLabel: 'שלושה עדכונים פונקציונליים',
  batch: 3,
  empty: '—',
  timeline: 'מהטריגר למסך',
} as const
export const RENDER_PHASES = [
  { title: 'טריגר', body: 'טעינה או עדכון State מבקשים רינדור.' },
  { title: 'Render', body: 'React מפעיל רכיבים ומחשב את תיאור הממשק החדש.' },
  {
    title: 'Commit',
    body: 'React מחיל ב־DOM רק את השינויים הנחוצים. אם אין הבדל, ייתכן שלא ישתנה דבר.',
  },
  {
    title: 'Paint',
    body: 'הדפדפן מציג את התוצאה. Render ו־Paint הם תהליכים שונים.',
  },
] as const
export const EFFECT: Lesson = {
  id: 'effect',
  title: 'מדברים עם העולם שבחוץ.',
  body: 'Effect מסנכרן את React עם מערכת חיצונית אחרי ה־Commit: כותרת לשונית, טיימר או מאזין. ערך שאפשר לחשב בזמן render אינו צריך Effect.',
  code: "useEffect(() => {\n  const previousTitle = document.title\n  document.title = 'Likes: ' + count\n  return () => { document.title = previousTitle }\n}, [count])",
  check: {
    prompt: 'מתי Effect מתאים?',
    options: ['לחישוב count * 2', 'לסנכרון כותרת הלשונית עם count'],
    answer: 1,
    explanation:
      'כותרת הדפדפן היא מערכת חיצונית ל־React. הכפלה של ערך אפשר לחשב ישירות בזמן render.',
  },
}
export const EFFECT_UI = {
  prefix: 'React Journey · Likes: ',
  increment: 'עדכון המונה והכותרת',
  title: 'כותרת הלשונית כעת',
  dependencies: 'מתי ה־Effect רץ?',
} as const
export const EFFECT_MODES = [
  {
    code: 'useEffect(fn)',
    description: 'אחרי כל Commit רלוונטי של הקומפוננטה.',
  },
  {
    code: 'useEffect(fn, [])',
    description:
      'בהתקנה, עם Cleanup בהסרה. ב־StrictMode בפיתוח יש בדיקת הפעלה וניקוי נוספת.',
  },
  {
    code: 'useEffect(fn, [x])',
    description:
      'בהתקנה ושוב כש־x משתנה. הניקוי הקודם מתבצע לפני הסנכרון החדש.',
  },
] as const
