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
