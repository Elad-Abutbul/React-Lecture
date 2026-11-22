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
- [ ] **תלויות:** T21.
- **לבצע:** מקטע קצר עם שתי כרטיסיות תפקידים ופקודות יצירת הפרויקט מתוך `COMMANDS`.
- **קבצים:** `src/components/lessons/ReactViteSection.tsx`, עדכון `src/content/lessons.ts`.
- **קבלה:** יש הבחנה נכונה בין ספריית UI לכלי פיתוח; אין פקודות סותרות.

### T23 — עץ קבצים לחיץ
- [ ] **תלויות:** T14.
- **לבצע:** ליצור עץ פרויקט עם `index.html`, `src/main.tsx`, `src/App.tsx`, `src/components`, `package.json`, קובצי CSS/הגדרות. לחיצה מציגה קוד והסבר; להמחיש `index.html → main.tsx → App.tsx → UI`.
- **קבצים:** `src/content/files.ts`, `src/components/lessons/FileTreeSection.tsx`, `src/components/lessons/FileDetails.tsx`.
- **קבלה:** כל קובץ מרכזי נפתח; מסלול טעינה ברור; אין להניח שכל פרויקט מכיל בדיוק אותו מבנה.

### T24 — Components ו־JSX/TSX
- [ ] **תלויות:** T23.
- **לבצע:** דמו של `Welcome` בשימוש חוזר; להסביר פונקציה שמחזירה JSX; להראות `return`, `{}`, `className`, תגית עוטפת ו־`.tsx` מול `.ts`.
- **קבצים:** `src/components/lessons/ComponentsSection.tsx`, `JsxSection.tsx`, עדכון תוכן הפרקים.
- **קבלה:** רכיבים אמיתיים מוצגים וניתן לראות הבדל כשמשנים נתונים בדמו.

### T25 — Props (הורה → ילד)
- [ ] **תלויות:** T24.
- **לבצע:** רכיב הורה בוחר שם והילד מציג אותו; להציג שני מופעים עם אותו רכיב; להדגיש props לקריאה בלבד.
- **קבצים:** `src/components/demos/PropsDemo.tsx`, `src/components/lessons/PropsSection.tsx`.
- **קבלה:** שינוי השם בהורה משנה את הטקסט בילד בלי שינוי קוד הילד.

### T26 — State ו־useState
- [ ] **תלויות:** T25.
- **לבצע:** מונה שימושי עם `setCount(prev => prev + 1)`, הסבר על שימור מצב בין רינדורים, השוואה למשתנה רגיל.
- **קבצים:** `src/components/demos/CounterDemo.tsx`, `src/components/lessons/StateSection.tsx`.
- **קבלה:** המונה עובד; ההבדל בין משתנה רגיל ל־state מוצג נכון.

### T27 — Snapshot ו־Render/Commit/Paint
- [ ] **תלויות:** T26.
- **לבצע:** דמו שמראה ערך `count` הישן ב־handler לעומת הערך לאחר רינדור; תרשים של טריגר → Render → Commit → Paint. לציין שלא כל Render משנה DOM.
- **קבצים:** `src/components/demos/SnapshotDemo.tsx`, `src/components/lessons/RenderSection.tsx`.
- **קבלה:** ההתנהגות תואמת React ואינה טוענת ש־`setCount` מעדכן משתנה מיד בתוך handler.

### T28 — useEffect ותלויות
- [ ] **תלויות:** T27.
- **לבצע:** דמו שמסנכרן `document.title` עם מונה; להסביר למה Effect מיועד לסנכרון חיצוני ולא לחישוב רגיל בתוך render; להמחיש הבדלים בין `[]`, `[x]` וללא מערך.
- **קבצים:** `src/components/demos/EffectDemo.tsx`, `src/components/lessons/EffectSection.tsx`.
- **קבלה:** הכותרת משתנה בהתאם לערך; לא נוצרה לולאת effect.

### T29 — Cleanup וטיימר
- [ ] **תלויות:** T28.
- **לבצע:** רכיב טיימר עם התחלה/עצירה ושחרור interval ב־cleanup; הצגת מידע על StrictMode בפיתוח.
- **קבצים:** `src/components/demos/CleanupDemo.tsx`, `src/components/lessons/CleanupSection.tsx`.
- **קבלה:** בהסרת הרכיב/עצירת הטיימר אין interval יתום או עדכון בלתי רצוי.

### T30 — ארבע תחנות מעבדה
- [ ] **תלויות:** T24–T29.
- **לבצע:** לאחד ארבע תחנות התרגול מהמצגת — `Step01Components`, `Step02Props`, `Step03State`, `Step04Effect`. דוגמת קוד לצד תוצאה חיה; בלי `eval` או הרצת קוד שהמשתמש מקליד.
- **קבצים:** `src/components/labs/Step01Components.tsx`, `Step02Props.tsx`, `Step03State.tsx`, `Step04Effect.tsx`, `LabsSection.tsx`.
- **קבלה:** בכל תחנה פעולה שמשנה ממשק/תוצאה; אין תחנות ריקות.

### T31 — חידון ומשוב
- [ ] **תלויות:** T30.
- **לבצע:** ליצור שלוש שאלות הסיכום של המצגת ועוד משחק קצר לזיהוי Props/State/Event/Effect; להציג תשובה נכונה והסבר, לא רק ניקוד.
- **קבצים:** `src/content/quiz.ts`, `src/components/lessons/QuizSection.tsx`.
- **קבלה:** כל תשובה מקבלת משוב; אפשר לנסות שוב; אין שאלות hardcoded ב־JSX.

### T32 — חיבור כל המסע + מקורות
- [ ] **תלויות:** T20, T22, T31.
- **לבצע:** להרכיב את כל המקטעים לפי סדר המצגת ולפי ה־`REQUIREMENTS.md`; לקשר עוגנים, Hero, המסלול, עץ הקבצים, השיעורים, המעבדה והחידון. להוסיף קישורים לתיעוד הרשמי מתוך `constants/links.ts`.
- **קבצים:** `src/app/App.tsx`, `src/constants/navigation.ts`, `src/components/layout/Footer.tsx`.
- **קבלה:** מעבר רציף בין כל חלקי האתר, ללא מסך דמה וללא תוכן משוכפל.

---

## שלב ה — בדיקות, נגישות וסיום

### T33 — בדיקות מסלול ורכיבים
- [ ] **תלויות:** T32.
- **לבצע:** להרחיב Vitest + Testing Library לבחירות, העתקה, אישור ידני, חזרה אחורה, persist, quiz ו־cleanup.
- **קבצים:** `*.test.ts(x)` בסמיכות לרכיבים/ללוגיקה.
- **קבלה:** בדיקות עוברות ומכסות מקרי שגיאה משמעותיים, לא רק רינדור בסיסי.

### T34 — Playwright מקצה לקצה
- [ ] **תלויות:** T33.
- **לבצע:** להגדיר Playwright למובייל ולדסקטופ. לבדוק: התחלה → Windows בלי Node → בדיקה → יצירת פרויקט → פקודות → הצלחה; חלופה macOS עם Node; פרויקט קיים; החלפת תשובה; רענון; חידון.
- **קבצים:** `playwright.config.ts`, `e2e/journey.spec.ts`, `package.json`.
- **קבלה:** תרחישים עוברים בדפדפנים שהוגדרו; ללא תלות בהתקנת Node אצל המשתמש באתר עצמו.

### T35 — נגישות ו־RTL
- [ ] **תלויות:** T34.
- **לבצע:** לבדוק ניווט Tab/Enter/Space, focus, כותרות, aria-label, aria-expanded, contrast, מצב reduced motion, קוד LTR, ומובייל בגדלים נפוצים.
- **קבצים:** תיקונים נקודתיים בכל רכיב רלוונטי.
- **קבלה:** אין פעולה שחייבת עכבר; הקוד לא מתבלגן בעברית; אין overflow משמעותי.

### T36 — ביצועים וליטוש אנימציות
- [ ] **תלויות:** T35.
- **לבצע:** למנוע רינדורים על כל פיקסל גלילה, לבצע lazy loading למפת Flow אם מועיל, לבדוק עומס אנימציות ומכשירים חלשים, להסיר Lenis אם מתנגש עם flow או נגישות.
- **קבצים:** תיקונים נקודתיים ב־`motion/`, `journey/`, `app/`.
- **קבלה:** מסלול גלילה חלק ושמיש ללא layout shifts משמעותיים וללא scroll-jacking.

### T37 — README ובדיקת מסירה
- [ ] **תלויות:** T36.
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
