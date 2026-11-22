export const FILES = [
  {
    id: 'html',
    path: 'index.html',
    role: 'מעטפת הדף ונקודת השורש',
    relation:
      'הדפדפן טוען את HTML. תגית הסקריפט מפנה ל־main.tsx, והרכיבים יוצגו בתוך root.',
    code: '<div id="root"></div>\n<script type="module" src="/src/main.tsx"></script>',
  },
  {
    id: 'main',
    path: 'src/main.tsx',
    role: 'מחברים את React לדף',
    relation:
      'createRoot מחבר את App לאלמנט root שב־index.html. App אינו מחליף את דף ה־HTML.',
    code: "import { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')!).render(<App />)",
  },
  {
    id: 'app',
    path: 'src/App.tsx',
    role: 'קומפוננטת הכניסה',
    relation:
      'App מרכיב את המסך מחלקים קטנים יותר. בפרויקט הזה הוא נמצא בתוך src/app/.',
    code: 'import { Welcome } from \'./components/Welcome\'\n\nexport default function App() {\n  return <Welcome name="Dana" />\n}',
  },
  {
    id: 'components',
    path: 'src/components/Welcome.tsx',
    role: 'רכיב עם אחריות אחת',
    relation: 'רכיב לשימוש חוזר מקבל נתונים ומחזיר תיאור של הממשק.',
    code: 'type Props = { name: string }\n\nexport function Welcome({ name }: Props) {\n  return <h2>Hello {name}!</h2>\n}',
  },
  {
    id: 'css',
    path: 'src/styles/globals.css',
    role: 'העיצוב המשותף',
    relation:
      'קובץ CSS מגדיר צבעים, טיפוגרפיה ופריסה. מייבאים אותו מנקודת הכניסה.',
    code: 'body {\n  margin: 0;\n  font-family: sans-serif;\n}',
  },
  {
    id: 'package',
    path: 'package.json',
    role: 'תלויות ופקודות הפרויקט',
    relation:
      'dependencies מגדיר חבילות; scripts מגדיר את הפקודות שאפשר להריץ.',
    code: '{\n  "scripts": { "dev": "vite", "build": "tsc -b && vite build" },\n  "dependencies": { "react": "...", "react-dom": "..." }\n}',
  },
  {
    id: 'vite',
    path: 'vite.config.ts',
    role: 'הגדרות כלי הפיתוח',
    relation:
      'כאן מגדירים למשל את תוסף React וכינויי נתיבים. זה קובץ כלי עבודה, לא רכיב UI.',
    code: "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })",
  },
  {
    id: 'ts',
    path: 'tsconfig.app.json',
    role: 'כללי בדיקת TypeScript',
    relation:
      'מגדירים את בדיקת הטיפוסים ואת התמיכה ב־JSX. אין חובה שכל פרויקט יכיל את אותם קובצי הגדרות.',
    code: '{ "compilerOptions": { "strict": true, "jsx": "react-jsx" } }',
  },
] as const
export const FILE_COPY = {
  title: 'מפת הקבצים',
  intro:
    'לחיצה על קובץ חושפת את תפקידו ואת החיבור הבא בשרשרת. זהו מבנה לדוגמה; שמות ומיקומים יכולים להשתנות בין פרויקטים.',
  trace: 'index.html → main.tsx → App.tsx → UI',
  tree: 'עץ קובצי הפרויקט',
  root: 'my-app/',
  role: 'התפקיד',
  check: {
    prompt: 'איפה React מתחבר בפועל ל־HTML?',
    options: ['ב־main.tsx באמצעות createRoot', 'בתוך package.json'],
    answer: 0,
    explanation:
      'main.tsx מאתר את root מתוך index.html, ו־createRoot מציג בתוכו את רכיבי React.',
  },
} as const
