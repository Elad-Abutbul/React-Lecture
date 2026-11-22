# DESIGN.md — React Journey

> מסמך ארכיטקטורה, עיצוב וטכנולוגיות מחייב לאתר **React Journey**. יש לקרוא אותו יחד עם `REQUIREMENTS.md` ועם מצגת React המצורפת. **יש לממש אתר אמיתי, עובד, רספונסיבי ואינטראקטיבי — לא תמונת עיצוב, לא מצגת ולא דמו של עמוד אחד.**

## 1. מטרת המוצר

האתר הוא מסע למידה בעברית, מבוסס גלילה ועץ החלטות. המשתמש בוחר תשובות כגון "כבר מותקן לי Node.js?" והענף הרלוונטי מתפתח. מתקדמים מהתקנת הסביבה, דרך יצירת פרויקט React, ועד קומפוננטות, JSX, Props, State, Render ו־Effects. העיצוב תואם לשפה של המצגת: רקע כהה וטורקיז React, עם קווים זוהרים, עומק ותנועה מתונה.

## 2. סטאק טכנולוגי

| תחום | טכנולוגיה | מעמד ושימוש |
| --- | --- | --- |
| ממשק | **React + TypeScript** | חובה; קומפוננטות פונקציונליות וטיפוסים מפורשים |
| סביבת פיתוח | **Vite** | חובה; פיתוח, build ו־preview |
| מנהל חבילות | **pnpm** | מועדף לפיתוח האתר; במדריך התלמיד מוצגות פקודות `npm` בהתאם למצגת |
| עיצוב | **Tailwind CSS v4** | חובה; utilities, tokens ו־responsive, ללא CSS מפוזר |
| רכיבי ממשק | **shadcn/ui + Radix UI** | חובה לרכיבים מורכבים כגון Dialog, Tooltip, Tabs, Accordion; התאמה אישית, לא מראה ברירת מחדל |
| סמלים | **lucide-react** | חובה; סט סמלים אחיד, ללא ערבוב אייקונים |
| אנימציות | **Motion for React (`motion`)** | חובה; `motion/react`, `useScroll`, `useTransform`, `useSpring`, `AnimatePresence`, `whileInView` |
| גלילה חלקה | **Lenis (`lenis`)** | מומלץ; לשלב רק אחרי אימות תאימות ל־Motion, נגישות ועוגנים |
| עץ החלטות | **React Flow (`@xyflow/react`)** | חובה למסך העץ האינטראקטיבי; nodes/edges מותאמים אישית, zoom ופאן מבוקרים |
| ניהול מסלול | **Zustand** | מומלץ למצב התקדמות, בחירות, ענפים פתוחים ונתוני הדגמה משותפים |
| ניווט | **React Router** | להשתמש אם יש מסלולים נפרדים (`/`, `/journey`, `/lab`); לא להוסיף routing מאולץ לדף יחיד |
| נתוני שרת | **TanStack Query (React Query)** | **רק אם קיים API אמיתי**; לא להשתמש בו עבור JSON או constants מקומיים |
| טפסים | **react-hook-form + zod** | רק לטפסים אמיתיים עם שדות ואימות; שאלות כן/לא לא דורשות טופס |
| בדיקות | **Vitest + React Testing Library** | חובה ללוגיקה, תרחישים וקומפוננטות קריטיות |
| בדיקות דפדפן | **Playwright** | חובה למסלולי התקנה, בחירת ענפים, גלילה, RTL ומובייל |
| איכות קוד | **ESLint + Prettier** | חובה; `typescript-eslint`, כללי hooks ושמירה על סדר |

**אין צורך ב־Backend, MongoDB, Express או React Query בגרסת MVP.** זהו מדריך אינטראקטיבי עם תוכן מובנה מקומי. אין ליצור קריאות רשת מיותרות. אם יתווספו משתמשים, חשבונות, שמירה בענן או תוכן שנמשך משרת — יש להוסיף שכבת API, TanStack Query ושרת בנפרד.

## 3. ספריות לאפקט הגלילה ועץ ההחלטות

### Motion — המנוע המרכזי

- שימוש ב־`useScroll` למעקב אחרי התקדמות גלילה של עמוד או section.
- שימוש ב־`useTransform` לתרגום התקדמות הגלילה לאנימציה: אורך קו SVG, שקיפות, תנועה קלה ו־scale.
- שימוש ב־`useSpring` לריכוך שינויים, בלי לנתק את המיקום החזותי מהגלילה.
- שימוש ב־`AnimatePresence` לפתיחה/סגירה של ענפים ורכיבי הסבר.
- שימוש ב־`whileInView` לחשיפת cards רק כשנכנסים לאזור שלהם.
- יש להימנע מאנימציית layout יקרה על עשרות צמתים בכל frame.

### React Flow — הליבה של עץ ההחלטות

- ליצור node types: `question`, `command`, `explanation`, `checkpoint`, `success`, `errorHelp`.
- ליצור edge type מותאם עם stroke זוהר עדין וחיווי לענף שנבחר.
- הבחירה בצומת מעדכנת `journey state` וחושפת **רק** את הענף המתאים; אפשר לחזור אחורה ולשנות החלטה.
- יש לאפשר ניווט במקלדת, focus ברור, כפתורי בחירה כאלמנטים סמנטיים ותיאור קשרים בטקסט.
- בדסקטופ העץ יכול להיות מפה עם zoom/pan; במובייל יש להציג **מסלול אנכי ליניארי** עם אותם נתונים במקום קנבס צפוף.
- לא להפעיל drag לעריכת צמתים: המשתמש לומד, לא בונה תרשים.
- התקדמות גלילה באזורים הסיפוריים יכולה להדגיש node או edge, אבל אין לקשור את כל ה־page scroll ל־zoom לא צפוי.

### Lenis — שכבת ליטוש בלבד

- מיועד לגלילה חלקה; אינו מחליף את Motion ואינו מנהל את עץ ההחלטות.
- לאפשר מעבר חלק בין sections, תוך שמירה על anchors, מקלדת, מגע וגלילה טבעית.
- לכבד `prefers-reduced-motion`; במצב זה לכבות smooth scrolling ואנימציות דקורטיביות.
- אם נוצרים קונפליקטים עם React Flow, תוכן דביק או נגישות, להסיר את Lenis ולהשתמש בגלילת דפדפן רגילה.

## 4. כיוון אמנותי — React Neon Learning Lab

**תחושה:** חוויית מוצר טכנולוגי עתידני, מדויק, חי ואלגנטי. לא אתר גיימינג עמוס, לא דף נחיתה גנרי ולא העתק של תמונת שקופית.

- רקע כחול־שחור עם גריד דק, glow מתון ו־gradient spots.
- צבע ההובלה הוא טורקיז React; סגול לצמתי ידע, ירוק להצלחה, ענבר לאזהרה.
- Hero עם אטום React שמונפש באיטיות ונתיב SVG שמתחיל ממנו וממשיך מטה בין sections.
- כרטיסי glass כהים עם גבול דק ופינות מעוגלות; highlight במעבר עכבר ו־focus.
- קו מסלול חי שמתמלא בזמן גלילה; node פעיל זוהר מעט; ענפים לא פעילים נשארים מאופקים.
- חלונית פקודה עם `Copy` ומצב "הועתק", תווית מערכת הפעלה והסבר קצר.
- קוד ופקודות תמיד ב־LTR, גם בתוך ממשק RTL.
- במקום עשרות אנימציות נפרדות, ליצור שפה אחידה של תנועה (reveal, draw-line, expand-path, focus-node).

### Design tokens (מקור אמת יחיד)

```css
@theme {
  --color-bg: #071321;
  --color-surface: #11243a;
  --color-surface-raised: #152d46;
  --color-react: #61dafb;
  --color-text: #f2f7fc;
  --color-muted: #a8bed0;
  --color-violet: #a78bfa;
  --color-success: #69e6bb;
  --color-warning: #f6c76a;
  --radius-card: 1.25rem;
}
```

הצבעים, הרדיוסים, הצללים והזמנים נלקחים מטוקנים; **אסור** לשכפל hex או magic numbers בתוך קומפוננטות.

### טיפוגרפיה

- **IBM Plex Sans Hebrew** לממשק בעברית; **JetBrains Mono** לפקודות ולקוד.
- לשמור קובצי פונטים מקומיים בפרויקט ולתת `font-display: swap`.
- כל הדף: `lang="he" dir="rtl"`; בכל בלוק קוד/CLI: `dir="ltr"` ו־`text-align: left`.
- שורות קוד ארוכות נגללות אופקית בתוך הבלוק ולא שוברת את ה־layout.

## 5. מבנה מסכים והתנהגות

1. **Hero:** הבטחה ברורה; כפתור "מתחילים"; סקירת השלבים; התקדמות.
2. **למה React:** השוואה חיה בין DOM ידני לבין React עם כפתורים, לא טקסט בלבד.
3. **מדריך התקנה:** שאלות על מערכת הפעלה, Node.js, npm, יצירת פרויקט עם Vite, `npm install`, `npm run dev`, תקלות, ואימות תוצאה.
4. **עץ קבצים:** `index.html` → `main.tsx` → `App.tsx` → קומפוננטות; בחירת קובץ חושפת קוד, הסבר והקשרים.
5. **יסודות:** קומפוננטות, JSX/TSX, Props, State/useState, Snapshot, Render/Commit/Paint, useEffect/Cleanup.
6. **מעבדה אינטראקטיבית:** ארבע תחנות Components / Props / State / Effect עם דוגמאות עובדות ופעולות משתמש.
7. **סיכום:** שאלות הבנה, משוב מיידי, אפשרות חזרה לצומת והפניות לתיעוד הרשמי.

בכל section: כותרת, למה זה חשוב, אינטראקציה מרכזית, קוד/תוצאה, כפתור המשך או מעבר אוטומטי ברור; אין להציג מסכי תוכן ריקים.

## 6. כלל ארכיטקטוני מחייב: constants-first, no scattered hardcoding

**כל טקסט קבוע, פקודת התקנה, תוכן לימודי, שאלה/תשובה, צומת, קישור, שם של מסך, מספר קבוע, עיצוב חוזר, אנימציה קבועה וערך קונפיגורציה — יש להגדיר במיקום מרכזי מתאים ולא לקודד ישירות בתוך JSX או handlers.**

הכוונה אינה לשים הכול בקובץ ענק בשם `constants.ts`, אלא לחלק לפי תחומי אחריות:

- `src/constants/routes.ts` — נתיבים ומזהי ניווט.
- `src/constants/navigation.ts` — שמות sections ותפריט.
- `src/constants/theme.ts` — ערכים לוגיים לטוקנים/מיפוי צבעים כשצריך JS; צבעי CSS נשארים ב־theme.
- `src/constants/animation.ts` — durations, easings, spring presets, thresholds.
- `src/constants/commands.ts` — פקודות `npm`, נתיבי התקנה והסברים.
- `src/constants/links.ts` — קישורים חיצוניים רשמיים.
- `src/content/journey.ts` — צמתי עץ ההחלטות, תשובות, edge definitions, תנאי מעבר.
- `src/content/lessons.ts` — טקסטי פרקים, דוגמאות קוד ושאלות בדיקה.
- `src/content/files.ts` — מבנה עץ הקבצים ותפקיד כל קובץ.
- `src/types/` — טיפוסים משותפים ל־node, branch, section, command ו־lesson.

**אסור:**

```tsx
function InstallStep() {
  return <button>npm install</button>; // טקסט ופקודה מפוזרים ב-JSX
}
```

**צריך:**

```ts
// src/constants/commands.ts
export const COMMANDS = {
  CREATE_REACT: 'npm create vite@latest my-app -- --template react-ts',
  ENTER_PROJECT: 'cd my-app',
  INSTALL: 'npm install',
  DEV: 'npm run dev',
} as const;
```

```tsx
// src/components/journey/CommandCard.tsx
import { COMMANDS } from '@/constants/commands';

export function CommandCard() {
  return <code dir="ltr">{COMMANDS.INSTALL}</code>;
}
```

עדיף להציג פקודות מתוך `commandId` במודל הנתונים של הצומת, ולא לייבא `COMMANDS` בכל קומפוננטה. ה־UI צריך להיות **data-driven**: תכנים ותצורת העץ באים מקובצי content/constants, והקומפוננטות רק מציגות אותם.

**הבחנה חשובה:** מצב משתמש דינמי (בחירות, התקדמות, מונה, הודעת הצלחה זמנית) הוא state — **לא constant**. גם טיפוסי קלט, לולאות, ושדות הנגזרים מנתוני משתמש אינם ערכים שיש לקבע. המטרה היא לאפס כפילויות ו־magic values, לא לפגוע בלוגיקה.

## 7. מודל נתונים לעץ החלטות

```ts
export type Choice = {
  id: string;
  label: string;
  nextNodeId: string;
};

export type JourneyNode = {
  id: string;
  kind: 'question' | 'command' | 'explanation' | 'checkpoint' | 'success' | 'errorHelp';
  title: string;
  description?: string;
  commandId?: keyof typeof import('@/constants/commands').COMMANDS;
  choices?: readonly Choice[];
};
```

- מזהי הצמתים והמעברים צריכים להיות יציבים.
- ליצור מנגנון אחד שמחשב את **המסלול הפעיל** לפי בחירות המשתמש ומוודא שאין צומת יעד לא קיים.
- שינוי בחירה מוקדמת מוחק בחירות והשלמות של ענפים שכבר אינם תקפים.
- יש מצב `completed` ו־`current` נפרדים כדי לא לסמן כבוצעה פקודה שהמשתמש רק ראה.
- אין לבצע בדיקות מערכת מקומית מתוך הדפדפן: האתר **לא יכול לדעת לבד** אם Node.js מותקן במחשב המשתמש. יש להציג פקודת בדיקה ולבקש אישור ידני.

## 8. ארגון תיקיות מומלץ

```text
src/
├── app/
│   ├── App.tsx
│   └── providers.tsx
├── assets/
│   └── fonts/
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Progress, Section
│   ├── journey/            # QuestionNode, CommandNode, FlowCanvas, MobileJourney
│   ├── motion/             # Reveal, DrawPath, ScrollProgress
│   └── labs/               # Live demos
├── constants/
│   ├── animation.ts
│   ├── commands.ts
│   ├── links.ts
│   ├── navigation.ts
│   ├── routes.ts
│   └── theme.ts
├── content/
│   ├── journey.ts
│   ├── lessons.ts
│   ├── files.ts
│   └── quiz.ts
├── hooks/
│   ├── useJourney.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── flow-layout.ts
│   └── utils.ts
├── store/
│   └── journey-store.ts
├── styles/
│   └── globals.css
├── types/
│   └── journey.ts
└── main.tsx
```

יש להשתמש ב־`@/` alias, להימנע מקומפוננטות ענקיות, ולהוציא לוגיקה טהורה לקובצי `lib` הניתנים לבדיקה.

## 9. חוויית גלילה — מפרט מימוש

- Header מינימלי ו־scroll progress יציב.
- לכל section יש עוגן קבוע (`id` מתוך `constants/navigation.ts`).
- למסלול SVG מרכזי יש progress שמונע מ־`useScroll` + `useTransform` ומותאם לגודל section.
- כניסה לצומת מפעילה reveal ומדגישה את הקו אליו; בחירה פותחת ענף עם AnimatePresence.
- אפשר לגלול ידנית בכל שלב; אין scroll-jacking ואין חסימת גלגלת.
- ענפים שנפתחו לא גורמים לקפיצות פתאומיות או איבוד focus.
- תמיכה ב־`prefers-reduced-motion`, touch, מקלדת ו־sticky elements.
- לבצע lazy loading לרכיבים כבדים כגון FlowCanvas אם צריך; למנוע רינדורים חוזרים של כל העץ בכל pixel גלילה.

## 10. התאמה למכשירים ונגישות

- **Desktop:** תצוגת Flow עשירה עם פרטים בצד, תוכן לימודי לאורך הגלילה.
- **Tablet:** פחות ענפים בו־זמנית ותצוגת פרטים מתחת לצומת.
- **Mobile:** רצף כרטיסי החלטה אנכי, קווים מחברים ופקודות נגללות; לא להכריח משתמש לבצע zoom כדי לקרוא.
- מקלדת: Tab, Enter, Space; נראות focus; סדר ניווט הגיוני.
- קונטרסט טקסט תקין; טקסט לא תלוי בצבע בלבד; ARIA כשנדרש.
- תמיכה בהגדלת גופן, ובלי אנימציות שמונעות הבנה.

## 11. בדיקות וקריטריוני קבלה

1. המשתמש יכול לעבור את מסלול ההתקנה במק ובווינדוס; כל בחירה חושפת רק את הענף הנכון.
2. כל פקודה ניתנת להעתקה; אין טענה שהאתר התקין משהו בפועל.
3. שינוי בחירה מוקדמת מעדכן את המסלול ומסיר התקדמות לא רלוונטית.
4. הגלילה מחייה את קו המסלול ואת הצמתים באופן חלק; אין קפיצות, overflow או ירידה חריפה בביצועים.
5. כל התוכן בעברית RTL; כל הקוד והפקודות LTR, ללא ערבוב חזותי.
6. מודולים משמעותיים מבוססים על `constants` ו־`content`; אין טקסטים/פקודות/צבעים מפוזרים בתוך JSX.
7. מעבדת Components, Props, State ו־Effect עובדת, ולא רק מציגה צילום קוד.
8. `prefers-reduced-motion` מכובד; ניווט מקלדת תקין; מובייל שמיש.
9. `pnpm lint`, `pnpm test`, `pnpm build` עוברים בהצלחה.
10. Playwright עובר תרחיש מלא בדסקטופ ובמובייל, כולל החלפת ענף וחזרה אחורה.

## 12. סדר בנייה מומלץ

1. Scaffold, TypeScript, Tailwind, shadcn, fonts, tokens ו־RTL.
2. הגדרת types, constants, content ומודל מסלול פעיל עם בדיקות יחידה.
3. בניית כרטיסי צמתים, פעולות בחירה ו־CommandCard.
4. חיבור React Flow בדסקטופ והחלופה האנכית במובייל.
5. הוספת Motion: reveal, draw-path, transitions ו־scroll progress.
6. הוספת Lenis רק אם לא נפגעת נגישות או התנהגות Flow.
7. בניית שיעורים, עץ קבצים ומעבדות חיות.
8. בדיקות Playwright, ביצועים, רספונסיביות ותיקון פרטים.

## 13. פקודת עבודה לסוכן פיתוח

> Build the complete React Journey website using `REQUIREMENTS.md` and `DESIGN.md`. Use React + TypeScript + Vite, Tailwind v4, shadcn/ui, Motion for React, React Flow, and optional Lenis. Create a high-quality dark React-themed Hebrew RTL experience with animated scroll storytelling and a functioning decision tree for React installation. Store all static copy, command snippets, navigation labels, lesson data, flow nodes and edges, design configuration, and animation presets in organized `constants/` or `content/` modules. Keep components data-driven; avoid scattered hardcoded literals and magic numbers. Do not add React Query or a backend unless actual remote data is required. Implement working demo interactions, responsive mobile fallback, accessible reduced-motion behavior, and tests. Do not stop at a static landing page or mockup.

## 14. אסמכתאות טכניות

- Motion scroll: https://motion.dev/docs/react-use-scroll
- Motion scroll examples: https://motion.dev/docs/react-scroll-animations
- React Flow: https://reactflow.dev/learn/concepts/building-a-flow
- React Flow dynamic layout: https://reactflow.dev/examples/layout/dynamic-layouting
- Lenis: https://lenis.dev/
- React: https://react.dev/learn
- Vite: https://vite.dev/guide/

> מקור התוכן הלימודי: המצגת המצורפת "מה זה React — ואיך בונים איתו ממשק?". בחירות הספריות והארכיטקטורה כאן הן המלצות יישום עבור האתר, ולא טענות שנלקחו מהמצגת.

## 15. הרחבת ניווט: Spatial Branching Journey

הוראות פרק זה מעדכנות את התצוגה האנכית הראשונית ואת האיסור על zoom אוטומטי: תנועת המצלמה מוגבלת למקטע המסע ומתבצעת בכוונת גלילה או בחירה מפורשת, ללא scroll-jacking של שאר האתר.

- `src/constants/tree.ts`: מיקומים קבועים, קשרים נגזרים מהגרף הקנוני, zoom, גדלי canvas, offsets ומרווחי התקדמות. קוד התצוגה אינו ממציא מיקומים או יעד ניווט.
- `flow-layout.ts` בונה צמתי מסלול, אפשרויות נחשפות וקשרים משותפים. בחירה ביעד משתמשת בפעולת הבחירה של Zustand, עם אישור לפני הסרת התקדמות תלויה. shared node מופיע פעם אחת עם כמה קשתות נכנסות.
- `TreeCamera` משתמש ב־Motion values וב־React Flow viewport. גלילה מתורגמת לאינטרפולציה על המסלול, לא ל־setState בכל פיקסל. בבחירה המצלמה מתכנסת ליעד ומתרחקת כאשר הוא מציע הסתעפות. מצב חקירה משהה את המצלמה האוטומטית.
- Stage דביק ומרווח גלילה מחושב משאירים את שאר העמוד בגלילה טבעית; בחירת ענף אינה מריצה פקודות. מקלדת ומצב מופחת תנועה מציעים אותן החלטות בלי תלות במחוות.
- סדנת Hands-on משתמשת באותו canvas ובאותו renderer router, עם state מתמיד נפרד. המיקומים והקשרים שלה נובעים מ־`constants/handsOn.ts`; התוכן והפתרונות מ־`content/handsOn.ts` ו־`content/handsOnSolutions.ts`.
- רכיבי הסדנה: EntryCard, ExerciseNode, CodeSnippet, HintStepper, CheckpointQuestion, WorkshopProgress ו־InstructorMode. אין router נוסף, ספריות state/animation כפולות או API מדומה.
- עבור דוגמאות H08–H11 נדרשת בדיקת TypeScript/production build של קובצי הפתרון בפועל, בנוסף לבדיקות האתר. קוד מוצג כתוכן, ללא eval.

## 16. Immersive World — ארכיטקטורה מחליפה

עדכון זה גובר על ה־AppShell וה־FlowCanvas המוטמעים ועל פריסה של עמוד כרטיסים. קוד ותוכן לימודי קיימים נשמרים אך מורכבים כסצנות במסך מלא.

- `ImmersiveWorld`: viewport קבוע; `world-stage` יחיד עם transform מצלמה, סצנות במיקומים מ־constants וקשרי SVG. גלילת document טבעית אחת מזינה ScrollTrigger; אין scroll containers פנימיים.
- `useWorldCamera`: GSAP camera object/quick setters, מיפוי scroll אל קואורדינטות x/y/zoom, מעבר אלכסוני בבחירה, zoom-out להסתעפות, cleanup מלא ותגובה לשינוי רוחב. לא מבצעים setState בכל פיקסל.
- `constants/world.ts`: הגדרות סצנות, מידות, מסלולים, offsets, camera presets, parallax ו־cursor spring. תוכן נשאר ב־content. renderer מתחלף לפי סוג סצנה, ללא שכפול מנוע המסלול.
- החלטות ופקודות אינן מושלמות בגלילה. כניסה לנתיב היא לחיצה על סצנת ענף; כל אישור ביצוע הוא ידני. מקלדת, touch ו־reduced motion מציעים את אותם נתיבים עם תנועה מינימלית.
- `Atmosphere` / `ReactAtom`: שכבות קלות ועצלות, DPR מוגבל, fallbacks ללא WebGL. אין תלות ב־3D לשום משימה. סמן העכבר אינו מוסתר כשהדבר פוגע בשימושיות.
- התקנה, לימוד וסדנה משתמשים באותו עולם; משימות סדנה מורכבות בתצוגות משימה/קוד/רמזים/בדיקה בתוך הסצנה. עותק מלא של קובץ ארוך זמין להעתקה/הורדה ללא גלילה מקוננת.

## 17. מרכז החלטה ומנוע מחוות

- `constants/gestures.ts`: ספים, מרווח איפוס מחווה, מיפוי כיוון פיזי לכל choice, שמות כיוונים והנחיות. `gesture-engine.ts` בודק intent באופן טהור; hook מקומי ל־wheel/keydown/touch מנקה listeners ו־cooldown.
- צומת השורש התצוגתי והלוגי הוא Node.js; צמתי פתיחה ישנים יכולים להישאר כתוכן היסטורי, ללא כפיית מסך פתיחה. migrate של persist משמר בחירות והשלמות משמעותיות.
- קנבס עולם fixed ממלא viewport. שאלת הסצנה הפעילה מרוכזת בלוח פוקוס מלא־מסך; חיבורים וציוני מרחב מאחוריו נעים באמת ב־x/y דרך GSAP/ScrollTrigger. אין קלפים רחוקים או מסגור תרשים.
- horizontal intent בוחר רק בצומתי שאלה. שדות, קוד, Dialog ו־Tabs אינם מאבדים את מקשי החצים שלהם. Wheel אנכי רגיל נשאר native. במגע נדרשת החלקה אופקית מכוונת.
- reduced motion שומר את אותם כיוונים ופקדים ללא טיסת מצלמה; סמן React אינו מסתיר את הסמן הנגיש. בדיקות browser בודקות deltaX קטן/גדול, diagonal, מקלדת וחזרה לצומת משותף.
