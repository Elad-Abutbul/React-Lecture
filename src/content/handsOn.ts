import type { WorkshopUnit } from '@/types/handsOn'
export const HANDS_ON_UNITS: readonly WorkshopUnit[] = [
  {
    id: 'H01',
    title: 'סביבת עבודה',
    minutes: 10,
    goal: 'לזהות ש־Node.js ו־npm מותקנים.',
    idea: 'npm מנהל חבילות; Vite כלי פיתוח; React ספריית ממשק.',
    mission:
      'פתחו טרמינל והשוו מספרי גרסאות לדרישות Vite. אם חסר Node, חזרו לענף ההתקנה בעץ.',
    tryNow: 'הריצו node -v ואז npm -v.',
    success: 'שתי הפקודות מציגות מספר גרסה.',
    hints: [
      'פתחו טרמינל חדש אחרי התקנת Node.',
      'npm נכלל במתקין Node; בדקו את PATH ודרישות Vite.',
    ],
    question: {
      prompt: 'האם React הוא שרת?',
      options: ['לא, זו ספריית ממשק', 'כן'],
      answer: 0,
      explanation: 'React מתאר ומעדכן ממשק; סביבת הפיתוח מסופקת בכלים אחרים.',
    },
    scaffold: 'node -v\nnpm -v',
    commandIds: ['NODE_VERSION', 'NPM_VERSION'],
    pause: false,
  },
  {
    id: 'H02',
    title: 'פרויקט Vite',
    minutes: 10,
    goal: 'להקים פרויקט React עם TypeScript.',
    idea: 'התבנית יוצרת קבצים; התקנת תלויות היא פעולה נפרדת.',
    mission:
      'צרו פרויקט חדש. תחנות הפקודה הבאות באותו קו מכניסות לתיקייה ומתקינות תלויות.',
    tryNow: 'בדקו שקיימים package.json ותיקיית src.',
    success: 'נוצרה תיקיית my-app עם קובצי הפרויקט.',
    hints: [
      'אם התיקייה קיימת, בחרו שם אחר בלי למחוק עבודה.',
      'היצירה נעשית עם npm create vite, לא npm i create.',
    ],
    question: {
      prompt: 'איזו תבנית בחרנו?',
      options: ['react-ts', 'שרת Node בלבד'],
      answer: 0,
      explanation: 'react-ts כוללת React ו־TypeScript.',
    },
    scaffold: 'npm create vite@latest my-app -- --template react-ts',
    commandIds: ['CREATE_REACT'],
    pause: false,
  },
  {
    id: 'H03',
    title: 'שרת פיתוח ומפת קבצים',
    minutes: 10,
    goal: 'להפעיל את האתר ולזהות את שרשרת הכניסה.',
    idea: 'index.html טוען main.tsx שמרכיב את App.tsx.',
    mission: 'הריצו את שרת הפיתוח. לאורך הקו הבא נפגוש כל קובץ ואת תפקידו.',
    tryNow: 'פתחו את כתובת Local המדויקת שהטרמינל מציג.',
    success: 'אפליקציית Vite פעילה בדפדפן.',
    hints: [
      'משאירים את הטרמינל פתוח.',
      'אם הפורט תפוס, משתמשים בכתובת החדשה שהשרת הדפיס.',
    ],
    question: {
      prompt: 'איזה קובץ מגדיר את קומפוננטת הכניסה?',
      options: ['src/App.tsx', 'package.json'],
      answer: 0,
      explanation: 'App מרכיב את הממשק; main מחבר אותו ל־HTML.',
    },
    scaffold: 'npm run dev',
    commandIds: ['DEV'],
    pause: false,
  },
  {
    id: 'H04',
    title: 'JSX ראשון',
    minutes: 10,
    goal: 'להציג כותרת, פסקה ורשימה מתוך App.',
    idea: 'סוגריים מסולסלים מציגים ביטוי JavaScript בתוך JSX.',
    mission:
      'עדכנו את App.tsx עם workshopName, כותרת, פסקה ורשימת Components / Props / State.',
    tryNow: 'שנו את שם הסדנה דרך המשתנה בלבד.',
    success: 'השינוי מופיע בדפדפן בלי רענון ידני.',
    hints: [
      'שם המשתנה נכנס בין סוגריים מסולסלים.',
      'ב־JSX כותבים className; קובץ עם JSX הוא tsx.',
    ],
    question: {
      prompt: 'איך מציגים את המשתנה workshopName?',
      options: ['{workshopName}', 'הטקסט workshopName'],
      answer: 0,
      explanation: 'סוגריים מסולסלים משלבים את ערך הביטוי.',
    },
    scaffold:
      'export default function App() {\n  const workshopName = "React Workshop"\n  return <main><h1>{workshopName}</h1>{/* הוסיפו פסקה ורשימה */}</main>\n}',
    commandIds: [],
    pause: false,
  },
  {
    id: 'H05',
    title: 'TaskCard חוזרת',
    minutes: 10,
    goal: 'ליצור רכיב ולהשתמש בו שלוש פעמים.',
    idea: 'קומפוננטה היא פונקציה ששמה מתחיל באות גדולה ומחזירה JSX.',
    mission:
      'צרו src/components/TaskCard.tsx, ייבאו אותו ל־App והציגו שלושה מופעים.',
    tryNow: 'הביטו בדפדפן וספרו שלושה כרטיסים.',
    success: 'אותו רכיב מופיע שלוש פעמים.',
    hints: [
      'ייצאו את הפונקציה בשם TaskCard.',
      'ב־App כותבים שלושה מופעי <TaskCard />.',
    ],
    question: {
      prompt: 'למה שם הרכיב מתחיל באות גדולה?',
      options: ['כדי ש־React יזהה קומפוננטה', 'כדי לשנות צבע'],
      answer: 0,
      explanation: 'שם קטן ב־JSX מציין בדרך כלל תגית DOM.',
    },
    scaffold:
      'export function TaskCard() {\n  return <article><h2>ללמוד React</h2><p>משימה לדוגמה</p></article>\n}',
    commandIds: [],
    pause: false,
  },
  {
    id: 'pause-1',
    title: 'עצירה: שלושה רכיבים',
    minutes: 5,
    goal: 'לבדוק יחד שהרכיב חוזר.',
    idea: 'זו עצירה מקומית לשיחה עם הכיתה.',
    mission: 'בקשו מהמשתתפים להראות שלושה כרטיסים ולזהות את קובץ TaskCard.',
    tryNow: 'השוו את שלושת המופעים להגדרה אחת.',
    success: 'רואים שלושה כרטיסים מאותה קומפוננטה.',
    hints: ['ודאו שהייבוא מתאים לייצוא.', 'אין צורך להעתיק שלוש פונקציות.'],
    question: {
      prompt: 'כמה הגדרות רכיב נדרשות לשלושה מופעים?',
      options: ['אחת', 'שלוש'],
      answer: 0,
      explanation: 'משתמשים באותה הגדרה כמה פעמים.',
    },
    scaffold: '<TaskCard />\n<TaskCard />\n<TaskCard />',
    commandIds: [],
    pause: true,
  },
  {
    id: 'H06',
    title: 'Props ב־TypeScript',
    minutes: 15,
    goal: 'להעביר title ו־done מההורה לילד.',
    idea: 'Props הם קלט; הילד אינו משנה אותם.',
    mission:
      'הגדירו TaskCardProps עם title:string ו־done:boolean. הציגו שלושה כרטיסים עם ערכים שונים.',
    tryNow: 'דאגו שכרטיס אחד הושלם ואחד בתהליך.',
    success: 'הטקסט בכל כרטיס מתאים ל־Props שההורה מסר.',
    hints: [
      'השתמשו ב־destructuring בפרמטר הפונקציה.',
      'done ? "הושלם" : "בתהליך" מתאר מצב.',
    ],
    question: {
      prompt: 'מי מוסר Props למי?',
      options: ['הורה לילד', 'ילד להורה'],
      answer: 0,
      explanation: 'הילד מקבל את הקלט; callback יכול לבקש פעולה מההורה.',
    },
    scaffold:
      'type TaskCardProps = { title: string; done: boolean }\n// עדכנו את TaskCard ואת שלושת המופעים ב־App.',
    commandIds: [],
    pause: false,
  },
  {
    id: 'H07',
    title: 'State: מונה חי',
    minutes: 10,
    goal: 'לזכור מספר בין רינדורים ולעדכן את הממשק.',
    idea: 'setCount מבקש רינדור נוסף; let רגיל אינו עושה זאת.',
    mission:
      'הוסיפו useState בתוך App, והציגו כפתור שמעדכן עם פונקציה. שמרו את המונה גם בתחנות הבאות.',
    tryNow: 'לחצו כמה פעמים והשוו את המספר.',
    success: 'המספר גדל בכל לחיצה.',
    hints: [
      'ה־Hook נמצא בראש הקומפוננטה.',
      'עדכון לפי ערך קודם: setCount(prev => prev + 1).',
    ],
    question: {
      prompt: 'למה let count = 0 לא מספיק?',
      options: ['הוא לא מבקש רינדור', 'הוא תמיד אסור ב־JavaScript'],
      answer: 0,
      explanation:
        'React מרנדר מחדש בעקבות עדכון State, לא בעקבות שינוי משתנה מקומי.',
    },
    scaffold:
      'const [count, setCount] = useState(0)\n// בתוך JSX:\n<button onClick={() => setCount(prev => prev + 1)}>לחיצות: {count}</button>',
    commandIds: [],
    pause: false,
  },
  {
    id: 'H08',
    title: 'Events ורשימת משימות',
    minutes: 15,
    goal: 'להפוך את הדוגמה ללוח משימות.',
    idea: 'ה־handler מעדכן State במערך חדש; Props אינם משתנים ישירות.',
    mission:
      'צרו Task עם id/title/done. שמרו tasks ו־input, הוסיפו טופס מבוקר ו־onToggle ל־TaskCard. שלד האירוע מוצג כאן; פתרון מלא זמין אחרי שני רמזים.',
    tryNow: 'הוסיפו משימה וסמנו אותה כהושלמה.',
    success: 'נוספה משימה, מצב done מתחלף ואין שגיאות בקונסול.',
    hints: [
      'setTasks(prev => [...prev, task]) מוסיף למערך חדש.',
      'toggle משתמש ב־map ומחזיר {...task, done: !task.done}.',
    ],
    question: {
      prompt: 'איך מוסיפים משימה בלי לשנות את המערך המקורי?',
      options: ['setTasks(prev => [...prev, task])', 'tasks.push(task) בלבד'],
      answer: 0,
      explanation: 'עדכון immutable מאפשר ל־React לקבל את המצב החדש.',
    },
    scaffold:
      "type Task = { id: string; title: string; done: boolean }\nconst [tasks, setTasks] = useState<Task[]>([])\nconst [input, setInput] = useState('')\nfunction addTask(event: FormEvent<HTMLFormElement>) {\n  event.preventDefault()\n  const title = input.trim()\n  if (!title) return\n  // בנו Task עם crypto.randomUUID(), עדכנו State ונקו input.\n}",
    commandIds: [],
    pause: false,
  },
  {
    id: 'pause-2',
    title: 'עצירה: הוספה וסימון',
    minutes: 5,
    goal: 'לבדוק יחד את זרימת האירועים.',
    idea: 'בדיקת כיתה נעשית בשיחה ובהצגת מסך, ללא מעקב מקוון.',
    mission:
      'בקשו מכל משתתף להוסיף משימה ולסמן אותה. בחרו בענף סיכום 90 או בענף ההעמקה.',
    tryNow: 'הוסיפו משימה בשם שלכם וסמנו אותה.',
    success: 'ההוספה והסימון נראים בממשק.',
    hints: [
      'בדקו onSubmit ו־preventDefault.',
      'ודאו שכל משימה מוצגת עם key={task.id}.',
    ],
    question: {
      prompt: 'מה מפעיל את הוספת המשימה?',
      options: ['אירוע submit', 'Effect בכל רינדור'],
      answer: 0,
      explanation: 'פעולה של משתמש שייכת ל־event handler.',
    },
    scaffold:
      '<form onSubmit={addTask}>…</form>\n// tasks.map(task => <TaskCard key={task.id} … />)',
    commandIds: [],
    pause: true,
  },
  {
    id: 'H09',
    title: 'Snapshot ורינדור',
    minutes: 5,
    goal: 'להבין איזה ערך רואה handler שכבר נוצר.',
    idea: 'עדכון פונקציונלי אינו משנה את המשתנה שנתפס באותו handler.',
    mission:
      'לפני הרצה נחשו מה ידפיס הקוד כאשר count היה 0. אחר כך עברו לעדכון פונקציונלי.',
    tryNow: 'לחצו פעם אחת וקראו את הקונסול.',
    success: 'הקונסול מציג 0, והממשק ברינדור הבא מציג 1.',
    hints: [
      'setCount מתזמן רינדור נוסף.',
      'console.log קורא את count של הרינדור שבו נוצר ה־handler.',
    ],
    question: {
      prompt: 'מה יודפס בלחיצה הראשונה כש־count הוא 0?',
      options: ['0', '1'],
      answer: 0,
      explanation:
        'ה־handler רואה את צילום המצב הנוכחי. גם updater פונקציונלי לא משנה אותו בדיעבד.',
    },
    scaffold:
      'function handleClick() {\n  setCount(count + 1)\n  console.log(count)\n}',
    commandIds: [],
    pause: false,
  },
  {
    id: 'H10',
    title: 'Effect ושמירה',
    minutes: 10,
    goal: 'לסנכרן משימות עם localStorage ולטעון אותן מחדש.',
    idea: 'שמירה לבדה לא מספיקה: צריך initializer שקורא ומוודא את צורת הנתונים.',
    mission:
      'צרו loadTasks ו־saveTasks עם try/catch. אתחלו useState<Task[]>(loadTasks), ושמרו ב־Effect אחד עם [tasks]. ה־cleanup מודגם בצומת הנפרד הבא.',
    tryNow: 'הוסיפו משימה, רעננו ובדקו שהיא חוזרת.',
    success: 'הנתונים התקינים נטענים; נתון פגום או חסימה אינם מפילים את הממשק.',
    hints: [
      'קראו unknown מ־JSON וודאו Array וצורת כל Task.',
      'את הטיימר מדגימים בנפרד ומבטלים עם clearInterval.',
    ],
    question: {
      prompt: 'למה צריך initializer שקורא מהאחסון?',
      options: ['כדי לשחזר State ברענון', 'כדי לשנות Props'],
      answer: 0,
      explanation:
        'Effect שומר את המצב; initializer מאתחל את המצב מהערך הקודם.',
    },
    scaffold:
      'const [tasks, setTasks] = useState<Task[]>(loadTasks)\nuseEffect(() => {\n  saveTasks(tasks)\n}, [tasks])',
    commandIds: [],
    pause: false,
  },
  {
    id: 'H11',
    title: 'אתגר מסכם',
    minutes: 5,
    goal: 'להציג מספר משימות שנותרו בלי State מיותר.',
    idea: 'מידע שנגזר מהמצב מחושב בזמן render.',
    mission:
      'הציגו tasks.filter(task => !task.done).length, בדקו סימון ורענון, והסבירו Props / State / Event / Effect.',
    tryNow: 'סמנו ובטלו סימון של משימה ובדקו את הספירה.',
    success: 'הספירה משתנה והרשימה נשמרת ברענון.',
    hints: [
      'אל תשמרו remaining ב־useState נוסף.',
      'חישוב filter אינו צריך Effect.',
    ],
    question: {
      prompt: 'איפה מחשבים כמה משימות נותרו?',
      options: ['בזמן render', 'ב־Effect שמעדכן State נוסף'],
      answer: 0,
      explanation: 'זהו ערך נגזר שאפשר לחשב ישירות מ־tasks.',
    },
    scaffold: 'const remaining = tasks.filter(task => !task.done).length',
    commandIds: [],
    pause: false,
  },
]
export const HANDS_ON_BY_ID = Object.fromEntries(
  HANDS_ON_UNITS.map((unit) => [unit.id, unit]),
)
