# TASKS.md — React Journey

> תוכנית ביצוע מדורגת ל־Codex. **מקורות האמת:** `REQUIREMENTS.md` (התנהגות ותוכן), `DESIGN.md` (עיצוב וטכנולוגיות), והמצגת המצורפת (סדר ותוכן השיעור). במקרה של סתירה: דרישות פונקציונליות לפי `REQUIREMENTS.md`, החלטות מימוש לפי `DESIGN.md`. אין ליצור אתר מצגת סטטי.

## כללי עבודה מחייבים ל־Codex

1. **בכל איטרציה יש לבצע משימה אחת בלבד** — המשימה הלא מסומנת הראשונה שהתלויות שלה הושלמו. אין לממש משימות עתידיות ״על הדרך״.
2. לפני כל משימה: לקרוא את המשימה, הקבצים הרלוונטיים ואת קוד הפרויקט הקיים; לא לשכתב קוד תקין ללא צורך.
3. אחרי כל משימה: להריץ את בדיקות המשימה ואת `pnpm lint`, `pnpm test`, `pnpm build` כאשר הסקריפטים קיימים. לתקן שגיאות שנגרמו מהמשימה לפני סיומה.
4. לסמן `[x]` רק אחרי שכל תנאי הקבלה עברו; בסיום לדווח: מזהה משימה, קבצים שנוצרו/שונו, בדיקות ותוצאה, ומה המשימה הבאה. לא להצהיר על השלמה אם משהו לא נבדק.
5. **Constants-first:** טקסטים, פקודות, שאלות, צמתים, קישורים, הגדרות אנימציה וערכי עיצוב קבועים יישמרו ב־`constants/`, `content/` או design tokens. לא לפזר מחרוזות ו־magic numbers ב־JSX. מצב דינמי נשאר ב־state/store.
6. עברית `RTL` בממשק; בלוקי פקודות וקוד `LTR`. אין לנסות להריץ פקודות מקומיות במחשב המבקר; כל ״בוצע״ הוא אישור ידני.
7. להשתמש ב־`pnpm`, ב־React + TypeScript + Vite, ב־Tailwind CSS v4, ב־shadcn/ui, ב־Motion, ב־React Flow (החבילה `@xyflow/react`), ב־Zustand וב־Lucide. `Lenis` אופציונלי רק אם באמת משפר; `TanStack Query` רק אם מוסיפים API אמיתי — אין צורך בו ל־MVP.
8. לא להוסיף Backend, Auth, מסד נתונים, `eval`, הרצת קוד שרירותי או פיצ'רים שלא מופיעים באפיון. להשתמש בגרסאות יציבות ותואמות לפי התיעוד בעת ההתקנה, ולא לקבע מספרי גרסה במסמך.
9. אם חסר מידע לא מהותי — לבחור פתרון פשוט התואם לאפיון ולתעד ב־README. אם יש חסימה אמיתית — לדווח עליה במפורש ולא לסמן את המשימה כהושלמה.
10. בכל משימה יש לשמור על נגישות, ביצועים ורספונסיביות; בדיקות UI אוטומטיות יבואו בשלבים המתאימים.

## הגדרת ״בוצע״ לכל משימה

- הקוד עובד בפועל ולא רק מוצג כ־placeholder.
- קבצים קטנים עם אחריות אחת; קוד שניתן לבדיקה מופרד מ־UI.
- עמידה בתנאי הקבלה של המשימה ללא שבירה של מסכים קודמים.
- סימון תיבת הסימון **רק לאחר אימות**.

---

## שלב א — תשתית ועיצוב בסיסי

### T01 — יצירת פרויקט
- [x] **תלויות:** אין.
- **לבצע:** אם הפרויקט ריק, להקים React + TypeScript + Vite עם `pnpm`. אם קיים פרויקט, להתאים אותו בלי לדרוס. ליצור `src/app/App.tsx`, `src/main.tsx` ו־`README.md`; להגדיר scripts של dev, build, lint, test.
- **קבצים:** `package.json`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `README.md`.
- **קבלה:** `pnpm dev` מעלה עמוד; `pnpm build` עובר.
- **הושלם ואומת (2026-11-22):** הפרויקט הוקם בתוך `React-Lecture/`, תוך שמירת מאגר Git וכותרת ה־README הקיימים. נוספו קובצי Vite/TypeScript, `.gitignore`, הגדרת הלינטר של תבנית Vite, `pnpm-lock.yaml` ותוכן פתיחה מרכזי ב־`src/content/app.ts`.
- **תוצאות בדיקה בזמן השלמת T01:** `pnpm install --frozen-lockfile`, `pnpm lint` (Oxlint של התבנית) ו־`pnpm build` עברו. `pnpm dev --host 127.0.0.1 --port 5173 --strictPort` העלה עמוד שנבדק בדפדפן: כותרת React מוצגת, `lang="he"`, `dir="rtl"`, ללא אזהרות או שגיאות בקונסול. באותו שלב `pnpm test` הפעיל `node --test` והסתיים בהצלחה עם **0 בדיקות**, ללא כיסוי בדיקות אוטומטי. התקדמות הגדרת ESLint/Prettier/Vitest/Testing Library ובדיקת smoke מתועדת ב־T02 להלן.

### T02 — הגדרת כלים ואיכות קוד
- [x] **תלויות:** T01.
- **לבצע:** להגדיר TypeScript strict, alias `@/`, ESLint, Prettier, Vitest ו־Testing Library; להוסיף בדיקת smoke אחת לאפליקציה.
- **קבצים:** קובצי ההגדרות, `src/app/App.test.tsx`.
- **קבלה:** `pnpm lint`, `pnpm test`, `pnpm build` עוברים.
- **הושלם ואומת (2026-11-22):** הוגדר `strict` בקונפיגורציות TypeScript של האפליקציה ושל Vite, והוגדר alias ‏`@/` ב־TypeScript וב־Vite/Vitest; הייבואים באפליקציה עודכנו בהתאם. Oxlint הוחלף ב־ESLint עם כללי TypeScript, React Hooks ו־Fast Refresh; נוספו הגדרות Prettier וסקריפטים לבדיקת/החלת פורמט. הוגדרו Vitest עם jsdom, React Testing Library, matchers של jest-dom וניקוי DOM לאחר כל בדיקה. נוספה בדיקת smoke אחת שמוודאת הצגה של הכותרת והפתיח בעברית בתוך אזור התוכן הראשי.
- **תאימות ותיעוד:** TypeScript הותאם לגרסה יציבה בטווח הנתמך של `typescript-eslint`, וטווח Node ב־`package.json` עודכן לדרישות כלי הפיתוח והבדיקות. עודכנו `package.json`, `pnpm-lock.yaml`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `.gitignore`, `src/main.tsx`, `src/app/App.tsx`, פורמט `src/content/app.ts` ו־`README.md`; נוספו `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `src/test/setup.ts`, `src/app/App.test.tsx`; הוסר `.oxlintrc.json`.
- **תוצאות בדיקה:** `pnpm lint` עבר ללא אזהרות; `pnpm test` עבר עם **בדיקה אחת וקובץ בדיקות אחד**; `pnpm build`, `pnpm format:check`, `pnpm install --frozen-lockfile --strict-peer-dependencies` ו־`git diff --check` עברו. T03 לא החלה.

### T03 — Tailwind ו־design tokens
- [x] **תלויות:** T02.
- **לבצע:** להתקין Tailwind v4 דרך Vite, להגדיר theme/colors/radii/shadows לפי `DESIGN.md`, reset וגוף האתר. ללא צבעים קשיחים בקומפוננטות.
- **קבצים:** `src/styles/globals.css`, `vite.config.ts`, `src/constants/theme.ts` רק לערכים הנדרשים ב־TS.
- **קבלה:** צבעי React מופיעים; אין שגיאות CSS/Build.

- **אימות ביצוע:** feat: add Tailwind v4 and shared design tokens; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T04 — רכיבי UI, אייקונים ופונטים
- [x] **תלויות:** T03.
- **לבצע:** להגדיר shadcn/ui + Radix, רכיבי Button/Card/Badge/Tooltip/Progress הנחוצים; Lucide; פונטים מקומיים IBM Plex Sans Hebrew ו־JetBrains Mono ממקור עם רישיון מתאים ו־`font-display: swap`.
- **קבצים:** `src/components/ui/*`, `src/assets/fonts/*`, `src/styles/globals.css`.
- **קבלה:** רכיב דמו מעוצב וטקסט עברי/קוד נראים תקין גם ללא טעינת פונט מרשת חיצונית.

- **אימות ביצוע:** feat: add shadcn primitives and licensed local typography; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T05 — מעטפת RTL ומבנה עמוד
- [x] **תלויות:** T04.
- **לבצע:** להגדיר `lang="he" dir="rtl"` במסמך; ליצור `AppShell`, `Header`, `Footer`, מכולות sections עם עוגנים ומסגרת רספונסיבית. הטקסטים ומזהי הסעיפים ב־`constants/navigation.ts`.
- **קבצים:** `index.html`, `src/components/layout/*`, `src/constants/navigation.ts`, `src/app/App.tsx`.
- **קבלה:** יש כותרת + אזורי עמוד בטוחים לגלילה; אין overflow אופקי ברוחב מובייל; קוד באנגלית יוגדר LTR ברכיב ייעודי בהמשך.

- **אימות ביצוע:** feat: build responsive Hebrew RTL application shell; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T06 — Hero אינטראקטיבי ראשון
- [x] **תלויות:** T05.
- **לבצע:** Hero עם כותרת, תיאור, אטום React דקורטיבי בסגנון SVG/CSS, וכפתור ״מתחילים״ שגולל לעץ ההתקנה. להגדיר טקסט ב־`src/content/hero.ts`.
- **קבצים:** `src/components/layout/Hero.tsx`, `src/content/hero.ts`.
- **קבלה:** הכפתור באמת גולל לעוגן; האטום אינו חוסם אינטראקציה והעיצוב עובד במובייל.

---

## שלב ב — מודל נתונים והתקנת React (ללא אנימציה מורכבת)

- **אימות ביצוע:** feat: create responsive React hero with working journey anchor; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T07 — טיפוסים, פקודות וקישורים
- [x] **תלויות:** T02.
- **לבצע:** להגדיר טיפוסים ל־`JourneyNode`, `Choice`, `Command`, `Checkpoint`; להגדיר פקודות התקנה ומטא־דאטה, קישורים רשמיים ל־Node/Vite/React/VS Code/Git, ומזהים יציבים. ההסברים בעברית בקובצי data.
- **קבצים:** `src/types/journey.ts`, `src/constants/commands.ts`, `src/constants/links.ts`.
- **קבלה:** הפקודות הן `npm create vite@latest my-app -- --template react-ts`, `cd my-app`, `npm install`, `npm run dev`, וגם `node -v`, `npm -v`; אין `npm i create`.

- **אימות ביצוע:** feat: define journey types and verified installation commands; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T08 — תוכן עץ ההחלטות
- [x] **תלויות:** T07.
- **לבצע:** ליצור את כל הצמתים והמעברים מ־`REQUIREMENTS.md`: התחלה → Node מותקן? → Windows/macOS → בדיקה → פרויקט קיים/חדש → 4 פקודות → דפדפן עובד? → קבצים. לכלול ענף ״לא רוצה כרגע״, עזרה בשגיאה ואופציות Git/VS Code לא מחייבות.
- **קבצים:** `src/content/journey.ts`.
- **קבלה:** לכל תשובה יש `nextNodeId` קיים; תוכן ההתקנה נשלף מה־constants ולא משוכפל.

- **אימות ביצוע:** feat: model every setup branch and recovery route as content; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T09 — מנוע מסלול טהור
- [x] **תלויות:** T08.
- **לבצע:** ליצור פונקציות טהורות `getActivePath`, `getNextNode`, `reconcileChoices`, `validateJourneyGraph`, עם הגנה ממחזורים ויעדים לא קיימים. שינוי בחירה מוחק רק בחירות/השלמות שכבר אינן במסלול התקף.
- **קבצים:** `src/lib/journey-engine.ts`, `src/lib/journey-engine.test.ts`.
- **קבלה:** בדיקות למסלול Windows, macOS, Node קיים, פרויקט קיים, שגיאה, שינוי בחירה וגרף פגום עוברות.

- **אימות ביצוע:** feat: implement pure route reconciliation and graph validation; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T10 — Zustand ושמירה מקומית
- [x] **תלויות:** T09.
- **לבצע:** store של `choices`, `completedNodeIds`, `currentNodeId`, פעולות בחירה/השלמה/חזרה/איפוס; persist עם מפתח קבוע וגרסת סכמה ל־`localStorage`. לחשב מסלול פעיל מהמנוע, לא לשכפל לוגיקה.
- **קבצים:** `src/store/journey-store.ts`, `src/constants/storage.ts`, בדיקות store.
- **קבלה:** רענון שומר התקדמות; שינוי ענף מנקה התקדמות לא רלוונטית; איפוס עובד.

- **אימות ביצוע:** feat: persist reconciled journey progress with Zustand; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T11 — QuestionNode ו־ExplanationNode
- [x] **תלויות:** T08, T10.
- **לבצע:** לבנות כרטיס שאלה ובחירות נגישות, כרטיס הסבר, סטטוסים נבחר/הושלם/ממתין והודעת אזהרה אם החלפת בחירה מוחקת התקדמות.
- **קבצים:** `src/components/journey/QuestionNode.tsx`, `ExplanationNode.tsx`, `NodeStatus.tsx`.
- **קבלה:** אפשר לבחור, לשנות, לחזור; התשובות מגיעות מנתונים; מקלדת ו־focus עובדים.

- **אימות ביצוע:** feat: add accessible decision cards and branch-change confirmation; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T12 — CommandCard
- [x] **תלויות:** T07, T11.
- **לבצע:** בלוק פקודה LTR עם Copy, הודעת ״הועתק״, הסבר מה הפקודה עושה וכפתורי ״בוצע״ / ״יש שגיאה״. להפריד מזהה פקודה מהצגה.
- **קבצים:** `src/components/journey/CommandCard.tsx`, `src/components/journey/CommandNode.tsx`.
- **קבלה:** העתקה מעתיקה בדיוק את הפקודה; ״בוצע״ אינו מופעל בלי אישור משתמש; אין טענה להרצה אוטומטית.

- **אימות ביצוע:** feat: add precise copy-only command cards and manual confirmation; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T13 — בדיקת סביבה ופתרון תקלות
- [x] **תלויות:** T12.
- **לבצע:** להציג מסלולי Windows/macOS להתקנת Node, הוראות `node -v`, `npm -v`, אישור הצלחה או שגיאה, סיבות נפוצות (פקודה לא מוכרת, גרסה לא תואמת, פורט תפוס, שגיאת npm), וחזרה לשלב בדיקה.
- **קבצים:** `src/components/journey/CheckpointNode.tsx`, `ErrorHelpNode.tsx`, `src/content/troubleshooting.ts`.
- **קבלה:** כל תרחיש מאפשר למשתמש להמשיך; האתר לא מתיימר לבדוק מערכת הפעלה/תוכנה בפועל.

- **אימות ביצוע:** feat: implement manual environment checks and actionable recovery help; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T14 — מסלול התקנה מלא בפורמט אנכי
- [x] **תלויות:** T11–T13.
- **לבצע:** להציג את המסלול הפעיל כרשימת צמתים אנכית עם חיבורי CSS/SVG פשוטים; לשלב בעמוד כך שאפשר להשלים את כל מסלול ההתקנה בלי React Flow או אנימציות.
- **קבצים:** `src/components/journey/MobileJourney.tsx`, `src/components/journey/JourneySection.tsx`, `src/app/App.tsx`.
- **קבלה:** אפשר להגיע מתחילת העץ עד ״האתר עולה בדפדפן״ בנתיב החדש וגם הקיים. אין צמתים מתים.

---

## שלב ג — עץ עשיר, גלילה ואנימציות

- **אימות ביצוע:** feat: connect the complete vertical installation journey; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T15 — מפת זרימה בדסקטופ
- [x] **תלויות:** T14.
- **לבצע:** להשתמש ב־`@xyflow/react` להצגת הצמתים והקשרים בדסקטופ עם custom nodes. לעצב כמפת מסלול *קריאה*; לשמור את כל תוכן ההחלטות וקבלת ההחלטות במנוע הקיים.
- **קבצים:** `src/components/journey/FlowCanvas.tsx`, `src/lib/flow-layout.ts`, `src/components/journey/flow-nodes/*`.
- **קבלה:** נתיב נבחר מודגש; כל תשובה עובדת; אין גלילה שנלכדת במפת העץ; אינטראקציה נשמרת גם בתצוגה האנכית.

- **אימות ביצוע:** feat: add custom React Flow route map with shared node details; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T16 — מעבר רספונסיבי בין תצוגות
- [x] **תלויות:** T15.
- **לבצע:** דסקטופ: מפה + חלונית פרטים; מובייל: מסלול אנכי; טאבלט: פריסה פשוטה. שני הממשקים חולקים store ואינם כפולים למשתמש בו־זמנית.
- **קבצים:** `src/components/journey/JourneySection.tsx`, `FlowCanvas.tsx`, `MobileJourney.tsx`.
- **קבלה:** החלפת רוחב לא מאפסת מסלול; אין גלילה אופקית או כפתורים בלתי נגישים.

- **אימות ביצוע:** feat: share journey state across responsive map and vertical views; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T17 — Motion ומערכת אנימציות
- [x] **תלויות:** T06, T16.
- **לבצע:** להוסיף Motion, presets מאוחדים (reveal, branch, node-focus) ותמיכה ב־`prefers-reduced-motion`. אנימציות רק של opacity/transform ככל האפשר.
- **קבצים:** `src/constants/animation.ts`, `src/components/motion/Reveal.tsx`, `src/hooks/useReducedMotion.ts`.
- **קבלה:** הופעת מקטעים מתונה; בהפחתת תנועה כל המידע זמין ללא המתנה לאנימציה.

- **אימות ביצוע:** feat: add restrained reveal and branch animations with reduced motion; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T18 — קווי נתיב שמגיבים לגלילה
- [x] **תלויות:** T17.
- **לבצע:** `DrawPath` עם SVG + `useScroll`/`useTransform`, highlight לצומת פעיל ולענף שנבחר, בלי להזיז viewport בכוח. לקשור למקטע המתאים, לא לגלילת כל העמוד באופן שרירותי.
- **קבצים:** `src/components/motion/DrawPath.tsx`, `src/components/journey/DecisionEdge.tsx`.
- **קבלה:** הקו מתגלה בהדרגה בזמן גלילה; אין קפיצות layout או התרסקות בצומת משתנה.

- **אימות ביצוע:** feat: draw scroll-linked journey paths and selected flow edges; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T19 — ProgressRail וניווט מקטעים
- [x] **תלויות:** T18.
- **לבצע:** מד התקדמות דביק לפי שלבים **שהושלמו** (לא אחוזי scroll), ניווט למקטעים, הדגשת המקטע הנצפה באמצעות observer. אפשר לחזור לכל שלב.
- **קבצים:** `src/components/layout/ProgressRail.tsx`, `src/hooks/useActiveSection.ts`.
- **קבלה:** התקדמות נכונה אחרי שינוי ענף; הדגשת מקטע משתנה עם גלילה; ניווט מקלדת תקין.

- **אימות ביצוע:** feat: add completed-step progress and observed section navigation; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T20 — ליטוש גלילה ובחירה
- [x] **תלויות:** T19.
- **לבצע:** `scroll-margin`, גלילה מרוסנת רק לאחר פעולה מפורשת, focus נכון בפתיחת ענף, מניעת layout shift. לבדוק אם Lenis בכלל נחוץ; אם לא — להשאיר גלילה native.
- **קבצים:** `src/components/journey/*`, `src/styles/globals.css`.
- **קבלה:** גלילה רגילה עם עכבר, touch ומקלדת; אין scroll-jacking; reduced motion נשמר.

---

## שלב ד — תוכן לימודי המבוסס על המצגת

- **אימות ביצוע:** fix: preserve native scrolling and focus newly selected journey steps; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T21 — ״למה React?״ ומחשבה הצהרתית
- [x] **תלויות:** T05.
- **לבצע:** להשוות בצורה חיה בין עדכון DOM ידני לבין React; להבהיר שבקוד קטן Vanilla JS מתאים, ו־React הוא ספרייה ולא שפה/שרת. להציג ״מה״ לעומת ״איך״.
- **קבצים:** `src/content/lessons.ts`, `src/components/lessons/WhyReactSection.tsx`, `src/components/demos/ImperativeVsDeclarative.tsx`.
- **קבלה:** לחיצה משנה מונה ונותנת השוואה מוחשית; לא רק שתי תמונות קוד.

- **אימות ביצוע:** feat: teach declarative UI with live manual DOM and React counters; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T22 — React לעומת Vite
- [x] **תלויות:** T21.
- **לבצע:** מקטע קצר עם שתי כרטיסיות תפקידים ופקודות יצירת הפרויקט מתוך `COMMANDS`.
- **קבצים:** `src/components/lessons/ReactViteSection.tsx`, עדכון `src/content/lessons.ts`.
- **קבלה:** יש הבחנה נכונה בין ספריית UI לכלי פיתוח; אין פקודות סותרות.

- **אימות ביצוע:** feat: distinguish React and Vite using shared setup commands; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T23 — עץ קבצים לחיץ
- [x] **תלויות:** T14.
- **לבצע:** ליצור עץ פרויקט עם `index.html`, `src/main.tsx`, `src/App.tsx`, `src/components`, `package.json`, קובצי CSS/הגדרות. לחיצה מציגה קוד והסבר; להמחיש `index.html → main.tsx → App.tsx → UI`.
- **קבצים:** `src/content/files.ts`, `src/components/lessons/FileTreeSection.tsx`, `src/components/lessons/FileDetails.tsx`.
- **קבלה:** כל קובץ מרכזי נפתח; מסלול טעינה ברור; אין להניח שכל פרויקט מכיל בדיוק אותו מבנה.

- **אימות ביצוע:** feat: add keyboard-accessible project file explorer and load trace; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T24 — Components ו־JSX/TSX
- [x] **תלויות:** T23.
- **לבצע:** דמו של `Welcome` בשימוש חוזר; להסביר פונקציה שמחזירה JSX; להראות `return`, `{}`, `className`, תגית עוטפת ו־`.tsx` מול `.ts`.
- **קבצים:** `src/components/lessons/ComponentsSection.tsx`, `JsxSection.tsx`, עדכון תוכן הפרקים.
- **קבלה:** רכיבים אמיתיים מוצגים וניתן לראות הבדל כשמשנים נתונים בדמו.

- **אימות ביצוע:** feat: teach reusable components and JSX through live experiments; `pnpm lint`, `pnpm test`, `pnpm build` עברו.


### T24A — גרף מרחבי ומיקומים קנוניים
- [x] **תלויות:** T24.
- **לבצע:** מיקומי צמתים אלכסוניים וקשרים ב־constants; חשיפת ענפים ואיחודים; בחירה ישירה בצומת באמצעות המנוע הקיים, עם אישור לשינוי תלוי.
- **קבלה:** Windows/macOS מתאחדים בבדיקה; פרויקט חדש וקיים מתאחדים בדפדפן; בדיקות גרף, מיקומים ובחירה עוברות.

- **אימות ביצוע:** feat: define spatial branch positions and clickable merged graph nodes; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T24B — מצלמת גלילה והסתעפות
- [x] **תלויות:** T24A.
- **לבצע:** stage דביק, גלילה אנכית לאורך המסלול, zoom-out בהחלטה, תנועה אלכסונית בבחירה, קווי SVG מתקדמים; מצב pan/zoom אופציונלי.
- **קבלה:** גלילה אינה בוחרת תשובות או מאשרת פקודות; reduced motion ללא תנועה מורכבת; הגדרות מצלמה ב־constants.

- **אימות ביצוע:** feat: animate a scroll-driven spatial tree camera with decision zoom; `pnpm lint`, `pnpm test`, `pnpm build` עברו.


### IM01 — תיעוד ארכיטקטורת העולם והרחבת התוכנית
- [x] **תלויות:** T24B.
- **לבצע:** לעדכן אפיון, עיצוב ותוכנית למשימות עולם במסך מלא, לשמר תוכן ומצב קיים, לתעד GitHub sync מאושר.
- **קבלה:** קובצי המקור והעותקים במאגר מסונכרנים ללא מחיקת התקדמות.

- **אימות ביצוע:** docs: define full-viewport immersive world and approved GitHub workflow; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### IM02 — אב־טיפוס מצלמה אנכית ואז אלכסונית
- [x] **תלויות:** IM01.
- **לבצע:** להחליף AppShell בקנבס עולם מלא, GSAP/ScrollTrigger ומסלול כניסה → החלטה → שני ענפים אלכסוניים; בחירה ישירה וגלילה טבעית יחידה.
- **קבלה:** גלילה משנה את transform המרחב בפועל; בחירה מזיזה x וגם y; אין חלונית תרשים מוטמעת.

- **אימות ביצוע:** feat: replace the page layout with a full-viewport scroll camera prototype; `pnpm lint`, `pnpm test`, `pnpm build` עברו.


### GX01 — מפרט החלטה ממורכזת ומחוות כיוון
- [x] **תלויות:** IM02.
- **לבצע:** לעדכן אפיון ועיצוב לבחירת ענף במחווה אופקית/חצים; להסיר פתיחים וכותרות מסע מיותרות; לשמר מידע והתקדמות.
- **קבלה:** התיעוד משקף את ההנחיות האחרונות בלי מחיקת משימות קיימות.

- **אימות ביצוע:** docs: specify centered gesture-driven decisions and physical RTL directions; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### GX02 — מנוע מחוות עם סף כוונה ומקלדת
- [x] **תלויות:** GX01.
- **לבצע:** constants לכיוונים; צבירת deltaX, תמיכה באלכסון, reset/cooldown, ArrowLeft/ArrowRight ו־touch; רק שאלות בוחרות ענף.
- **קבלה:** מחוות קטנות אינן בוחרות; כיוונים נכונים פיזית ב־RTL; שדות וטאבים מוחרגים; בדיקות עוברות.

- **אימות ביצוע:** feat: add guarded horizontal and diagonal gestures with physical arrow-key navigation; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### GX03 — עולם ממורכז ללא קלפים וכפתורי כן/לא
- [x] **תלויות:** GX02.
- **לבצע:** להתחיל בשאלת Node, להציג תוכן גדול ומכווני כיוון; קנבס מלא וחיבורים נעים, ללא zoom-out מופרז או nested scroll; migrate שומר התקדמות קיימת.
- **קבלה:** גלילה משנה viewpoint, ענף מוביל למיקום אחר והתקנה מתאחדת בבדיקה; אין כותרת ״המסע שלך״ או כפתורי כן/לא.

- **אימות ביצוע:** feat: center full-screen decisions and replace yes-no clicks with guarded gestures; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### IM03 — הרחבת העולם לכל תוכן ההתקנה והלימוד
- [x] **תלויות:** GX03.
- **לבצע:** renderer סצנות וקשרים לגרף הקיים, איחודים, פרטי פקודות, checkpoints, progress ו־persist; להכין חיבור למסלול Hands-on בלי לאבד התקנה רגילה.
- **קבלה:** מסלולי התקנה קיימים עובדים בסצנות מלאות; מאשרים ידנית בלבד; אין תוכן JSX קשיח.

- **אימות ביצוע:** feat: reconnect installation and learning content as full-screen world scenes; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### IM04 — אווירה, אטום תלת־ממדי וסמן spring
- [x] **תלויות:** IM03.
- **לבצע:** רקעי סצנות דינמיים, עומק, חלקיקים, paths זוהרים, פרלקסה; R3F/Drei עם fallback; אטום עוקב עכבר ושביל עדין.
- **קבלה:** אין אפקט סמן במגע/reduced motion; 3D אינו חוסם אינטראקציה; אין טעינות WebGL מיותרות במצב מופחת.

- **אימות ביצוע:** feat: add layered atmosphere lazy 3D atom and accessible spring cursor; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### IM05 — אימות עולם, נגישות וביצועים בדפדפן
- [x] **תלויות:** IM04.
- **לבצע:** לבדוק מצלמה, בחירה ישירה, scroll, מקלדת, מובייל, reduced motion, מניעת nested scrolling ו־overflow; לתקן לפני מיזוג.
- **קבלה:** lint/test/build ובדיקת דפדפן עוברים; צילום ותיעוד מוכיחים שינוי נקודת מבט.

- **אימות ביצוע:** test: validate immersive navigation across desktop mobile and reduced motion; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T24C — נגישות, מובייל ואימות עץ מרחבי
- [x] **תלויות:** IM05.
- **לבצע:** תצוגת עץ רספונסיבית, בחירה במקלדת, ללא overflow; אימות מסלולים, בחירה ושינוי ענף בדפדפן.
- **קבלה:** lint/test/build ובדיקת דפדפן של ההסתעפות, האיחודים והמצלמה עוברים.

- **אימות ביצוע:** test: verify responsive spatial branch merges and accessible world camera; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T25 — Props (הורה → ילד)
- [x] **תלויות:** T24.
- **לבצע:** רכיב הורה בוחר שם והילד מציג אותו; להציג שני מופעים עם אותו רכיב; להדגיש props לקריאה בלבד.
- **קבצים:** `src/components/demos/PropsDemo.tsx`, `src/components/lessons/PropsSection.tsx`.
- **קבלה:** שינוי השם בהורה משנה את הטקסט בילד בלי שינוי קוד הילד.

- **אימות ביצוע:** feat: demonstrate readonly parent-to-child props with live input; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T26 — State ו־useState
- [x] **תלויות:** T25.
- **לבצע:** מונה שימושי עם `setCount(prev => prev + 1)`, הסבר על שימור מצב בין רינדורים, השוואה למשתנה רגיל.
- **קבצים:** `src/components/demos/CounterDemo.tsx`, `src/components/lessons/StateSection.tsx`.
- **קבלה:** המונה עובד; ההבדל בין משתנה רגיל ל־state מוצג נכון.

- **אימות ביצוע:** feat: teach functional state updates versus nonreactive local variables; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T27 — Snapshot ו־Render/Commit/Paint
- [x] **תלויות:** T26.
- **לבצע:** דמו שמראה ערך `count` הישן ב־handler לעומת הערך לאחר רינדור; תרשים של טריגר → Render → Commit → Paint. לציין שלא כל Render משנה DOM.
- **קבצים:** `src/components/demos/SnapshotDemo.tsx`, `src/components/lessons/RenderSection.tsx`.
- **קבלה:** ההתנהגות תואמת React ואינה טוענת ש־`setCount` מעדכן משתנה מיד בתוך handler.

- **אימות ביצוע:** feat: demonstrate render snapshots queued updates and commit-paint phases; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T28 — useEffect ותלויות
- [x] **תלויות:** T27.
- **לבצע:** דמו שמסנכרן `document.title` עם מונה; להסביר למה Effect מיועד לסנכרון חיצוני ולא לחישוב רגיל בתוך render; להמחיש הבדלים בין `[]`, `[x]` וללא מערך.
- **קבצים:** `src/components/demos/EffectDemo.tsx`, `src/components/lessons/EffectSection.tsx`.
- **קבלה:** הכותרת משתנה בהתאם לערך; לא נוצרה לולאת effect.

- **אימות ביצוע:** feat: demonstrate external title synchronization and effect dependencies; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T29 — Cleanup וטיימר
- [x] **תלויות:** T28.
- **לבצע:** רכיב טיימר עם התחלה/עצירה ושחרור interval ב־cleanup; הצגת מידע על StrictMode בפיתוח.
- **קבצים:** `src/components/demos/CleanupDemo.tsx`, `src/components/lessons/CleanupSection.tsx`.
- **קבלה:** בהסרת הרכיב/עצירת הטיימר אין interval יתום או עדכון בלתי רצוי.

- **אימות ביצוע:** feat: teach cleanup with a mountable stoppable interval and lifecycle tests; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T30 — ארבע תחנות מעבדה
- [x] **תלויות:** T24–T29.
- **לבצע:** לאחד ארבע תחנות התרגול מהמצגת — `Step01Components`, `Step02Props`, `Step03State`, `Step04Effect`. דוגמת קוד לצד תוצאה חיה; בלי `eval` או הרצת קוד שהמשתמש מקליד.
- **קבצים:** `src/components/labs/Step01Components.tsx`, `Step02Props.tsx`, `Step03State.tsx`, `Step04Effect.tsx`, `LabsSection.tsx`.
- **קבלה:** בכל תחנה פעולה שמשנה ממשק/תוצאה; אין תחנות ריקות.

- **אימות ביצוע:** feat: assemble four live component props state and effect lab stations; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T31 — חידון ומשוב
- [x] **תלויות:** T30.
- **לבצע:** ליצור שלוש שאלות הסיכום של המצגת ועוד משחק קצר לזיהוי Props/State/Event/Effect; להציג תשובה נכונה והסבר, לא רק ניקוד.
- **קבצים:** `src/content/quiz.ts`, `src/components/lessons/QuizSection.tsx`.
- **קבלה:** כל תשובה מקבלת משוב; אפשר לנסות שוב; אין שאלות hardcoded ב־JSX.

- **אימות ביצוע:** feat: add explanatory workshop quiz and props-state-event-effect decisions; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T32 — חיבור כל המסע + מקורות
- [x] **תלויות:** T20, T22, T31.
- **לבצע:** להרכיב את כל המקטעים לפי סדר המצגת ולפי ה־`REQUIREMENTS.md`; לקשר עוגנים, Hero, המסלול, עץ הקבצים, השיעורים, המעבדה והחידון. להוסיף קישורים לתיעוד הרשמי מתוך `constants/links.ts`.
- **קבצים:** `src/app/App.tsx`, `src/constants/navigation.ts`, `src/components/layout/Footer.tsx`.
- **קבלה:** מעבר רציף בין כל חלקי האתר, ללא מסך דמה וללא תוכן משוכפל.

---

## שלב ה — בדיקות, נגישות וסיום

- **אימות ביצוע:** feat: connect the full learning world labs quiz and official resources; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T33 — בדיקות מסלול ורכיבים
- [x] **תלויות:** T32.
- **לבצע:** להרחיב Vitest + Testing Library לבחירות, העתקה, אישור ידני, חזרה אחורה, persist, quiz ו־cleanup.
- **קבצים:** `*.test.ts(x)` בסמיכות לרכיבים/ללוגיקה.
- **קבלה:** בדיקות עוברות ומכסות מקרי שגיאה משמעותיים, לא רק רינדור בסיסי.

- **אימות ביצוע:** test: cover unified graph transitions gestures backtracking and learning utilities; `pnpm lint`, `pnpm test`, `pnpm build` עברו.

### T34 — Playwright מקצה לקצה
- [x] **תלויות:** T33.
- **לבצע:** להגדיר Playwright למובייל ולדסקטופ. לבדוק: התחלה → Windows בלי Node → בדיקה → יצירת פרויקט → פקודות → הצלחה; חלופה macOS עם Node; פרויקט קיים; החלפת תשובה; רענון; חידון.
- **קבצים:** `playwright.config.ts`, `e2e/journey.spec.ts`, `package.json`.
- **קבלה:** תרחישים עוברים בדפדפנים שהוגדרו; ללא תלות בהתקנת Node אצל המשתמש באתר עצמו.

### T35 — נגישות ו־RTL
- [x] **תלויות:** T34.
- **לבצע:** לבדוק ניווט Tab/Enter/Space, focus, כותרות, aria-label, aria-expanded, contrast, מצב reduced motion, קוד LTR, ומובייל בגדלים נפוצים.
- **קבצים:** תיקונים נקודתיים בכל רכיב רלוונטי.
- **קבלה:** אין פעולה שחייבת עכבר; הקוד לא מתבלגן בעברית; אין overflow משמעותי.

### T36 — ביצועים וליטוש אנימציות
- [x] **תלויות:** T35.
- **לבצע:** למנוע רינדורים על כל פיקסל גלילה, לבצע lazy loading למפת Flow אם מועיל, לבדוק עומס אנימציות ומכשירים חלשים, להסיר Lenis אם מתנגש עם flow או נגישות.
- **קבצים:** תיקונים נקודתיים ב־`motion/`, `journey/`, `app/`.
- **קבלה:** מסלול גלילה חלק ושמיש ללא layout shifts משמעותיים וללא scroll-jacking.

### T37 — README ובדיקת מסירה
- [x] **תלויות:** T36.
- **לבצע:** לתעד התקנה/הרצה, מבנה קבצים, constants-first, בדיקות, מגבלות (האתר לא מתקין Node ולא מפעיל פקודות), ושיקולי נגישות. להריץ את כל פקודות הבדיקות.
- **קבצים:** `README.md`, `TASKS.md`.
- **קבלה:** `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm exec playwright test` עוברים; כל תיבות המשימות מסומנות רק אם אומתו בפועל.

---

## הוראה להפעלה עם Codex

הדבק בתחילת העבודה:

> קרא את `REQUIREMENTS.md`, `DESIGN.md` ו־`TASKS.md`. בצע **רק את המשימה הראשונה שלא מסומנת** ב־`TASKS.md` שכל התלויות שלה הושלמו. בצע את כל תנאי הקבלה שלה, הרץ בדיקות, עדכן את תיבת הסימון רק אם הכול עבר, ודווח על הקבצים, הבדיקות והמשימה הבאה. **אל תמשיך למשימה הבאה בלי בקשה נוספת.** הקפד על `constants-first`, ממשק עברי RTL, קוד/פקודות LTR ויישום אינטראקטיבי אמיתי.

### לאחר כל משימה

שלח ל־Codex: **״המשך למשימה הבאה ב־`TASKS.md` בלבד.״**

### גבולות גרסה ראשונה

ללא Backend, ללא התחברות משתמשים, ללא מסד נתונים, ללא API מדומה, ללא עורך שמריץ קוד שרירותי. שמירת מצב מקומית בלבד; אם אין שימוש אמיתי ב־API, לא להוסיף React Query.

## עדכון ביצוע אוטונומי

לפי הוראות המשתמש המעודכנות: ממשיכים משימה אחת בכל פעם ללא אישור בין משימות; משתמשים בענפי feature, קומיטים קטנים ומיזוג מקומי ל־main לאחר אימות. המשתמש אישר push אל origin/main לאחר כל שלב מאומת וממוזג; אין force push ואין דריסה של שינויי remote. מצב T01–T24 נשמר. HANDS_ON.md הוא נספח מחייב.

## מסלול Hands-on — HO01–HO18

### HO01 — לקרוא את מבנה הפרויקט ולזהות את צומת Create React בפועל; לתעד קבצים ומצב קיים.
- [x] **תלויות:** T37, T24C.
- **לבצע:** לפי סעיף HO01 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO02 — ליצור טיפוסים וקובצי constants/content לתחנות, זמן, פקודות, שאלות ורמזים.
- [x] **תלויות:** HO01.
- **לבצע:** לפי סעיף HO02 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO03 — ליצור `HandsOnEntryCard` בתוך צומת יצירת הפרויקט, עם יציאה למסלול התקנה רגיל.
- [x] **תלויות:** HO02.
- **לבצע:** לפי סעיף HO03 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO04 — להגדיר את ענף ה-Hands-on בעץ הקיים ואת חיבור הקווים שלו.
- [x] **תלויות:** HO03.
- **לבצע:** לפי סעיף HO04 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO05 — לממש ניווט מצלמה/גלילה לענף שנבחר, כולל reduced motion ומובייל.
- [x] **תלויות:** HO04.
- **לבצע:** לפי סעיף HO05 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO06 — ליצור `ExerciseNode` כללי עם מטרה, הוראות, קוד, אימות וסימון הצלחה.
- [x] **תלויות:** HO05.
- **לבצע:** לפי סעיף HO06 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO07 — ליצור `CodeSnippet` עם העתקה, עטיפת טקסט/גלילה אופקית ומצב LTR.
- [x] **תלויות:** HO06.
- **לבצע:** לפי סעיף HO07 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO08 — ליצור רמזים מדורגים ופתרון מוסתר; לא לחשוף תשובות לפני בחירה.
- [x] **תלויות:** HO07.
- **לבצע:** לפי סעיף HO08 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO09 — להזין תוכן H01–H05, לוודא שהפקודות והקוד שמישים.
- [x] **תלויות:** HO08.
- **לבצע:** לפי סעיף HO09 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO10 — להזין תוכן H06–H08, כולל שלד רציף ועקבי של TaskCard ו-App.
- [x] **תלויות:** HO09.
- **לבצע:** לפי סעיף HO10 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO11 — להזין תוכן H09–H11, כולל טעינה ושמירה תקינות של localStorage והדגמת cleanup.
- [x] **תלויות:** HO10.
- **לבצע:** לפי סעיף HO11 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO12 — ליצור שאלות בדיקת הבנה, feedback ובדיקת עצירה למרצה.
- [x] **תלויות:** HO11.
- **לבצע:** לפי סעיף HO12 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO13 — לממש התקדמות אישית מתמידה, חזרה לתרגיל קודם ואיפוס עם אישור.
- [x] **תלויות:** HO12.
- **לבצע:** לפי סעיף HO13 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO14 — לממש מצב מרצה מקומי ללא טענה על ניטור כיתתי בזמן אמת.
- [x] **תלויות:** HO13.
- **לבצע:** לפי סעיף HO14 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO15 — להוסיף בחירת מסלול 90/120 דקות וחישוב זמני תחנות מתוך constants; לא לסמן בונוסים כהושלמו.
- [x] **תלויות:** HO14.
- **לבצע:** לפי סעיף HO15 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO16 — בדיקות יחידה לרכיבי התרגול ול-state, כולל RTL ונגישות.
- [x] **תלויות:** HO15.
- **לבצע:** לפי סעיף HO16 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO17 — בדיקות E2E: כניסה מצומת Create React → שתי תחנות → חזרה → שימור התקדמות; פתרון מוסתר; קוד מועתק; מובייל.
- [x] **תלויות:** HO16.
- **לבצע:** לפי סעיף HO17 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

### HO18 — להריץ lint, typecheck, test, build, E2E ולתקן תקלות.
- [x] **תלויות:** HO17.
- **לבצע:** לפי סעיף HO18 ב־HANDS_ON.md ובשמירת כל התפקוד הקיים.
- **קבלה:** התפקוד המתואר עובד; בדיקות רלוונטיות, lint, test ו־build עוברים לפני סימון.

## עדכון GX04–GX06 — עץ אלכסוני חופשי (עדיפות לבקשת המשתמש האחרונה)

### GX04 — ענפים אלכסוניים ולחיצה חופשית
- [x] **תלויות:** GX03.
- **לבצע:** אזורי לחיצה גדולים בימין/שמאל, יעדים מוקטנים על מסלולים אלכסוניים, גלילה לאחור והחלפת מסלול ללא modal; לשמר חצים, מחוות ואישור פקודות ידני.
- **קבלה:** כן ימינה ולא שמאלה גם ב־RTL; החלפת בחירה מנקה רק ענף תלוי; אין alert/confirmation.

### GX05 — אווירת חלל ו־trail עם מד מיקום חי
- [x] **תלויות:** GX04.
- **לבצע:** ערפיליות, שכבות parallax, כוכבים ומסלולים; trail קומפקטי ומד עבה בתחתית שמגיבים לגלילה בשני הכיוונים.
- **קבלה:** prefix ו־current מתעדכנים בחזרה ובשינוי כיוון; reduced motion ומובייל נשמרים.

### GX06 — בדיקות ענפים, חזרה ומסירה ל־GitHub
- [x] **תלויות:** GX05.
- **לבצע:** בדיקות mouse/click/wheel/diagonal/keyboard/touch, חזרה ושינוי ענף; lint, unit, build ו־E2E; בדיקה חזותית; commit, merge ו־push ללא force.
- **קבלה:** כל הבדיקות עוברות ו־origin/main תואם ל־main המקומי.

## UN01–UN04 — איחוד מלא לפי ההנחיה המצורפת

עדכון זה מחליף תנאי קבלה היסטוריים של כפתורי התקדמות, אישורים ו־mode נפרד. בדיקה עצמית ורמזים נשארים; גלילה לבדה חייבת להגיע לכל צומת. GX04–GX06 נבדקים מחדש כחלק ממסירה זו.

### UN01 — מנוע גרף ומצלמה אחת
- [x] **תלויות:** IM05.
- **לבצע:** גרף קנוני להתקנה, קוד, קבצים, מעבדות, משוב ותקלות; route/cursor/visited; צמתים אמיתיים במרחב; single-edge בגלילה, fan לענפים, חזרה ללא modal.
- **קבלה:** אין יעד חסר או צומת לא נגיש; mouse wheel/trackpad/keyboard/touch ו־reduced motion.

### UN02 — סדנה מלאה בתוך הגרף
- [x] **תלויות:** UN01.
- **לבצע:** 11 תחנות + שתי עצירות, כניסה מ־create, קוד מלא תקין, רמזים, בדיקה, persistence נפרד, מרצה ותוכניות זמן.
- **קבלה:** כל התוכן נגיש בגלילה ללא כפתורי התקדמות; אין סימון אוטומטי של הצלחה חיצונית.

### UN03 — תרחישי גלילה ונגישות
- [x] **תלויות:** UN02.
- **לבצע:** תרחישי דפדפן מלאים, wheel אנכי/אלכסוני, שינוי ענף, חזרה, persistence, יחידה/רכיבים, RTL, overflow ו־axe.
- **קבלה:** lint, tests, build ו־E2E עוברים; הוראות קוד שמישות.

### UN04 — מסירה, תיעוד וסנכרון
- [x] **תלויות:** UN03.
- **לבצע:** README עדכני, בדיקה חזותית בדפדפן, קומיטים לוגיים, מיזוג main ו־push מאומת.
- **קבלה:** main נקי ו־origin/main תואם; דיווח תוצאות ומגבלות מדויק.

### SN01 — עצירה מדויקת אחת לכל מחווה
- [x] **תלויות:** UN01.
- **לבצע:** cursor מונחה, נעילת טיסה/מומנטום, GSAP targets, משטח קריאה לתוכן ארוך, arrival stagger ופולס נתיב.
- **קבלה:** אין דילוגים ברצף wheel מהיר; חזרה, RTL, מובייל ו־reduced motion; קווים רציפים ומיושרים לאורך מעבר/resize.

- **אימות UN01/SN01/GX04/GX05:** מנוע גרף מאוחד, עצירות GSAP, ענפים אלכסוניים, אווירת חלל ו־trail; `pnpm lint`, `pnpm test` (46), `pnpm build` ו־Playwright (33 תרחישים בדסקטופ/מובייל/reduced-motion) עברו.

- **אימות HO01, HO02:** lint, unit tests (53), production build, 16 בדיקות קוד סדנה ו־45 תרחישי browser עברו; לאחר תיקון פריסה נוספו 8 אימותי mobile שעברו.

**סדר הביצוע המעודכן:** בקשת האיחוד האחרונה הקדימה את מימוש HO01–HO17 דרך UN02 לפני בדיקת המסירה T37. תנאי מסירה, נגישות ואימות מלא ממשיכים ב־UN03/UN04; שינוי זה אינו מוחק משימות או התקדמות.

- **אימות HO03, HO04, HO05, HO06, HO07, HO08, HO09, HO10, HO11, HO12, HO13, HO14, HO15, UN02:** lint, unit tests (53), production build, 16 בדיקות קוד סדנה ו־45 תרחישי browser עברו; לאחר תיקון פריסה נוספו 8 אימותי mobile שעברו.

- **אימות HO16, HO17:** lint, unit tests (53), production build, 16 בדיקות קוד סדנה ו־45 תרחישי browser עברו; לאחר תיקון פריסה נוספו 8 אימותי mobile שעברו.

- **אימות מסירה T34–T37 / HO18 / UN03:** `pnpm format:check`, `pnpm lint`, `pnpm test` (57 בדיקות), `pnpm build`, `pnpm test:workshop` (16 בדיקות strict TypeScript/build) ו־Playwright (60 תרחישי Chromium בדסקטופ, מובייל ו־reduced motion) עברו. axe, focus, SVG endpoints ו־resize, גלילה/מחוות/לחיצה, חזרה ושינוי ענף, קריאת קוד מלא ו־persistence נבדקו. תמונות desktop/mobile נבדקו חזותית.

- **אימות GX06 / UN04:** כל 57 בדיקות היחידה, 60 תרחישי הדפדפן ו־16 בדיקות קוד הסדנה עברו; lint/format/build תקינים. ענפי unified-scroll-tree, hands-on-workshop ו־quality-and-accessibility מוזגו ל־main ונדחפו ללא force. GitHub API אישר את commit `27edf61c5455093f530282004d2c59ea359a1a96` ואת README המעודכן; local/origin SHA אומת לאחר כל push. ללא משימות או תקלות ידועות שנותרו פתוחות.

## NAV01–NAV03 — תיקון רגרסיית ניווט בלבד (2026-11-23)

אין שינוי עיצוב או תוכן. האימות הקודם השתמש בעיקר ב־wheel deltas גדולים ולא הוכיח שימוש ב־trackpad פיזי. הרגרסיה הנוכחית משוחזרת לפני תיקון ב־Vitest וב־Chromium/WebKit: deltas אופקיים של 1.5px נזרקים; צירי x/y חולקים accumulator; נעילת קריאה בולעת שינוי ציר מכוון. שני ענפי right מצביעים לאותו x של המקור. רגרסיה נוספת עם frames במרווח 650ms משחזרת נעילת מצלמה ארוכה בגלל GSAP lag compensation. חזרות מדודות של תוכן ארוך מצאו גם גלילה native של world-viewport (x=-200, y=578) בזמן focus, למרות camera target תקין.

### NAV01 — אבחון ושחזור לפני שינוי

- [x] **לבצע:** לבדוק handlers/import graph, לשחזר כשל ימינה ושינוי ציר ב־Vitest ובדפדפנים, לשמור evidence לפני תיקון.
- **אימות:** ארבע בדיקות Vitest ושני מקרי דפדפן בכל אחד מ־Chromium/WebKit נכשלים ביישום המקורי כצפוי. App מרכיב controller גלילה אחד ו־GSAP camera אחד; הקוד ההיסטורי של ScrollTrigger/Motion scroll אינו מורכב; Lenis אינו מותקן.

### NAV02 — תיקון controller ומחזור חיי מצלמה

- [x] **לבצע:** צבירת fractional deltas לפי ציר, נעילת axis/gesture מפורשת, הפרדת קריאה מניווט, שחרור לאחר שקט/היפוך מכוון, שמירת מצב יחיד, snap לפי זמן בפועל עם deadline מוגן מפני callbacks ישנים, וחסימת גלילת focus של העולם באמצעות overflow: clip.
- **קבלה:** כיוונים יציבים ב־RTL; אין דילוגים ממומנטום; אין נעילה קבועה; ללא שינוי עיצוב.

### NAV03 — אימות ומסירה

- [x] **לבצע:** כל 12 מקרי הרגרסיה, דפדפני Chromium/WebKit, צילומי before/after לארבעת הכיוונים, lint/typecheck/unit/build וכל הבדיקות הקיימות.
- **קבלה:** הכול עובר לפני commit/push; יש לציין שבדיקות synthetic/native browser wheel אינן אימות של trackpad Mac פיזי, ולצרף checklist ידני קצר.


- **אימות NAV02/NAV03:** `pnpm format:check`, `pnpm lint`, `pnpm exec tsc -b`, בדיקת TypeScript strict לקובצי Playwright, `pnpm test` (82 בדיקות), `pnpm build`, `pnpm test:workshop` (16) ו־Playwright (128 תרחישים: Chromium desktop/mobile/reduced-motion + WebKit navigation) עברו. צילומי before/after לארבעת הכיוונים נבדקו בדסקטופ ובמובייל; ה־camera נוחת בקואורדינטות מדויקות, ה־SVG נשאר מחובר וה־world אינו נגלל ב־focus. תיקון ניווט בלבד, ללא שינוי עיצוב/תוכן. אימות trackpad Mac פיזי לא בוצע; checklist וממצאי השורש ב־[docs/navigation-debug.md](docs/navigation-debug.md).


## QA-01–QA-03 / OBS-01 — ממצאי הדוח המצורף (2026-11-23)

### QA-01 — אלכסונים שווים וקרובים בצומתי בחירה

- [x] לעדכן מדיניות מחוות בקבועים ובמנוע היחיד; רכיבים 650/650 ו־±300/350 בוחרים לפי x, בלי תלות במיקום הסמן. לשמור חזרה, קריאה, כוונה אנכית ונעילת מומנטום. לאמת Vitest ובדפדפנים.

### QA-02 — ביטול חפיפת כפתורי ענפים והוראות

- [x] לחשב גבול hit areas לפי מלבן הקריאה בפועל, לעדכן בהגעה/resize/תוכן, ולתת קדימות לקריאה על ההוראות. לאמת verify, H05 ו־pause-2, בשני צדדים ובכמה גדלים.

### QA-03 — צבירת קלט קצר ומשוב כוונה

- [ ] לבדוק דגימות מנורמלות ותזמון, לספק משוב לפני סף הבחירה, ולשמור מעבר אחד ו־reduced motion. ערכי automation אינם מדידה של WheelEvents פיזיים; כוונון hardware דורש אישור נפרד.

### OBS-01 — מקור אזהרת THREE.Clock

- [ ] לאתר את הקריאה בקוד או בתלות; להסיר שימוש מיושן בצורה תואמת ללא השתקת אזהרות; לבדוק אתחול טרי ותזמון אנימציה.

### HW-01 — קבלה פיזית של אינרציית Mac

- [ ] בדיקה ידנית במשטח מגע פיזי: אלכסונים, קלט קצר, מומנטום והיפוך. נדרשת לפני סגירת קבלת חומרה של הדוח; אינה ניתנת לביצוע באמצעות synthetic/browser injection.

- **אימות QA-01/QA-02:** lint, 89 בדיקות Vitest ו־production build עברו; 14 תרחישי Chromium/WebKit עברו, כולל גודל הדוח, ±650/650, ±300/350, שתי נקודות הקוד המדויקות ו־verify/H05/pause-2 בשלושה גדלים. בדיקת קבלה פיזית עדיין פתוחה ב־HW-01.
