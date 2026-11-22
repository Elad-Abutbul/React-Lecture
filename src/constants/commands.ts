export const COMMANDS = {
  NODE_VERSION: {
    code: 'node -v',
    description: 'בודקים את גרסת Node.js בטרמינל.',
    expected: 'מספר גרסה שמתחיל ב־v.',
  },
  NPM_VERSION: {
    code: 'npm -v',
    description: 'בודקים שגם npm, שמותקן יחד עם Node.js, זמין.',
    expected: 'מספר גרסה.',
  },
  CREATE_REACT: {
    code: 'npm create vite@latest my-app -- --template react-ts',
    description:
      'יוצרים פרויקט חדש בשם my-app עם React ו־TypeScript. זו יצירה של פרויקט, לא התקנת התלויות שלו.',
    expected: 'תיקיית my-app חדשה עם קובצי הפרויקט.',
  },
  ENTER_PROJECT: {
    code: 'cd my-app',
    description: 'עוברים בטרמינל לתיקיית הפרויקט החדש.',
    expected: 'הנתיב בטרמינל מסתיים ב־my-app.',
  },
  INSTALL: {
    code: 'npm install',
    description: 'מתקינים את התלויות שמוגדרות ב־package.json.',
    expected: 'ההתקנה מסתיימת ללא שגיאה ונוצרת תיקיית node_modules.',
  },
  DEV: {
    code: 'npm run dev',
    description:
      'מפעילים את שרת הפיתוח של פרויקט Vite. משאירים את הטרמינל פתוח.',
    expected: 'כתובת Local מוצגת בטרמינל. פותחים אותה בדפדפן.',
  },
  SCRIPTS: {
    code: 'npm run',
    description: 'מציגים את הסקריפטים בפרויקט הקיים. אין צורך ליצור אותו מחדש.',
    expected:
      'רשימת scripts מתוך package.json. בוחרים את סקריפט הפיתוח של הפרויקט.',
  },
} as const
export type CommandId = keyof typeof COMMANDS
