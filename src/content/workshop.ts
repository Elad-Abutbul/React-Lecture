import type { WorkshopStep } from '@/types/course'
export const WORKSHOP: readonly WorkshopStep[] = [
  {
    id: 'W00',
    title: 'מפרקים את צילום היעד',
    minutes: 8,
    goal: 'להבין מה בונים ואילו חלקים חוזרים.',
    concept:
      'מפרידים בין רכיבים, State ונתונים שאפשר לחשב. צילום היעד הוא עיצוב מנחה, לא הוכחה שהאפליקציה כבר כתובה.',
    instructions: [
      'פתחו את התמונה והצביעו על Navbar, שלושת המונים, חיפוש, טופס, מסננים ורשימת משימות.',
      'רשמו: tasks, input ו־filter צריכים זיכרון; מספר המשימות מחושב מהמערך.',
      'אם כבר הכנתם פרויקט בהרצאה, המשיכו בו. אחרת פתחו כאן את הכנת הפרויקט לסדנה; מדריך התקנה ותקלות מלא זמין גם ב־L01 דרך המפה.',
    ],
    expectedResult: 'רשימת רכיבים ותוכנית בנייה; אין צורך לכתוב הכול בבת אחת.',
    basicHint: 'שורת משימה חוזרת כמה פעמים, ולכן מתאימה לרכיב עצמאי.',
    fullHintExplanation:
      'App מחזיק את הנתונים ומעביר אותם לרכיבים. שלד התחלתי תקין מאפשר להוסיף כל רכיב בתורו.',
    files: ['src/App.tsx'],
    highlight: 'layout',
    selfCheck: ['האם completedCount צריך State נוסף? לא — מחשבים מ־tasks.'],
  },
  {
    id: 'W01',
    title: 'Navbar — קומפוננטה ראשונה',
    minutes: 12,
    goal: 'לבנות פס עליון עם React Tasks ושני טאבים.',
    concept: 'קומפוננטה היא פונקציה בשם שמתחיל באות גדולה ומחזירה JSX.',
    instructions: [
      'צרו src/components/Navbar.tsx וייבאו אותו ב־src/App.tsx.',
      'העבירו בחירת Tasks/Guide דרך Props. השתמשו ב־flex, gap ו־p לריווח.',
      'שמרו את הטקסטים ב־src/constants/tasks.ts.',
    ],
    expectedResult: 'פס לבן עם סמל React, שם האפליקציה ושתי אפשרויות נגישות.',
    basicHint:
      'App יודע איזה אזור מוצג. Navbar מקבל ערך ופונקציה כדי לבקש שינוי.',
    fullHintExplanation:
      'הטאבים משתמשים בכפתורים עם aria-pressed; אלה פעולות בתוך אפליקציית התלמיד, לא ניווט בעץ.',
    files: [
      'src/components/Navbar.tsx',
      'src/constants/tasks.ts',
      'src/App.tsx',
    ],
    highlight: 'navbar',
    selfCheck: ['שנו את הכותרת בקבועים ובדקו שהיא משתנה בדפדפן.'],
  },
  {
    id: 'W02',
    title: 'Hero ועימוד רספונסיבי',
    minutes: 10,
    goal: 'למרכז את האפליקציה וליצור כותרת קריאה.',
    concept:
      'Tailwind מחבר עיצוב לרכיב באמצעות className, בלי להחליף את React.',
    instructions: [
      'צרו src/components/Hero.tsx והוסיפו אחרי Navbar.',
      'השתמשו ב־max-w-5xl mx-auto למעטפת ובריווח פנימי רספונסיבי.',
      'התמונה מנחה את השפה הבהירה, הסגול והציאן; אין צורך להעתיק טקסט קטן ממנה.',
    ],
    expectedResult: 'כותרת, הסבר קצר ורוחב קריא גם בטלפון.',
    basicHint: 'רוחב מקסימלי ורווח פנימי מונעים מטקסט להיצמד לקצוות.',
    fullHintExplanation:
      'המעטפת מגבילה רוחב, ו־sm: משנה עימוד רק כשהמסך רחב מספיק.',
    files: ['src/components/Hero.tsx', 'src/App.tsx'],
    highlight: 'layout',
    selfCheck: ['צמצמו את החלון: האם כל הטקסט נשאר קריא בלי overflow אופקי?'],
  },
  {
    id: 'W03',
    title: 'Task ונתוני פתיחה',
    minutes: 10,
    goal: 'להגדיר טיפוס משימה ומערך נתונים קבוע.',
    concept:
      'טיפוס משותף מתאר את החוזה בין הרכיבים; id יציב מזהה משימה גם אחרי מחיקה.',
    instructions: [
      'צרו src/types/task.ts עם id, title ו־completed. קטגוריה אופציונלית תתווסף בבונוס.',
      'צרו INITIAL_TASKS ו־FILTER_LABELS ב־src/constants/tasks.ts.',
      'הציגו את הנתונים לבדיקה ב־App. אל תשתמשו באינדקס כמזהה.',
    ],
    expectedResult:
      'נתונים ברורים עם מזהים ייחודיים; 8 משימות פתיחה, 3 הושלמו ו־5 פעילות.',
    basicHint: 'כל משימה היא אובייקט; מערך אחד יאפשר לחשב את שלושת המונים.',
    fullHintExplanation:
      'הטיפוסים והקבועים נשמרים בנפרד כדי שכל רכיב יקבל אותו מבנה נתונים.',
    files: ['src/types/task.ts', 'src/constants/tasks.ts', 'src/App.tsx'],
    highlight: 'list',
    selfCheck: [
      'מה יקרה אם שני פריטים יקבלו אותו id? React לא יוכל לזהות אותם נכון.',
    ],
  },
  {
    id: 'W04',
    title: 'TaskItem עם Props',
    minutes: 13,
    goal: 'להציג משימה אחת באמצעות רכיב חוזר.',
    concept:
      'App הוא בעל ה־State; הילד מקבל משימה ו־callbacks, ומדווח על פעולה.',
    instructions: [
      'צרו src/components/TaskItem.tsx עם checkbox, כותרת, עריכה ומחיקה.',
      'הגדירו Props עם Task ופונקציות onToggle/onDelete/onEdit.',
      'בשלב זה callbacks זמניים אינם משנים את הנתונים; נחבר אותם ב־W07.',
    ],
    expectedResult: 'שורה לבנה קריאה עם מצב השלמה ואזורי פעולה נגישים.',
    basicHint:
      'הרכיב צריך משימה אחת בלבד, לא את כל המערך. עריכת טיוטה יכולה להיות State מקומי.',
    fullHintExplanation:
      'ערך checkbox נשלט על ידי ה־Props. עריכת שם שולחת את השם הנקי להורה, בלי לשנות את האובייקט המקורי.',
    files: ['src/components/TaskItem.tsx', 'src/App.tsx'],
    highlight: 'list',
    selfCheck: [
      'האם הילד משנה ישירות task.completed? לא — הוא קורא ל־callback.',
    ],
  },
  {
    id: 'W05',
    title: 'TaskList, map ו־key',
    minutes: 14,
    goal: 'לרנדר שורת משימה לכל אובייקט במערך.',
    concept:
      'map מחזיר רכיב לכל פריט; key יציב מחבר את זהות הפריט לזהות הרכיב.',
    instructions: [
      'צרו src/components/TaskList.tsx והשתמשו ב־tasks.map.',
      'העבירו key={task.id} ואת callbacks ל־TaskItem.',
      'הוסיפו הודעה לרשימה ריקה. בשלב זה כפתורי השינוי עדיין דמה.',
    ],
    expectedResult: 'כל נתוני הפתיחה מוצגים בשורות; מערך ריק מציג הסבר.',
    basicHint: 'אל תכתבו שמונה שורות ידנית. צרו שורה אחת לכל פריט בנתונים.',
    fullHintExplanation:
      'הרשימה רק מציגה ומעבירה אירועים להורה. היא אינה שומרת עותק נוסף של המערך.',
    files: ['src/components/TaskList.tsx', 'src/App.tsx'],
    highlight: 'list',
    selfCheck: [
      'הוסיפו נתון בקבועים: האם נוספת שורה בלי לשנות את JSX של הרשימה?',
    ],
  },
  {
    id: 'W06',
    title: 'טופס, אירוע ו־useState',
    minutes: 15,
    goal: 'להוסיף משימה חדשה מקלט המשתמש.',
    concept:
      'controlled input מקבל value מ־State ומעדכן אותו ב־onChange. onSubmit מטפל בפעולה.',
    instructions: [
      'צרו AddTaskForm.tsx עם useState למחרוזת הטיוטה.',
      'ב־onSubmit בצעו preventDefault, trim ובדיקה שאינו ריק.',
      'העבירו ל־App פונקציה onAdd והוסיפו אובייקט עם crypto.randomUUID למערך חדש.',
    ],
    expectedResult:
      'שם תקין מתווסף בראש הרשימה והשדה מתנקה; רווחים בלבד אינם מוסיפים משימה.',
    basicHint:
      'הטופס מחזיק את הטיוטה; App מחזיק את המשימות. לאחר השליחה מנקים רק את הטיוטה.',
    fullHintExplanation:
      'עדכון פונקציונלי מקבל את המערך העדכני ומחזיר מערך חדש. אין צורך ב־Effect כדי לטפל בשליחה.',
    files: ['src/components/AddTaskForm.tsx', 'src/App.tsx'],
    highlight: 'form',
    selfCheck: ['שלחו משימה ריקה ואז תקינה: רק התקינה צריכה להופיע.'],
  },
  {
    id: 'W07',
    title: 'השלמה, מחיקה ועריכה',
    minutes: 13,
    goal: 'לעדכן משימה בודדת בלי לשנות State במקום.',
    concept: 'map מתאים לעדכון ו־filter להסרה; spread יוצר אובייקט חדש.',
    instructions: [
      'חברו toggleTask עם map והיפוך completed לפי id.',
      'חברו deleteTask עם filter.',
      'חברו editTask שמחליף title בלבד; דחו שם ריק ותנו אפשרות ביטול לעריכה.',
    ],
    expectedResult:
      'אפשר לסמן, לערוך ולמחוק. עריכת כותרת אינה משנה את המזהה או מצב ההשלמה.',
    basicHint: 'לכל פעולה שלחו id. במערך החדש שנו רק את האובייקט המזוהה.',
    fullHintExplanation:
      'הטיוטה נשארת ב־TaskItem עד שמירה. ההורה מחליף את השם ב־map ושומר את שאר השדות באמצעות spread.',
    files: ['src/components/TaskItem.tsx', 'src/App.tsx'],
    highlight: 'list',
    selfCheck: [
      'ערכו משימה שהושלמה: האם הסימון נשמר?',
      'בטלו עריכה: האם הכותרת המקורית נשארת?',
    ],
  },
  {
    id: 'W08',
    title: 'חיפוש, סינון ושלושה מונים',
    minutes: 9,
    goal: 'לחפש לפי כותרת ולסנן הכול/פעילות/הושלמו.',
    concept: 'query ו־filter הם State. המספרים והרשימה המסוננת נגזרים מ־tasks.',
    instructions: [
      'צרו FilterTabs.tsx עם aria-pressed ואפשרויות all/active/completed.',
      'הוסיפו שדה חיפוש לפי title, בלי תלות באות גדולה/קטנה.',
      'צרו Stats.tsx: סך משימות, פעילות והושלמו בלבד. חשבו מהמערך המלא, לא מהרשימה המסוננת.',
    ],
    expectedResult:
      'החיפוש והמסנן עובדים יחד; שלושת המונים נשארים נכונים גם כשמוצגת רק משימה אחת.',
    basicHint:
      'שרשרו תנאים לסינון כותרת וסטטוס. חישבו סיכומים בנפרד לפני הסינון.',
    fullHintExplanation:
      'אין Effect שמעתיק מספרים ל־State נוסף. שינוי tasks גורם לרינדור שמחשב מחדש את הסיכומים.',
    files: [
      'src/components/FilterTabs.tsx',
      'src/components/Stats.tsx',
      'src/App.tsx',
    ],
    highlight: 'stats',
    selfCheck: [
      'השלימו משימה ואז בחרו פעילות: האם היא נעלמת והמספרים מתעדכנים?',
    ],
  },
  {
    id: 'W09',
    title: 'בונוס — קטגוריות ו־localStorage',
    minutes: 7,
    goal: 'להרחיב את האפליקציה בסנכרון חיצוני ושיוך לקטגוריות.',
    concept:
      'אתחול עצל קורא נתונים פעם אחת; useEffect מסנכרן שינויים לאחסון אחרי commit.',
    instructions: [
      'הפעילו את הבונוס באזור Guide של הדוגמה. קטגוריה נוספת לטופס ולמסנן.',
      'הוסיפו קריאה בטוחה עם JSON.parse ובדיקת הסכמה באתחול useState.',
      'שמרו באמצעות useEffect עם [tasks, bonus]. טפלו באחסון חסום בלי לקרוס. אין צורך ב־cleanup ל־setItem חד־פעמי.',
    ],
    expectedResult:
      'רק כשהבונוס מופעל, קטגוריות מוצגות והמשימות נשמרות בין רענונים.',
    basicHint:
      'אל תשמרו נתוני התחלה לפני שקראתם את הנתונים הקודמים. השתמשו בפונקציית אתחול עצלה.',
    fullHintExplanation:
      'הקוד מאמת כל אובייקט שקרא מהאחסון, ונשאר שמיש גם ב־try/catch. ניקוי interval נלמד ב־L10, ואינו נדרש לפעולת אחסון סינכרונית.',
    files: ['src/App.tsx', 'src/constants/tasks.ts', 'src/types/task.ts'],
    highlight: 'filters',
    selfCheck: [
      'הוסיפו משימה בקטגוריית עבודה, סננו אותה ורעננו.',
      'נתוני JSON פגומים צריכים להחזיר נתוני פתיחה, לא מסך שגיאה.',
    ],
    bonus: true,
  },
  {
    id: 'W10',
    title: 'בודקים את React Tasks המלאה',
    minutes: 4,
    goal: 'לחבר את כל הרכיבים ולבדוק התנהגות, רספונסיביות ונגישות.',
    concept:
      'State אחד לנתונים, Props לילדים, אירועים לפעולות ו־Effect רק לסנכרון החיצוני.',
    instructions: [
      'צרו, ערכו, השלימו ומחקו משימה. בדקו חיפוש ושילוב עם שלושת המסננים.',
      'בדקו את שלושת המונים ומצב רשימה ריקה. בדקו מקלדת ורוחב מסך צר.',
      'בבונוס, בדקו קטגוריות ושמירה אחרי רענון. בהמשך הנתיב נשמר גם חומר העזר מהגרסה המקורית.',
    ],
    expectedResult:
      'אפליקציה בהירה כמו תמונת היעד, עם כל התכונות הנדרשות וללא פרופילים או סטטיסטיקה מתקדמת.',
    basicHint: 'בדקו פעולה אחת בכל פעם, ואז שלבו פעולות כמו עריכה בזמן סינון.',
    fullHintExplanation:
      'זהו החיבור המלא של הקבצים שנבנו בהדרגה. העתיקו כל קובץ לנתיב שלו; קטעי הפתרון נבדקים כפרויקטי React + TypeScript + Tailwind.',
    files: ['src/App.tsx'],
    highlight: 'layout',
    selfCheck: [
      'האם משימות וסימוני תרגול הם מידע נפרד?',
      'האם קוד הדוגמה תואם לתוצאה שאתם רואים בדפדפן?',
    ],
  },
]
