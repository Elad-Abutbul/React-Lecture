# LECTURE_AND_WORKSHOP.md — React Journey | הרצאה + מעבדת בנייה

> **התאמה למימוש הנוכחי — 24 בנובמבר 2026:** בקשת המשתמש העדכנית גוברת על סעיפי הפתיחה וההרחבות במקור שלהלן: פתיחה עם הרצאה משמאל וסדנה מעשית מימין, התקנה בתוך ההרצאה, ושלושה מוני משימות בלבד. עריכה וחיפוש הם חובה; קטגוריות ושמירה הן בונוס. מצב כהה, פרופילים ומונה זמן אינם תכונות של אפליקציית התלמיד. המסמך המקורי נשמר כאן לעיון; התוכן וקובצי הפתרון המותאמים נמצאים ב־`src/content/lecture.ts`, `src/content/workshop.ts` ו־`src/content/courseBuilds.ts`.

> **סטטוס:** אפיון תוכן, חוויית משתמש ומימוש למסלול הלימודי החדש. זהו מסמך הוראות לפיתוח האתר הקיים, לא הוראה למחוק את מנוע הגלילה או את ההתקדמות שכבר נבנתה.
>
> **קהל יעד:** מתחילים ממש מאפס, ללא ניסיון קודם ב־React. נדרשת היכרות בסיסית מאוד עם משתנים ופונקציות ב־JavaScript; את השאר מסבירים בדרך.
>
> **שפה:** עברית, RTL; קוד, נתיבי קבצים ופקודות מוצגים ב־LTR.
>
> **אופי הלמידה:** המדריך מסביר בקצרה → מראה קוד → מבצע בדפדפן → שואל שאלה → המשתתפים מתרגלים.

---

## 0. ההחלטה המרכזית: האתר צריך להיות שיעור אחד ברור

### המסך הראשון

יש **שני נתיבים חזותיים נפרדים**, אך לא שני שיעורים מקבילים:

- **במרכז, כלפי מטה — ״מתחילים ללמוד React״:** זה המסלול הראשי של ההרצאה. הוא **אנכי בלבד**, ללא הסתעפויות ימינה/שמאלה במהלך תוכן ההרצאה. כל נושא הוא תחנת תוכן על אותו קו רציף.
- **מצד ימין — ״צריכים להתקין React?״:** שביל התקנה נפרד שיוצא ימינה מן הפתיחה. הוא מכיל מדריך מלא ל־Node.js, יצירת פרויקט, הרצה, VS Code ו־Tailwind. בסיום הוא **מתחבר חזרה** למסלול הראשי בתחנה ״פותחים את הפרויקט״. אין צורך ללמוד את כל ההתקנה שוב אם כבר יש סביבת עבודה.

**בסיום ההרצאה** יש צומת מעבר ברור אחד: ״עכשיו אתם בונים לבד — מעבדה מעשית״. גלילה למטה ממשיכה למעבדה של 90–120 דקות. **המעבדה אינה עץ כן/לא:** היא רצף תחנות בנייה, עם רמזים אופציונליים והרחבות למתקדמים. כפתורי העתקה, רמזים, טופס תרגול ונגישות מותרים, אבל הם אינם כפתורי ניווט בהרצאה.

### מפה רעיונית

```text
                  פתיחה: בונים ממשק עם React
                           │
          ┌────────────────┴───────────────┐
          │                                └──────► מסלול התקנה (ימין)
          ▼                                         Node → Vite → npm install
     הרצאה אנכית                                    npm run dev → Tailwind
          │                                                │
     למה React? ◄────────────────────────────────────────────┘
          │                      הצטרפות למסלול בשלב פתיחת הפרויקט
     קבצים → TSX → רכיבים → Props
          │
     State → useState → Snapshot
          │
     Render / Commit / Paint
          │
     useEffect → Cleanup → Tailwind מסכם
          │
     חידון וסיכום הרצאה
          │
          ▼
     מעבר קולנועי למעבדה
          │
     רואים צילום של אפליקציית היעד
          │
     Navbar → Hero → Task data → Task list
          │
     Form → State → Props → Filter → Progress
          │
     useEffect / localStorage → Cleanup → ליטוש
          │
     הגשה עצמית + שאלות סיכום
```

### כללים קשיחים לתצוגה

1. ההרצאה מתקדמת **אך ורק למטה ולמעלה**; אין הסתעפות אופקית לשיעורים אחרים.
2. מסלול ההתקנה ממוקם באמת במרחב **מימין**, עם קו שמוביל אליו ומחזיר למסלול הראשי.
3. בכל תחנה מוצגים: כותרת, _למה בכלל צריך את זה_, הסבר פשוט, הדגמת קוד, מה צפוי לראות, שאלה קצרה לבדיקה ומקור/הערת מרצה לפי הצורך.
4. המצלמה נעה ברציפות ביחס לקלט. ליד טקסט יש **עצירה מגנטית רכה** (`soft snap`), בלי נעילה קשיחה או קפיצה לתחנה הבאה.
5. קו העץ/המסלול **ממשיך תמיד לעבר התחנה הבאה** ונראה גם כשעוצרים לקרוא.
6. טקסט מופיע בהדרגה לפי קרבה למצלמה; האפקט לא חוסם גלילה, לא מפעיל ניווט ולא יוצר גלילת פנים בתוך גלילה לא הכרחית.
7. בר עליון קטן: ״הרצאה | מעבדה״, נושא נוכחי, התקדמות; פס תחתון עבה יחסית מציין את המיקום **במסלול הנוכחי**. מעבר למעבדה מאפס רק את מד ההתקדמות של המעבדה, לא את נתוני ההתקדמות הכוללים.
8. בדסקטופ הצומת ממוקד, הקריאה גדולה ובולטת; ברוחבים צרים המסלול נשאר אנכי והתקנה נגישה מכניסה מובחנת.
9. למשתמש שאין לו מחוות אופקיות יש קישור/אזור כניסה ברור למסלול ההתקנה; **לא** חייבים מחוות עכבר כדי להיכנס אליו.
10. אין להציג נתוני כיתה אמיתיים או לטעון ״בדקנו שהקוד עובד״ בלי חיבור מפורש לכלי הרצה/בדיקה. סימון השלמה הוא דיווח עצמי, אלא אם קיים בודק אמיתי.

---

## 1. זהות חזותית של האתר המארח

**React Journey:** עולם כהה, כחול־חללי, ציאן React, סגול עדין, מסלולים מוארים, חלקיקים ומסלול רציף ברקע. האפליקציה שהתלמידים יבנו היא **ממשק בהיר ומקצועי** כדי ללמד אותם ניגודיות, כרטיסים ו־Tailwind. אין לבלבל בין עיצוב אתר הלימוד לעיצוב פרויקט התלמיד.

- תחילת ההרצאה: כותרת ״מה זה React ואיך בונים ממשק?״; שתי דרכים ברורות כפי שהוגדר.
- בהגעה לתחנת לימוד: הכותרת מתבהרת, הכרטיס עולה כ־8–12px ומתייצב, הקו מהבהב קלות. אין שינוי חד בזום.
- דוגמאות קוד בסגנון עורך קוד עם שם קובץ, סימון שורות והעתקה; הסברים ב־RTL וקוד ב־LTR.
- מעבר למעבדה: קו המסלול משנה מעט צבע (ציאן → ירקרק), רקע מתחלף בהדרגה, צילום אפליקציית היעד נחשף בהגדלה מתונה ונשאר זמין בכל המעבדה.
- תחנת תרגול: צד אחד צילום/תוצאה רצויה, צד שני הוראות, קוד ורמזים. במובייל אלה מוצגים אחד מתחת לשני.

---

## 2. הזמנים — הרצאה + מעבדה

### הרצאה: כ־85 דקות (אפשר לקצר ל־70)

| זמן   | תחנה                             | מה המשתתף צריך להבין                                    |
| ----- | -------------------------------- | ------------------------------------------------------- |
| 0–5   | L00 פתיחה והבטחה                 | מה יוצרים ולמה React                                    |
| 5–12  | L01 התקנה והפעלה                 | סביבת עבודה, Node/npm/Vite                              |
| 12–20 | L02 עץ הקבצים                    | למה כל קובץ קיים, מה קורה בריצה                         |
| 20–29 | L03 JavaScript + HTML ב־TSX      | תחביר JSX, ביטויים, `className`                         |
| 29–37 | L04 קומפוננטות                   | פונקציה שמחזירה ממשק ושימוש חוזר                        |
| 37–45 | L05 Props                        | הורה מעביר מידע לילד; טיפוסים                           |
| 45–52 | L06 Tailwind בסיסי               | עיצוב מהיר ב־`className`, `flex`, `gap`, `p`, `rounded` |
| 52–59 | L07 State                        | זיכרון של רכיב; למה משתנה רגיל לא מספיק                 |
| 59–67 | L08 useState + Events + Snapshot | שינוי מצב, עדכון פונקציונלי, ערך ישן באותו handler      |
| 67–73 | L09 Render / Commit / Paint      | מה מתעדכן ומתי; רינדור לא בהכרח משנה DOM                |
| 73–81 | L10 useEffect + Cleanup          | סנכרון חיצוני, תלויות, ניקוי טיימר                      |
| 81–85 | L11 סיכום ובדיקת הבנה            | מתי Props, State, Event או Effect                       |

**הערת תכנון:** הזמנים כוללים הדגמת קוד קצרה; לא רק הקראת מצגת. מסלול ההתקנה יכול להיות נגיש לפני תחילת ההרצאה או להפוך לתחנת פתיחה. משתתפים מוכנים אינם חייבים לצפות בהדרכה המלאה.

### מעבדה: 115 דקות (ניתנת לקיצור ל־90)

| דקות    | תחנה                    | תוצר                                    |
| ------- | ----------------------- | --------------------------------------- |
| 0–8     | W00 הבנת היעד           | זיהוי רכיבי הממשק מתוך התמונה           |
| 8–20    | W01 Navbar              | כותרת, טאבים, אייקון React              |
| 20–30   | W02 Hero + Layout       | כותרת ראשית ועימוד רספונסיבי            |
| 30–40   | W03 Data + Types        | מודל Task ונתוני פתיחה                  |
| 40–53   | W04 TaskCard + Props    | כרטיס משימה לשימוש חוזר                 |
| 53–67   | W05 TaskList            | רינדור רשימה עם `map` ו־`key`           |
| 67–82   | W06 Form + useState     | יצירת משימה חדשה מקלט משתמש             |
| 82–95   | W07 Update + Delete     | סימון השלמה ומחיקה ללא שינוי מערך במקום |
| 95–104  | W08 Filter + Stats      | פילטרים וסטטיסטיקה מחושבת               |
| 104–111 | W09 useEffect + Storage | שמירת משימות בדפדפן                     |
| 111–115 | W10 Review + Stretch    | בדיקה מסכמת והרחבה אופציונלית           |

**מבחן הצלחה:** יוצרים משימה, רואים אותה ברשימה, משלימים אותה, מסננים, מוחקים, מרעננים את הדף והמשימות נשמרות. משתתפים מהירים מקבלים הרחבת טיימר עם ניקוי `useEffect` או מצב כהה.

---

## 3. מסלול התקנה — מן האפס, מדויק וניתן להעתקה

> זהו **שביל נפרד לימין**; כולל הסברים גם למי שמעולם לא פתח טרמינל. הוא לא מחייב את מי שכבר התקין את הכלים.

### I01 — מה צריך בכלל?

- **VS Code** — עורך הקוד, המקום שבו כותבים קבצים.
- **Terminal** — חלון להרצת פקודות, לא שפת תכנות.
- **Node.js** — סביבת הרצה של JavaScript מחוץ לדפדפן, נדרשת לכלי הפיתוח.
- **npm** — מנהל החבילות שמגיע בדרך כלל עם Node.js.
- **Vite** — כלי שמייצר ומריץ פרויקט פיתוח; **React** היא הספרייה שבונה את הממשק.
- הצג תמונת מסך/אנימציה קלה של VS Code: עץ קבצים משמאל, עורך במרכז, טרמינל בתחתית. הסבר היכן פותחים טרמינל: Terminal → New Terminal.

### I02 — בדיקת התקנה

```bash
node -v
npm -v
```

הסבר: הדגל `-v` מבקש מספר גרסה. אם מופיעה גרסה, הכלי מזוהה; אם מתקבלת שגיאת command not found / not recognized, יש להתקין Node.js LTS מאתר [nodejs.org](https://nodejs.org/). **אין להמציא גרסת מינימום קבועה:** הצג את דרישת Node המעודכנת לפי גרסת Vite שמותקנת או לפי התיעוד הרשמי. לאחר ההתקנה יש לסגור ולפתוח מחדש את הטרמינל ולבדוק שוב.

### I03 — פותחים תיקייה ויוצרים פרויקט React + TypeScript

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

**להסביר פקודה־פקודה, לא להציג ארבע פקודות בלי הסבר:**

- `npm create vite@latest ...` — יוצר שלד פרויקט מתוך תבנית React ו־TypeScript.
- `my-react-app` — שם התיקייה החדשה; אפשר לבחור שם אחר.
- `-- --template react-ts` — מעביר ל־Vite בקשה להשתמש בתבנית React + TypeScript.
- `cd my-react-app` — נכנסים לתיקיית הפרויקט.
- `npm install` — קוראים את רשימת התלויות מ־`package.json` ומתקינים אותן ל־`node_modules`.
- `npm run dev` — מפעילים שרת פיתוח. פותחים בדפדפן **את הכתובת שהטרמינל מציג**, בדרך כלל `http://localhost:5173`.
- להפסיק את השרת: `Ctrl+C` בטרמינל שבו הוא פועל.

**לא ללמד `npm i create`:** זו אינה הפקודה ליצירת פרויקט. `npm i` הוא קיצור של `npm install`.

**תחנת עצירה:** ״אתם רואים את עמוד Vite + React?״ — המשתתף מסמן לעצמו בלבד. במסלול של בעיה: תיקיית עבודה שגויה, Node חסר/ישן, פורט תפוס, שגיאת הקלדה, קונסול שגיאות. הפתרונות מופיעים כהסבר, לא מבטיחים לתקן מחשב מרחוק.

### I04 — מוסיפים Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

בקובץ `vite.config.ts` מוסיפים את הפלאגין לצד פלאגין React:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

בקובץ `src/index.css`:

```css
@import 'tailwindcss';
```

חשוב לוודא ש־`main.tsx` מייבא את `./index.css`. לבצע ריסטארט לשרת אם שינוי הגדרות Vite אינו נטען. אין ללמד `npx tailwindcss init -p` כשלב חובה ב־Tailwind v4: זה מתכון ישן שמתאים בעיקר לגרסאות קודמות.

**בדיקת עשייה:** להחליף זמנית ב־`App.tsx`:

```tsx
export default function App() {
  return <h1 className="text-4xl font-bold text-cyan-500">React עובד!</h1>
}
```

אם הכותרת גדולה וציאנית, גם React וגם Tailwind עובדים. לאחר מכן ממשיכים עם אותו פרויקט להרצאה ולמעבדה.

### I05 — מסיימים ומתחברים למסלול ההרצאה

קו חזותי מעוקל מחבר את ההתקנה לתחנת **L02: ״מה יש בקבצים של הפרויקט?״**. אין מעבר מסך חד, אין איפוס התקדמות, ואין הצגה מחדש של ההתקנה בהכרח.

---

## 4. תוכן ההרצאה — מה בדיוק מופיע ומדגימים בכל תחנה

**תבנית אחידה לתחנה:** מטרה → הסבר לילד → אנלוגיה → דוגמת קוד → מה רואים → שאלה קצרה → תשובה מוסתרת → הערת מרצה. אתר המארח מציג את הטקסט בקצב נוח, לא את כל הסעיף בבת אחת.

### L00 — למה בכלל React?

**מטרה:** להבין מה React פותר בלי להציג אותו כקסם.

**הסבר:** אתר מורכב מחלקים: תפריט, כרטיסים, רשימות וכפתורים. עם JavaScript רגיל אפשר לעדכן מסך, אבל ככל שיש יותר חלקים צריך לתאם הרבה שינויים ידניים. React מאפשר לתאר איך המסך אמור להיראות לפי הנתונים; כשנתונים משתנים React מחשב מחדש את הממשק.

**אנלוגיה:** כמו להרכיב בית מלגו — כל חלון/דלת הוא רכיב שאפשר להשתמש בו שוב.

**הדגמת מרצה:** מונה פשוט באמצעות `document.querySelector` מול מונה שמחזיר JSX. להדגיש ש־React היא **ספריית JavaScript לממשקי משתמש**, לא שפת תכנות, לא שרת ולא תחליף ל־CSS.

**שאלה:** ״אם יש לי אתר קטן מאוד, חייבים React?״ תשובה: לא.

### L01 — מה קורה כשמריצים את הפרויקט?

**מטרה:** להבין את הקשר בין טרמינל, npm, Vite, React והדפדפן.

**הסבר:** `npm run dev` מריץ סקריפט מתוך `package.json`; Vite מפעיל שרת פיתוח; הדפדפן טוען את דף הבסיס; React מציג תוכן בתוך אלמנט `root`.

**דוגמה על המסך:** `package.json` → `scripts.dev` → `vite` → כתובת מקומית.

**שאלה:** ״אם אפסיק את `npm run dev`, האתר ימשיך להתעדכן במחשב שלי?״ תשובה: לא דרך שרת הפיתוח הזה.

### L02 — תפקיד כל קובץ, מההתחלה ועד המסך

להציג **עץ קבצים לחיץ** עם הסבר קצר לכל שורה:

```text
my-react-app/
├── index.html           # דף הבסיס ובתוכו <div id="root">
├── package.json         # תלויות ופקודות הרצה
├── package-lock.json    # נעילת גרסאות מותקנות
├── vite.config.ts       # הגדרות כלי הבנייה
├── tsconfig*.json       # הגדרות TypeScript
├── public/              # קבצים סטטיים
└── src/
    ├── main.tsx         # נקודת הכניסה שמרנדרת את App
    ├── App.tsx          # הקומפוננטה הראשית
    ├── index.css        # CSS גלובלי וייבוא Tailwind
    ├── App.css          # CSS מקומי אופציונלי אם קיים
    ├── components/      # קומפוננטות לשימוש חוזר שניצור
    ├── constants/       # טקסטים, הגדרות ודוגמאות
    └── types/           # טיפוסים משותפים
```

**שימו לב:** חלק מהקבצים ותיקיות `components`, `constants`, `types` אינם נוצרים אוטומטית בתבנית Vite; ניצור אותם בעצמנו. המבנה המדויק של התבנית עשוי להשתנות.

**זרימת הטעינה:** `index.html` → `src/main.tsx` → `App.tsx` → רכיבים פנימיים. להציג חצים חמים בין הקבצים כשגוללים.

**קוד להדגמה:**

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

```tsx
// src/main.tsx (עיקרון, לא בהכרח כל קוד התבנית)
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(<App />)
```

**שאלה:** ״האם `App.tsx` מחליף את `index.html`?״ תשובה: לא — הוא מרונדר בתוך אלמנט השורש של הדף.

### L03 — איפה כותבים JavaScript ואיפה HTML? מה זה TSX?

**מטרה:** להבין למה רואים תגיות לצד משתנים באותו קובץ.

- מחוץ ל־`return`: אפשר לכתוב משתנים, פונקציות, תנאים וטיפוסים של TypeScript.
- בתוך JSX: כותבים תגיות דמויות HTML ומשלבים **ביטויי JavaScript** עם `{}`.
- קובץ `.ts`: TypeScript ללא JSX; קובץ `.tsx`: TypeScript שכולל JSX; `.css`: עיצוב.
- ב־JSX משתמשים ב־`className` ולא ב־`class`; אירועים נכתבים למשל כ־`onClick`.
- קומפוננטה מחזירה שורש אחד או `Fragment`.

```tsx
export default function App() {
  const studentName = 'Dana'
  const lessons = 3

  return (
    <main>
      <h1 className="text-2xl">שלום {studentName}</h1>
      <p>כבר למדנו {lessons} שיעורים</p>
    </main>
  )
}
```

**הדגמה חיה:** לשנות את השם ואת מספר השיעורים ולראות איך הדפדפן מתעדכן. להראות ש־`{lessons + 1}` הוא ביטוי ולא כתיבת HTML ישירה.

**שאלה:** ״מה יקרה אם נכתוב `{1 + 2}`?״ תשובה: יוצג 3.

### L04 — מה זה קומפוננטה?

**מטרה:** להבין חלוקה לחלקים ושימוש חוזר.

**אנלוגיה:** פונקציה שמייצרת כרטיס זהה בכל פעם, עם אפשרות לקבל מידע שונה.

```tsx
function Welcome() {
  return <h2>ברוכים הבאים!</h2>
}

export default function App() {
  return (
    <main>
      <Welcome />
      <Welcome />
    </main>
  )
}
```

**דגש:** שמות קומפוננטות באות גדולה; `<Welcome />` אינו תג HTML רגילה אלא שימוש בקומפוננטה.

**שאלה:** ״למה לא לכתוב פעמיים את אותו HTML?״ תשובה: שימוש חוזר ותחזוקה קלה.

### L05 — Props: מידע שעובר מהורה לילד

```tsx
type GreetingProps = {
  name: string
}

function Greeting({ name }: GreetingProps) {
  return <p>שלום {name}!</p>
}

export default function App() {
  return (
    <>
      <Greeting name="דנה" />
      <Greeting name="יובל" />
    </>
  )
}
```

**הסבר:** `App` הוא ההורה, `Greeting` ילד. `name` הוא ערך שההורה מסר. `Props` הם קלט לקריאה — הילד לא משנה אותם ישירות. TypeScript מסייע לבדוק שנשלח טיפוס נכון.

**שאלה:** ״האם `Greeting` אמור לשנות את ה־Props שקיבל?״ תשובה: לא.

### L06 — Tailwind: מעצבים בלי לכתוב כל כלל CSS לבד

**להתחיל מהסבר פשוט:** `className` יכול להכיל שמות מחלקות ש־Tailwind מתרגם לכללי עיצוב. לא חייבים להמציא שם מחלקה ולכתוב את כל ה־CSS.

```tsx
function InfoCard() {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-bold text-slate-900">כרטיס React</h2>
      <p className="mt-2 text-slate-600">זהו כרטיס שעיצבנו עם Tailwind.</p>
    </article>
  )
}
```

**להסביר את כל המילים:** `rounded-2xl` מעגל פינות, `p-6` רווח פנימי, `shadow-lg` צל, `text-xl` גודל טקסט, `font-bold` עובי, `mt-2` רווח למעלה.

**הדגמה:** `flex`, `gap-4`, `grid`, `md:grid-cols-2`, `hover:bg-cyan-100`. להסביר ש־`md:` חל רק מרוחב מסך מסוים ומעלה. עבור RTL להעדיף `ms-`, `me-`, `ps-`, `pe-` על פני מרווחים פיזיים שמאל/ימין כשזה מתאים.

**תרגיל קצר:** לשנות צבע רקע, להגדיל ריווח ולהוסיף מסגרת. **שאלה:** ״מה היתרון המרכזי של Tailwind?״ תשובה: כתיבת עיצוב דרך מחלקות שימושיות, קרוב לרכיב.

### L07 — State: איך רכיב זוכר דברים?

**מטרה:** להבין מידע שמשתנה עם הזמן ומשפיע על מה שרואים.

```tsx
function WrongCounter() {
  let count = 0
  return (
    <button
      onClick={() => {
        count += 1
      }}
    >
      {count}
    </button>
  )
}
```

**למה זה לא עובד כפי שציפינו?** שינוי משתנה מקומי רגיל לא מודיע ל־React שצריך לרנדר מחדש; וגם בהרצה הבאה של הפונקציה המשתנה מתחיל מחדש.

**יתרונות State:** שומר מידע בין רינדורים, שינוי שלו מבקש רינדור, מתאר מסך לפי נתונים. **מגבלות:** כל רינדור מקבל צילום מצב משלו; יותר מדי State מסבך; לא לשמור State אם אפשר לחשב את הערך מנתונים קיימים.

**שאלה:** ״האם `count++` לבדו מבקש מ־React לעדכן מסך?״ תשובה: לא.

### L08 — useState + אירועים + צילום מצב

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount((previous) => previous + 1)
    console.log(count)
  }

  return <button onClick={handleClick}>לחצנו {count} פעמים</button>
}
```

**להסביר אחד־אחד:** `count` הוא הערך של הרינדור הנוכחי; `setCount` מבקש לעדכן את הערך לרינדור הבא; `useState(0)` קובע ערך התחלתי; `previous => previous + 1` מחשב את הערך הבא מתוך המצב האחרון בתור העדכונים.

**מלכודת מכוונת:** `console.log(count)` בתוך `handleClick` רואה את `count` של הרינדור הזה, גם אחרי `setCount`. זה לא אומר שהעדכון נכשל. להמחיש בהרצה ולחזור על הדוגמה עם שתי קריאות פונקציונליות כדי לקבל תוספת 2.

**שאלה:** ״למה לא מצפים לראות את הערך החדש ב־`console.log` באותה פונקציה?״ תשובה: כי היא מחזיקה צילום מצב מהרינדור שבו נוצרה.

### L09 — מתי React מרנדר ומה ההבדל בין Render ל־Commit?

**שרשרת חזותית בת ארבע תחנות:**

```text
לחיצה / טעינה
    ↓
Trigger — שינוי State או רינדור ראשוני
    ↓
Render — React מפעיל קומפוננטות ומחשב JSX חדש
    ↓
Commit — React מחיל שינויי DOM שנדרשים
    ↓
Paint — הדפדפן מציג את התוצאה
```

**דגש:** רינדור הוא חישוב, לא בהכרח שינוי של `DOM`. שינוי מצב בהורה עלול לגרום גם לרינדור ילדים; לא כל רינדור משנה בפועל אלמנט בדף. `useEffect` מיועד לסנכרון עם משהו חיצוני ורץ לאחר `Commit` רלוונטי; תזמון הציור לעומת האפקט יכול להשתנות לפי סוג האינטראקציה, ולכן לא להבטיח תמיד סדר חזותי מוחלט של אפקט מול Paint.

**הדגמת מרצה:** `console.log('render')` בגוף קומפוננטה ו־`console.log('click')` ב־handler; להראות שלחיצה מבקשת עדכון. בסביבת `StrictMode` בפיתוח ייתכנו קריאות נוספות בכוונה.

### L10 — useEffect, תלויות ו־Cleanup

**משתמשים ב־Effect כדי לסנכרן מערכת חיצונית**, למשל כותרת הדפדפן, טיימר או מאזין אירוע. לא משתמשים בו כדי לחשב סתם ערך שאפשר לחשב בזמן `render`.

```tsx
import { useEffect, useState } from 'react'

function CounterWithTitle() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `לחיצות: ${count}`
  }, [count])

  return <button onClick={() => setCount((prev) => prev + 1)}>{count}</button>
}
```

**להסביר תלויות:**

- ללא מערך תלויות: האפקט רץ אחרי כל Commit רלוונטי של הקומפוננטה.
- `[]`: האפקט מוגדר להפעלה בהתקנה; במצב פיתוח עם `StrictMode` ייתכנו מחזורי setup/cleanup נוספים.
- `[count]`: בהרצה הראשונית ושוב כש־`count` משתנה.

**Cleanup — לא משאירים טיימר רץ:**

```tsx
useEffect(() => {
  const id = window.setInterval(() => {
    console.log('tick')
  }, 1000)

  return () => window.clearInterval(id)
}, [])
```

**דגש:** הניקוי מתבצע לפני הפעלה מחדש כשהתלויות משתנות וגם בפירוק הקומפוננטה; בפיתוח `StrictMode` יש מחזור בדיקה נוסף. לא להציג אותו כבאג.

**שאלה:** ״מתי אבחר `useEffect` במקום לחשב `const total = tasks.length`?״ תשובה: כאשר צריך לסנכרן משהו חיצוני, לא עבור חישוב נגזר פשוט.

### L11 — תחנת סיכום: בחירת הכלי הנכון

להציג ארבעה תרחישים והמשתתף בוחר מושג; לשמור את הבחירה מקומית ולגלות את ההסבר.

1. ההורה שולח שם לרכיב ילד → **Props**.
2. מונה צריך לזכור את מספר הלחיצות → **useState**.
3. לחיצה על כפתור מוסיפה משימה → **event handler**.
4. צריך לשמור משימות ב־localStorage אחרי שינוי → **useEffect**.
5. צריך לחשב כמה משימות הושלמו מתוך מערך קיים → **חישוב רגיל ב־render**, לא State ולא Effect נוספים.

**מעבר:** כותרת ״עכשיו בונים אפליקציה אמיתית״; צילום מסך יעד, מתווה רכיבים ותחנה ראשונה. כל התוכן מההרצאה נשאר נגיש בחזרה באמצעות גלילה למעלה או דרך רשימת תחנות קומפקטית.

---

## 5. פרויקט המעבדה: ״משימה שלי״ — Task Dashboard

### תמונת היעד (נכס חובה)

![צילום יעד — לוח המשימות שהמשתתפים יבנו](./taskflow-target.png)

> קובץ התמונה חייב להיות מועתק יחד עם מסמך זה ועם נכסי האתר. באתר יש להציג את התמונה בגודל קריא עם אפשרות הגדלה, תיאור טקסטואלי ונקודות מיקוד לפי שלב. **התמונה היא עיצוב יעד ולא צילום של אפליקציה שכבר נכתבה.** טקסטים קטנים בתמונת קונספט אינם מקור אמת; התוכן וההתנהגות המדויקים מוגדרים להלן.

### מה רואים בתמונה — פירוק לרכיבים

- `Navbar`: לוגו React ושם האתר ״משימה שלי״, קישור למשימות, קישור לסטטיסטיקה (עוגן לאותה תצוגה), מתג מצב כהה כהרחבת רשות.
- `Hero`: ״בואו נעשה סדר ביום״ והסבר קצר.
- `Stats`: סך משימות, הושלמו, בתהליך, אחוז השלמה.
- `AddTaskForm`: שדה עם ״מה צריך לעשות היום?״ וכפתור ״הוספת משימה״.
- `FilterTabs`: הכול, פעילות, הושלמו.
- `TaskList`: כמה `TaskItem` עם שם, קטגוריה, סימון השלמה וכפתור מחיקה.
- `Footer`: ״נבנה עם React, TypeScript ו־Tailwind CSS״.

### דרישות התנהגות של אפליקציית התלמיד

**חובה:** הוספת משימה לא ריקה; הצגת רשימה; שינוי סטטוס השלמה; מחיקה; סינון; חישוב סטטיסטיקה ללא State כפול; שמירה ב־`localStorage` באמצעות `useEffect`; עיצוב רספונסיבי נגיש. **רשות:** מצב כהה, קטגוריות לבחירה, מונה זמן עם Cleanup.

### מודל נתונים וסכמה קבועה

```ts
export type TaskCategory = 'study' | 'personal' | 'work'

export type Task = {
  id: string
  title: string
  category: TaskCategory
  completed: boolean
}

export type TaskFilter = 'all' | 'active' | 'completed'
```

כל הנתונים לדוגמה והטקסטים הקבועים ב־`src/constants/tasks.ts`; בלי לפזר טקסטים ומזהי קטגוריות בקומפוננטות.

### מבנה קבצים בתוצאה הסופית

```text
src/
├── App.tsx
├── index.css
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── AddTaskForm.tsx
│   ├── FilterTabs.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── constants/
│   └── tasks.ts
└── types/
    └── task.ts
```

---

## 6. חוויית הלמידה במעבדה — לא לתת פתרון לפני ניסיון

כל תחנת `Wxx` חייבת לכלול **שישה אזורים בסדר קבוע**:

1. **מה בונים עכשיו?** מטרה אחת פשוטה והדגשה חזותית של האזור המתאים בצילום היעד.
2. **למה צריך את זה?** הסבר בשפה של מתחיל, עם קשר למושג שלמדנו בהרצאה.
3. **אתגר לביצוע:** משימה קטנה שאפשר להשלים בכמה דקות, כולל שם הקובץ המדויק ליצירה/עריכה.
4. **מה אמורים לראות?** תיאור תוצאה צפויה (לא טענה שהאתר בדק אוטומטית).
5. **רמז ראשון — הסבר בלבד:** טקסט קצר עם כיוון מחשבה; **בלי קוד מלא**.
6. **רמז מלא — הסבר + קוד עובד:** נפתח רק בבחירה יזומה, אחרי הרמז הראשון או ישירות לפי העדפת המשתתף. אין לחשוף את הקוד המלא בברירת מחדל.

**עיצוב הרמזים:** שני אזורי Disclosure נפרדים (לא כפתורי ניווט). `aria-expanded`, תמיכה במקלדת, אפשרות סגירה והעתקת קוד, ללא הסתרת ההוראות. לכל תחנה יש גם **״בדקו את עצמכם״** עם 1–2 תרחישים: מה אמור לקרות בדפדפן ולמה. העתקה אינה הוכחה להבנה.

### תבנית נתונים למימוש

```ts
type WorkshopStep = {
  id: string
  title: string
  minutes: number
  targetHighlight: string
  concept: string
  filePaths: string[]
  goal: string
  instructions: string[]
  expectedResult: string
  basicHint: string
  fullHintExplanation: string
  fullHintCode: Array<{ path: string; language: string; code: string }>
  selfCheck: Array<{ question: string; answer: string }>
  optionalChallenge?: string
}
```

**מקור אמת:** `src/content/lecture.ts`, `src/content/workshop.ts`, `src/constants/...`; לא לשכפל מלל לתוך קומפוננטות. אין לבצע `eval` של קוד התלמיד או לטעון שקוד העתקה הוא הרצה מאובטחת.

---

## 7. תחנות המעבדה — תוכן מדויק + רמזים מלאים

### W00 — מפרקים את צילום היעד (8 דקות)

**למה:** לפני שכותבים, צריך להבין את המבנה של הממשק. להגדיל את התמונה ולהאיר לפי סדר: Navbar, Hero, Stats, Form, Filters, List.

**המשימה:** המשתתף כותב לעצמו אילו דברים חוזרים, מה צריך לזכור (State) ומה אפשר לחשב. לא כותבים קוד עדיין.

**רמז בסיסי:** ״כרטיס משימה חוזר כמה פעמים — אולי כדאי להפוך אותו לקומפוננטה.״

**רמז מלא:** ״ניצור קומפוננטות נפרדות לכל אזור. נשמור `tasks`, `input` ו־`filter` ב־State. את המספרים בכרטיסי הסטטיסטיקה נחשב מתוך מערך המשימות.״

**בדיקת הבנה:** ״האם מספר המשימות שהושלמו חייב להיות State נפרד?״ לא — אפשר לחשב אותו מ־`tasks`.

### W01 — בונים Navbar (12 דקות)

**מטרה:** לדעת לכתוב קומפוננטה ראשונה ומעט Tailwind. **פוקוס תמונה:** פס הניווט העליון.

**לעשות:** ליצור `src/components/Navbar.tsx`, להחזיר `<header>` ובו שם האפליקציה ושני קישורים לעוגנים. לייבא ב־`App.tsx`.

**רמז בסיסי:** ״קומפוננטה היא פונקציה שמחזירה JSX. אפשר להשתמש ב־`flex`, `justify-between`, `p-4` כדי לסדר תוכן בשורה.״

**רמז מלא — הסבר וקוד:** ליצור קובץ בדיוק כך:

```tsx
// src/components/Navbar.tsx
export default function Navbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <a href="#top" className="text-xl font-bold text-slate-900">
        משימה שלי ⚛
      </a>
      <nav
        aria-label="ניווט ראשי"
        className="flex gap-4 text-sm font-medium text-slate-700"
      >
        <a href="#tasks" className="hover:text-cyan-600">
          המשימות שלי
        </a>
        <a href="#stats" className="hover:text-cyan-600">
          סטטיסטיקה
        </a>
      </nav>
    </header>
  )
}
```

```tsx
// src/App.tsx — מצב זמני בשלב זה
import Navbar from './components/Navbar'
export default function App() {
  return (
    <div id="top" dir="rtl" className="min-h-screen bg-slate-100 p-6">
      <Navbar />
    </div>
  )
}
```

**מה אמורים לראות:** פס לבן עם שם האתר וקישורים. **בדיקה:** לשנות את שם האפליקציה ולראות שינוי בדפדפן.

### W02 — Hero ועימוד (10 דקות)

**מטרה:** להבין קומפוננטה נוספת ו־responsive layout. **פוקוס:** כותרת הממשק.

**רמז בסיסי:** ״`max-w-5xl mx-auto` מגביל רוחב וממרכז. `mt-8` נותן מרווח מעל.״

**רמז מלא:**

```tsx
// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="py-10">
      <p className="mb-2 font-semibold text-cyan-700">
        לומדים React דרך פרויקט
      </p>
      <h1 className="text-3xl font-extrabold text-slate-900 md:text-5xl">
        בואו נעשה סדר ביום
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        מארגנים משימות, צעד אחר צעד.
      </p>
    </section>
  )
}
```

**שילוב ב־App:** להוסיף `import Hero from './components/Hero'` ולהציב `<Hero />` אחרי `<Navbar />`, בתוך מעטפת `max-w-5xl mx-auto`.

**בדיקה:** במסך צר הכותרת עדיין קריאה ללא גלילה אופקית.

### W03 — יוצרים טיפוס Task ונתוני התחלה (10 דקות)

**מטרה:** להבין איך עוברים מרשימת טקסט לנתונים מסודרים.

**רמז בסיסי:** ״כל משימה היא אובייקט עם מזהה, כותרת וערך `completed`. כדאי לקבוע טיפוס אחד שמשמש את כל הרכיבים.״

**רמז מלא:**

```ts
// src/types/task.ts
export type TaskCategory = 'study' | 'personal' | 'work'
export type Task = {
  id: string
  title: string
  category: TaskCategory
  completed: boolean
}
export type TaskFilter = 'all' | 'active' | 'completed'
```

```ts
// src/constants/tasks.ts
import type { Task } from '../types/task'

export const STORAGE_KEY = 'react-workshop-tasks-v1'
export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'לסיים את תרגיל React',
    category: 'study',
    completed: false,
  },
  { id: 't2', title: 'לקרוא על Props', category: 'study', completed: true },
  { id: 't3', title: 'להכין מצגת לקורס', category: 'work', completed: false },
]

export const CATEGORY_LABELS = {
  study: 'למידה',
  personal: 'אישי',
  work: 'עבודה',
} as const

export const FILTER_LABELS = {
  all: 'הכול',
  active: 'פעילות',
  completed: 'הושלמו',
} as const
```

**בדיקה:** להסביר למה כל משימה צריכה `id` יציב ושונה, ולמה לא מומלץ להשתמש באינדקס הרשימה כשמוחקים/מוסיפים.

### W04 — יוצרים TaskItem עם Props (13 דקות)

**מטרה:** להבין רכיב מקבל נתונים ופונקציות מהורה.

**רמז בסיסי:** ״הרכיב לא צריך לדעת את כל רשימת המשימות. הוא צריך רק משימה אחת ו־callbacks כשהמשתמש לוחץ.״

**רמז מלא:**

```tsx
// src/components/TaskItem.tsx
import type { Task } from '../types/task'
import { CATEGORY_LABELS } from '../constants/tasks'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-0">
      <input
        aria-label={`סמן השלמה: ${task.title}`}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 accent-cyan-600"
      />
      <span
        className={`min-w-0 flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}
      >
        {task.title}
      </span>
      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-800">
        {CATEGORY_LABELS[task.category]}
      </span>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`מחק משימה: ${task.title}`}
        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
      >
        מחיקה
      </button>
    </li>
  )
}
```

**בדיקה:** ״מי הבעלים של ה־State?״ `App`. הרכיב רק מציג ומדווח על אירוע.

### W05 — מציגים TaskList עם map (14 דקות)

**מטרה:** ללמוד להשתמש ב־`map` ולהבין `key`.

**רמז בסיסי:** ״`tasks.map` יוצר `TaskItem` לכל משימה. צריך לספק `key` קבוע.״

**רמז מלא:**

```tsx
// src/components/TaskList.tsx
import TaskItem from './TaskItem'
import type { Task } from '../types/task'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl bg-white p-8 text-center text-slate-500">
        אין משימות להצגה.
      </p>
    )
  }
  return (
    <ul className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
```

**הדגמה ב־App בשלב זה:** להחזיק `const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)`, להציג `<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} />`. להבהיר שכפתורי השינוי עדיין לא יעבדו עד W07 — זה תקין בשלב הביניים.

**בדיקה:** ליצור נתון רביעי ב־`INITIAL_TASKS` ולראות עוד שורה.

### W06 — מוסיפים טופס ומשימה חדשה עם useState (15 דקות)

**מטרה:** להבין controlled input, אירוע `onSubmit`, ו־State שחי בהורה.

**רמז בסיסי:** ״ערך שדה הקלט חי ב־State של הטופס. כששולחים, קוראים ל־`onAdd`, ואז מנקים את השדה.״

**רמז מלא:**

```tsx
// src/components/AddTaskForm.tsx
import { useState, type FormEvent } from 'react'

type AddTaskFormProps = { onAdd: (title: string) => void }

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    onAdd(cleanTitle)
    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row"
    >
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="שם המשימה החדשה"
        placeholder="מה צריך לעשות היום?"
        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
      />
      <button
        type="submit"
        className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400"
      >
        הוספת משימה
      </button>
    </form>
  )
}
```

ב־`App.tsx`:

```tsx
function addTask(title: string) {
  setTasks((previous) => [
    { id: crypto.randomUUID(), title, category: 'personal', completed: false },
    ...previous,
  ])
}
```

**בדיקה:** משימה ריקה לא מתווספת; משימה עם שם מתווספת בראש הרשימה; השדה מתרוקן.

### W07 — משלימים ומוחקים משימות (13 דקות)

**מטרה:** להבין למה לא משנים `State` ישירות.

**רמז בסיסי:** ״לשינוי משימה אחת משתמשים ב־`map`, ולמחיקה ב־`filter`. מחזירים מערך חדש.״

**רמז מלא:** ב־`App.tsx`, לצד `addTask`:

```tsx
function toggleTask(id: string) {
  setTasks((previous) =>
    previous.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ),
  )
}

function deleteTask(id: string) {
  setTasks((previous) => previous.filter((task) => task.id !== id))
}
```

להעביר לרשימה: `onToggle={toggleTask}` ו־`onDelete={deleteTask}`.

**מה צפוי:** סימון משנה עיצוב וקו חוצה; מחיקה מסירה משימה. **שאלה:** ״למה `task.completed = true` אינה דרך מומלצת?״ כי זה שינוי ישיר של אובייקט שנמצא ב־State במקום יצירת אובייקט חדש.

### W08 — סינון וסטטיסטיקות נגזרות (9 דקות)

**מטרה:** לתרגל State אחד לפילטר וחישובים רגילים לנתונים נגזרים.

**רמז בסיסי:** ״`filter` הוא State; מספר המשימות שבוצעו מחושב מ־`tasks`. לא צריך State נוסף לאחוז ההשלמה.״

**רמז מלא:**

```tsx
// src/components/FilterTabs.tsx
import { FILTER_LABELS } from '../constants/tasks'
import type { TaskFilter } from '../types/task'

type FilterTabsProps = {
  value: TaskFilter
  onChange: (value: TaskFilter) => void
}

export default function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div
      role="group"
      aria-label="סינון משימות"
      className="flex flex-wrap gap-2"
    >
      {(Object.keys(FILTER_LABELS) as TaskFilter[]).map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
          className={`rounded-full px-4 py-2 text-sm ${value === filter ? 'bg-cyan-300 text-slate-950' : 'bg-white text-slate-700'}`}
        >
          {FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  )
}
```

```tsx
// src/components/Stats.tsx
type StatsProps = { total: number; completed: number }
export default function Stats({ total, completed }: StatsProps) {
  const active = total - completed
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const values = [
    ['סך משימות', total],
    ['הושלמו', completed],
    ['בתהליך', active],
    ['אחוז השלמה', `${percent}%`],
  ] as const
  return (
    <section
      id="stats"
      aria-label="סטטיסטיקות"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {values.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      ))}
    </section>
  )
}
```

ב־`App.tsx`:

```tsx
const [filter, setFilter] = useState<TaskFilter>('all')
const completed = tasks.filter((task) => task.completed).length
const visibleTasks = tasks.filter(
  (task) =>
    filter === 'all' ||
    (filter === 'completed' ? task.completed : !task.completed),
)
```

**בדיקה:** אחרי סימון משימה, המספרים מתעדכנים אוטומטית. פילטר ״הושלמו״ מציג רק משימות שבוצעו.

### W09 — שומרים נתונים עם useEffect (7 דקות)

**מטרה:** להבין חיבור למערכת חיצונית — אחסון בדפדפן.

**רמז בסיסי:** ״`localStorage` נשמר בין רענונים. נאתחל את State מתוך האחסון, ונשמור כשהמערך משתנה.״

**רמז מלא:**

```tsx
import { useEffect, useState } from 'react'
import { INITIAL_TASKS, STORAGE_KEY } from './constants/tasks'
import type { Task } from './types/task'

function readTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_TASKS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return INITIAL_TASKS
    return parsed.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.completed === 'boolean' &&
        ['study', 'personal', 'work'].includes(item.category),
    )
      ? (parsed as Task[])
      : INITIAL_TASKS
  } catch {
    return INITIAL_TASKS
  }
}

const [tasks, setTasks] = useState<Task[]>(readTasks)

useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // אחסון עשוי להיות חסום או מלא; האפליקציה ממשיכה לעבוד ללא שמירה.
  }
}, [tasks])
```

**הערה למרצה:** `readTasks` היא פונקציית אתחול עצלה, לא Effect. ה־Effect כאן מסנכרן את מערך המשימות עם האחסון אחרי שינוי. אין צורך ב־Cleanup עבור פעולת `setItem` חד־פעמית.

**בדיקה:** מוסיפים משימה, מרעננים את הדף — היא עדיין שם. אם האחסון חסום, אין להבטיח שמירה.

### W10 — סיום, בדיקה והרחבת רשות (4 דקות)

**חמש בדיקות ידניות חובה:** להוסיף משימה; לסמן בוצעה; לסנן; למחוק; לרענן ולוודא שהמצב נשמר. לבדוק מסך צר וניווט במקלדת.

**הרחבה א — מונה זמן המדגים Cleanup:** להציג משך שימוש בדף.

```tsx
import { useEffect, useState } from 'react'

export function SessionTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <p aria-live="off">זמן פעילות: {seconds} שניות</p>
}
```

**הרחבה ב:** מצב כהה באמצעות Tailwind; לא חובה למתחילים. **הרחבה ג:** לבחור קטגוריה לכל משימה.

---

## 8. App.tsx — דוגמת חיבור סופית למרצה ול״רמז מלא״ מסכם

> הקוד הבא מחבר את הרכיבים שהוגדרו בתחנות. אין להציג אותו למשתתפים לפני שהם מנסים לבנות בעצמם. בקובצי התלמיד השמות והייבואים צריכים להתאים לקבצים שנוצרו בפועל.

```tsx
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import AddTaskForm from './components/AddTaskForm'
import FilterTabs from './components/FilterTabs'
import TaskList from './components/TaskList'
import { INITIAL_TASKS, STORAGE_KEY } from './constants/tasks'
import type { Task, TaskFilter } from './types/task'

function readTasks(): Task[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return INITIAL_TASKS
    const data: unknown = JSON.parse(value)
    if (!Array.isArray(data)) return INITIAL_TASKS
    return data.every(
      (task) =>
        task &&
        typeof task === 'object' &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean' &&
        ['study', 'personal', 'work'].includes(task.category),
    )
      ? (data as Task[])
      : INITIAL_TASKS
  } catch {
    return INITIAL_TASKS
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(readTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The app remains usable when local storage is unavailable.
    }
  }, [tasks])

  function addTask(title: string) {
    setTasks((previous) => [
      {
        id: crypto.randomUUID(),
        title,
        category: 'personal',
        completed: false,
      },
      ...previous,
    ])
  }

  function toggleTask(id: string) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id))
  }

  const completed = tasks.filter((task) => task.completed).length
  const visibleTasks = tasks.filter(
    (task) =>
      filter === 'all' ||
      (filter === 'completed' ? task.completed : !task.completed),
  )

  return (
    <div
      id="top"
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-slate-100 px-4 py-8 text-slate-900"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-7">
        <Navbar />
        <Hero />
        <Stats total={tasks.length} completed={completed} />
        <AddTaskForm onAdd={addTask} />
        <section id="tasks" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">המשימות שלי</h2>
            <FilterTabs value={filter} onChange={setFilter} />
          </div>
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </section>
        <footer className="py-6 text-center text-sm text-slate-500">
          נבנה עם React, TypeScript ו־Tailwind CSS
        </footer>
      </div>
    </div>
  )
}
```

**מסלול מרצה:** בתחילה מציגים רק את האזור הנוכחי; בכל שלב מוסיפים רכיב ואז בודקים בדפדפן. אי אפשר לצפות מהכיתה להקליד את כל הקוד המסכם בבת אחת.

---

## 9. מה האתר המארח צריך לאפשר למרצה

- **מצב מרצה:** שמות התחנות, משכי זמן, תשובות לשאלות והערות הסבר; בלי לחשוף רמזים מלאים לתלמידים כברירת מחדל.
- **סרגל זמן לא כופה:** התקדמות משוערת של ההרצאה ושל המעבדה בנפרד; לא מחליף מעקב אמיתי אחרי משתתפים.
- **הקפאה לקריאה בלבד:** אפשר להציג תחנה אחת ולהגדיל קוד בקליק, אבל תנועת הגלילה הבסיסית לא ננעלת בגלל אנימציית כניסה.
- **כפתור ״העתקת פקודה״:** רק ליד פקודות וקוד; לא כפתור ניווט.
- **רמזים מתקדמים:** רמז ראשון טקסטואלי, רמז מלא עם קוד, ותשובה לבדיקה; לכל רמז פתיחה/סגירה נגישה.
- **תמונה יעד לאורך כל המעבדה:** תצוגה ממוזערת עם סימון אזור הבנייה הנוכחי; לחיצה מגדילה אותה. ברוחב צר לא להסתיר תוכן חיוני.
- **בדיקות מציאותיות:** אם אין שרת שמריץ קוד של התלמיד, לא לכתוב ״הקוד שלך עבר טסטים״. אפשר להציע רשימת בדיקה עצמית.
- **שמירת התקדמות בדפדפן:** תחנה נוכחית, הרמזים שנפתחו, והשלמה ידנית; בלי לטעות בין התקדמות קריאה לבין הצלחה בקוד.

---

## 10. משימות קטנות ל־Codex — סדר מימוש (מבלי למחוק את TASKS.md הקיים)

יש להוסיף משימות חדשות עם מזהים ייחודיים `EDU01`–`EDU16` ולשמור את כל המשימות שסומנו כבוצעו.

- [ ] **EDU01:** ליצור מודל `LearningSection` / `LectureStop` / `WorkshopStep`; בדיקות טיפוסים וולידציית נתונים.
- [ ] **EDU02:** לפתוח את המסך הראשון עם נתיב הרצאה אנכי ונתיב התקנה ימני; לוודא ששניהם גלויים ושמישים.
- [ ] **EDU03:** לממש מסלול הרצאה אנכי בלבד במנוע המצלמה הקיים; בלי פיצולי כן/לא בתוכן ההרצאה.
- [ ] **EDU04:** לממש כניסה למסלול התקנה וחיבור חזרה לתחנה L02; ללא איבוד מצב או קפיצות מצלמה.
- [ ] **EDU05:** להזין תוכן תחנות L00–L05, קוד, שאלות ומבנה קבצים; להוסיף בדיקות תוכן.
- [ ] **EDU06:** להזין תוכן תחנות L06–L11 כולל Tailwind, State, Snapshot, Render, Effects ו־Cleanup.
- [ ] **EDU07:** ליצור רכיבי `LectureStop`, `CodeExample`, `FileTree`, `KnowledgeCheck`; לעבוד עם תוכן מרכזי ולא hardcoded JSX.
- [ ] **EDU08:** ליצור מעבר מההרצאה למעבדה עם סרגל התקדמות נפרד; תמונה יעד מקומית זמינה.
- [ ] **EDU09:** ליצור מעטפת תחנת מעבדה: מטרה, הדגשת תמונה, הוראות, תוצאה ורמזים מדורגים.
- [ ] **EDU10:** להזין תחנות W00–W03 עם רמזים, קוד ודוגמאות; לבדוק הרמזים במקלדת.
- [ ] **EDU11:** להזין תחנות W04–W06; לוודא ש־Props, map ו־State מוסברים בסדר הדרגתי.
- [ ] **EDU12:** להזין תחנות W07–W10, כולל localStorage ו־Cleanup כהרחבה.
- [ ] **EDU13:** להוסיף מצב מרצה, שאלות והערות, ללא חשיפה בלתי רצונית של פתרונות.
- [ ] **EDU14:** לשלב soft snap ותצוגת מסלול רציף; לוודא שלא הוחזרו באגים בגלילה ימינה/שמאלה במסלול ההתקנה.
- [ ] **EDU15:** בדיקות Playwright לתרחישי הרצאה, כניסה להתקנה, הצטרפות מחדש, תרגול, פתיחת רמזים, חזרה ושמירת התקדמות.
- [ ] **EDU16:** להריץ lint, typecheck, tests, build; לבדוק שולחן עבודה ומובייל, לתעד ידנית מגבלות בדיקת trackpad, לבצע קומיטים ממוקדים.

**לכל משימה:** קובצים מדויקים, תלות, בדיקת קבלה וקומיט. אין לחזור על התקנת הפרויקט אם הוא כבר קיים. שינוי מבני רחב מחייב לשמור על העבודה שכבר נעשתה ועל היסטוריית Git.

---

## 11. בדיקות קבלה למוצר החדש

1. במסך הראשון ברור שאפשר **ללמוד למטה** או **להיכנס להתקנה בצד ימין**.
2. משך כל ההרצאה אין צורך לבחור ימינה/שמאלה; הרצאה היא ציר אנכי אחד.
3. גלילה קטנה מזיזה מעט; ליד תחנה המצלמה נמשכת קלות לטקסט אך לא ננעלת.
4. נראים קווים ממשיכים למקטע הבא, גם כשעוצרים בתחנת קריאה.
5. השלבים מכסים את הסדר שנדרש: התקנה → קבצים → TSX → רכיב → Props → State → useState → Render → useEffect, עם Tailwind כחלק מהשיעור.
6. לכל תחנת הרצאה יש דוגמה, הסבר פשוט, מה רואים ושאלה קצרה.
7. בסיום ההרצאה מופיעה תחנת מעבר למעבדה; המידע הקודם נשמר ונגיש.
8. תמונת יעד ״משימה שלי״ מופיעה וניתנת להגדלה, וכל תחנת מעבדה מדגישה אזור מתאים.
9. לכל תחנת מעבדה יש רמז טקסטואלי ורמז מלא עם קוד תקין, מוסתרים עד פתיחה יזומה.
10. דוגמת האפליקציה הסופית עובדת: הוספה, השלמה, מחיקה, סינון, סטטיסטיקה, רענון ושמירה.
11. הסברי `useState`, רינדור ו־`useEffect` נכונים גם תחת `StrictMode` בפיתוח.
12. Tailwind נלמד לפי מנגנון v4 עם פלאגין Vite, לא מדריך v3 מיושן.
13. RTL ברור וקוד באנגלית לא מתהפך. תמיכה במקלדת וב־reduced motion.
14. בדיקות יחידה ו־Playwright עוברות; אין טענה לאימות trackpad פיזי שלא בוצע.
15. תוספת המסלול הלימודי **לא שוברת** את מה שכבר עובד בניווט החופשי של האתר.

---

## 12. מקורות ועקרונות תוכן

**מקור ההרצאה:** מצגת המשתמש ״מה זה React — ואיך בונים איתו ממשק?״, 23 עמודים, המקיפה React מול JavaScript ידני, React מול Vite, קבצים, JSX/TSX, קומפוננטות, Props, State, useState, snapshot, Render/Commit/Paint, useEffect ו־Cleanup. קובץ זה **מרחיב** את המצגת לסדנה של כ־85 דקות ולמעבדה של עד 115 דקות; Tailwind, אפליקציית המשימות, סרגלי ניווט, רמזים ודוגמאות רבות הם **תוספות חדשות לאפיון**, לא טענות שהם הופיעו במצגת.

**מקורות רשמיים לעדכונים טכניים:**

- React Learn: https://react.dev/learn
- State as a Snapshot: https://react.dev/learn/state-as-a-snapshot
- Render and Commit: https://react.dev/learn/render-and-commit
- Vite Getting Started: https://vite.dev/guide/
- Tailwind v4 + Vite: https://tailwindcss.com/docs/installation/using-vite

**כלל אחרון לסוכן:** זהו תכנון חוויית לימוד, לא בקשה לבנות הכל בבת אחת בלי לבדוק. ליישם ברצף משימות קטנות, להשלים מבחני קבלה, ורק לאחר מכן לדווח שהמסלול מוכן.
