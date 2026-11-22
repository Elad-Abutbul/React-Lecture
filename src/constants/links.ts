export const LINKS = {
  node: 'https://nodejs.org/',
  vite: 'https://vite.dev/guide/',
  react: 'https://react.dev/learn',
  typescript: 'https://react.dev/learn/typescript',
  render: 'https://react.dev/learn/render-and-commit',
  effects: 'https://react.dev/learn/synchronizing-with-effects',
  vscode: 'https://code.visualstudio.com/',
  git: 'https://git-scm.com/downloads',
} as const

export const TOOL_NAMES = { vscode: 'VS Code', git: 'Git' } as const
export const LEARNING_REFERENCES = [
  { label: 'המדריך הרשמי של React', url: LINKS.react },
  { label: 'TypeScript ב־React', url: LINKS.typescript },
  { label: 'Render ו־Commit', url: LINKS.render },
  { label: 'סנכרון עם Effects', url: LINKS.effects },
  { label: 'המדריך של Vite', url: LINKS.vite },
  { label: 'Node.js', url: LINKS.node },
] as const
export const REFERENCES_COPY = {
  title: 'מכאן ממשיכים לבנות',
  description:
    'הדוגמאות כאן הן נקודת פתיחה. התיעוד הרשמי הוא המקום להעמיק, לבדוק דרישות עדכניות ולהמשיך להתנסות.',
  navigation: 'מקורות רשמיים',
  return: 'חזרה לסביבת העבודה',
} as const
