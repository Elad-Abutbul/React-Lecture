export const COURSE_FILES = [
  {
    path: 'index.html',
    role: 'דף הבסיס והשורש',
    description:
      'הדפדפן טוען HTML ובתוכו root; React מרנדר לתוך האלמנט, ולא מחליף את הדף.',
    code: '<div id="root"></div>\n<script type="module" src="/src/main.tsx"></script>',
  },
  {
    path: 'package.json',
    role: 'תלויות וסקריפטים',
    description:
      'scripts מגדיר npm run dev/build; dependencies מגדיר מה מתקינים.',
    code: '{\n  "scripts": { "dev": "vite", "build": "tsc -b && vite build" }\n}',
  },
  {
    path: 'package-lock.json',
    role: 'נעילת גרסאות npm',
    description:
      'npm יוצר את הקובץ כדי שאותה קבוצת גרסאות תותקן שוב. לא עורכים אותו ידנית.',
    code: '// קובץ שנוצר אוטומטית על ידי npm install',
  },
  {
    path: 'vite.config.ts',
    role: 'הגדרות כלי הפיתוח',
    description: 'כאן מוסיפים את פלאגיני React ו־Tailwind.',
    code: "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\nexport default defineConfig({ plugins: [react(), tailwindcss()] })",
  },
  {
    path: 'tsconfig*.json',
    role: 'הגדרות TypeScript',
    description:
      'התבנית מגדירה בדיקת טיפוסים וקובצי TS/TSX. שמרו את הגדרות התבנית לפני שינוי מתקדם.',
    code: '// הגדרות TypeScript שנוצרו בתבנית Vite',
  },
  {
    path: 'public/',
    role: 'קבצים סטטיים',
    description: 'קובץ בשם logo.svg בתוך public נגיש בכתובת /logo.svg.',
    code: '<img src="/logo.svg" alt="לוגו" />',
  },
  {
    path: 'src/main.tsx',
    role: 'נקודת הכניסה של React',
    description: 'מייבאים את App ואת CSS ומחברים לאלמנט root.',
    code: "import { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './index.css'\ncreateRoot(document.getElementById('root')!).render(<App />)",
  },
  {
    path: 'src/App.tsx',
    role: 'הרכיב הראשי',
    description:
      'App מחבר את רכיבי אפליקציית התלמיד. הנתיב כאן שייך לפרויקט Vite שאתם בונים.',
    code: 'export default function App() {\n  return <h1 className="text-4xl text-cyan-600">שלום React</h1>\n}',
  },
  {
    path: 'src/index.css',
    role: 'עיצוב גלובלי ו־Tailwind',
    description: 'מייבאים מנקודת הכניסה. Tailwind v4 מתחיל בייבוא CSS אחד.',
    code: '@import "tailwindcss";',
  },
  {
    path: 'src/App.css',
    role: 'CSS מקומי אופציונלי',
    description:
      'ייתכן שקיים בתבנית. אפשר להשתמש ב־CSS רגיל לצד Tailwind; אל תשאירו ייבוא לקובץ שמחקתם.',
    code: '/* כללי CSS אופציונליים */',
  },
  {
    path: 'src/components/',
    role: 'רכיבים לשימוש חוזר',
    description:
      'את התיקייה יוצרים בעצמנו. כאן ניצור Navbar, TaskItem ושאר חלקי הממשק.',
    code: '// src/components/Welcome.tsx\nexport default function Welcome() { return <h2>שלום!</h2> }',
  },
  {
    path: 'src/constants/',
    role: 'טקסטים והגדרות',
    description:
      'יוצרים את התיקייה לשמירת נתוני פתיחה, תוויות והגדרות במקום משותף.',
    code: "export const APP_NAME = 'React Tasks'",
  },
  {
    path: 'src/types/',
    role: 'טיפוסים משותפים',
    description: 'קובץ .ts מתאר נתונים; .tsx משלב TypeScript ו־JSX.',
    code: 'export type Task = { id: string; title: string; completed: boolean }',
  },
] as const
