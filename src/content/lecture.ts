import data from './lecture.json'
import installation from './installation.json'
import type { LectureStop } from '@/types/course'
export const LECTURE: readonly LectureStop[] = data
export const INSTALLATION_GUIDE = installation
export const INSTALLATION_TROUBLESHOOTING = [
  {
    title: 'node / npm אינם מזוהים',
    body: 'התקינו Node.js LTS מהאתר הרשמי; פתחו טרמינל חדש ובדקו שוב `node -v` ו־`npm -v`. אם Vite מציג engine לא נתמך, השוו לגרסה הנדרשת במדריך הרשמי.',
  },
  {
    title: 'package.json לא נמצא',
    body: 'כנראה מריצים מתיקייה אחרת. בדקו מיקום עם `pwd` (macOS) או `cd` ללא פרמטר (Windows), ורשימה עם `ls` או `dir`. היכנסו לתיקיית הפרויקט עם `cd my-react-app`, ואז `npm install` ו־`npm run dev`.',
  },
  {
    title: 'הפורט תפוס או הדף לא נפתח',
    body: 'קראו את שורת Local בטרמינל ופתחו את הכתובת המדויקת — Vite עשוי לבחור פורט אחר. אפשר לעצור את השרת שלכם עם Ctrl+C ולהפעיל מחדש. אין צורך ליצור שוב את הפרויקט.',
  },
  {
    title: 'שגיאת import או מסך ריק',
    body: 'בדקו את שגיאת הטרמינל הראשונה ואת Console בכלי הפיתוח בדפדפן. השוו שם קובץ, נתיב, אותיות גדולות/קטנות, export ו־import. שמרו את הקובץ ובדקו שוב.',
  },
  {
    title: 'Tailwind אינו משפיע',
    body: 'בדקו את פלאגין @tailwindcss/vite, את `@import "tailwindcss"` ב־src/index.css ואת הייבוא שלו ב־main.tsx. לאחר שינוי vite.config.ts עצרו את השרת שלכם עם Ctrl+C והריצו שוב `npm run dev`.',
  },
] as const
