import type { CheckQuestion } from '@/types/lesson'
export const QUIZ_COPY = {
  title: 'מחברים את הרעיונות',
  description:
    'שלוש שאלות מהסדנה וארבעה מצבים מהחיים. כל תשובה מקבלת הסבר, ואפשר לנסות שוב.',
  topics: 'בחירת שאלת בדיקה',
} as const
const TOOLS = ['Props', 'State', 'Event', 'Effect'] as const
export const QUIZ_QUESTIONS: readonly (CheckQuestion & {
  id: string
  title: string
})[] = [
  {
    id: 'props',
    title: 'כיוון Props',
    prompt: 'לאיזה כיוון עוברים Props?',
    options: ['מהורה לילד', 'מילד להורה'],
    answer: 0,
    explanation:
      'ההורה מוסר קלט לילד. הילד אינו משנה את ה־Props; אפשר להעביר callback כדי לבקש מההורה פעולה.',
  },
  {
    id: 'snapshot',
    title: 'צילום מצב',
    prompt: 'אחרי setCount, האם count השתנה בתוך אותו handler?',
    options: ['כן, מיד', 'לא, זה עדיין צילום המצב של הרינדור הנוכחי'],
    answer: 1,
    explanation:
      'setCount מבקש רינדור נוסף. גם עדכון פונקציונלי אינו משנה את משתנה count שכבר נקלט ב־handler.',
  },
  {
    id: 'effect',
    title: 'מתי Effect?',
    prompt: 'מתי משתמשים ב־useEffect ולא בחישוב רגיל בזמן רינדור?',
    options: ['לכל חישוב', 'לסנכרון עם מערכת חיצונית'],
    answer: 1,
    explanation:
      'Effect מתאים לסנכרון חיצוני, כגון כותרת, טיימר או localStorage. ערך נגזר אפשר לחשב ישירות ברינדור.',
  },
  {
    id: 'choose-props',
    title: 'קלט',
    prompt: 'רכיב הורה מוסר שם לילד. מה הכלי המתאים?',
    options: TOOLS,
    answer: 0,
    explanation: 'Props הם הקלט שההורה מעביר לרכיב הילד.',
  },
  {
    id: 'choose-state',
    title: 'זיכרון',
    prompt: 'הרכיב צריך לזכור אילו משימות הושלמו. מה הכלי המתאים?',
    options: TOOLS,
    answer: 1,
    explanation: 'State שומר מידע שמשתנה ומשפיע על התצוגה.',
  },
  {
    id: 'choose-event',
    title: 'פעולה',
    prompt: 'המשתמש לחץ על כפתור הוספה. איפה מפעילים את פעולת ההוספה?',
    options: TOOLS,
    answer: 2,
    explanation: 'פעולה שבאה מלחיצה שייכת ל־event handler, ולא דורשת Effect.',
  },
  {
    id: 'choose-effect',
    title: 'סנכרון',
    prompt: 'צריך לסנכרן את הרשימה למערכת חיצונית כש־tasks משתנה. מה מדגימים?',
    options: TOOLS,
    answer: 3,
    explanation:
      'Effect יכול לסנכרן עם מערכת חיצונית. את מספר המשימות שנותרו עדיין מחשבים בזמן render.',
  },
]
