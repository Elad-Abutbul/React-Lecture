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
