export const SECTIONS = [
  { id: 'start', label: 'תחילת המסע', caption: '01 / המסלול שלך' },
  { id: 'why-react', label: 'למה React?', caption: '02 / מחשבה חדשה' },
  { id: 'journey', label: 'מכינים את הסביבה', caption: '03 / מתחילים לבנות' },
  { id: 'files', label: 'מפת הקבצים', caption: '04 / מאחורי הממשק' },
  {
    id: 'foundations',
    label: 'יסודות React',
    caption: '05 / לומדים דרך הידיים',
  },
  { id: 'labs', label: 'מעבדה חיה', caption: '06 / עכשיו תורך' },
  { id: 'quiz', label: 'בודקים הבנה', caption: '07 / מחברים הכול' },
] as const
export const NAV_COPY = {
  brand: 'React Journey',
  tagline: 'ללמוד. לנסות. לבנות.',
  skip: 'דילוג לתוכן',
  landmark: 'ניווט במסע',
  footer: 'נבנה ללמידה דרך עשייה. כל ההתקדמות נשמרת רק בדפדפן שלך.',
  edition: 'סדנת React + TypeScript',
  back: 'בחזרה להתחלה',
} as const
export const ACTIVE_NAVIGATION = SECTIONS
