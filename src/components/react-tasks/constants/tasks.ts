import type { Task, TaskFilter, TaskCategory } from '../types/task'
export const STORAGE_KEY = 'react-tasks-course-bonus-v1'
export const BONUS_KEY = 'react-tasks-course-bonus-enabled-v1'
export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'להתקין React וליצור פרויקט',
    completed: true,
    category: 'study',
  },
  {
    id: 't2',
    title: 'ליצור קומפוננטה לשימוש חוזר',
    completed: false,
    category: 'study',
  },
  {
    id: 't3',
    title: 'להוסיף State עם useState',
    completed: true,
    category: 'study',
  },
  {
    id: 't4',
    title: 'ללמוד useEffect ו־Cleanup',
    completed: false,
    category: 'study',
  },
  {
    id: 't5',
    title: 'לעצב את האפליקציה עם Tailwind CSS',
    completed: false,
    category: 'work',
  },
  {
    id: 't6',
    title: 'להכין רשימת משימות',
    completed: true,
    category: 'personal',
  },
  { id: 't7', title: 'לבדוק חיפוש ועריכה', completed: false, category: 'work' },
  { id: 't8', title: 'לבדוק תצוגת מובייל', completed: false, category: 'work' },
]
export const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'הכול',
  active: 'פעילות',
  completed: 'הושלמו',
}
export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  study: 'למידה',
  personal: 'אישי',
  work: 'עבודה',
}
export const TASK_COPY = {
  brand: 'React Tasks',
  tasks: 'Tasks',
  guide: 'Guide',
  navigation: 'תצוגת אפליקציית המשימות',
  heading: 'המשימות שלי',
  description: 'מארגנים משימות, צעד אחר צעד.',
  total: 'סך משימות',
  active: 'פעילות',
  completed: 'הושלמו',
  summary: 'סיכום משימות',
  search: 'חיפוש לפי כותרת',
  add: 'הוספת משימה',
  title: 'שם המשימה החדשה',
  placeholder: 'מה צריך לעשות היום?',
  save: 'שמירה',
  cancel: 'ביטול',
  edit: 'עריכת משימה',
  remove: 'מחיקת משימה',
  toggle: 'סימון השלמה',
  editTitle: 'עריכת כותרת',
  filter: 'סינון משימות',
  empty: 'אין משימות להצגה.',
  category: 'קטגוריה',
  categoryFilter: 'סינון לפי קטגוריה',
  allCategories: 'כל הקטגוריות',
  bonus: 'הפעלת בונוס: קטגוריות ושמירה',
  guideText:
    'Tasks הוא המסך שבונים בסדנה. הטיוטה והמסננים הם State; המונים מחושבים ממערך המשימות. הבונוס שומר את המשימות בדפדפן ומוסיף קטגוריות.',
  storageFailure:
    'האחסון חסום או מלא. אפשר להמשיך לעבוד, אבל השינויים לא יישמרו.',
  footer: 'נבנה עם React, TypeScript ו־Tailwind CSS',
} as const
