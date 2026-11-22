import { test, expect } from '@playwright/test'
import {
  open,
  at,
  branch,
  roll,
  advance,
  settled,
  seedVisited,
  revisit,
} from './helpers'
test('create-project branches into the workshop, visits two stations, backtracks and persists personal checks', async ({
  page,
}) => {
  await open(page)
  await branch(page, 'yes')
  await at(page, 'verify')
  await branch(page, 'done')
  await at(page, 'project')
  await branch(page, 'new')
  await at(page, 'create')
  await expect(
    page.getByRole('heading', { name: 'מוכנים לכתוב קוד? סדנת Hands-on' }),
  ).toBeVisible()
  await branch(page, 'workshop')
  await at(page, 'workshop-plan')
  await branch(page, 'plan-120')
  await at(page, 'workshop-120')
  await advance(page, 'H01')
  await expect(page.locator('[data-command="NODE_VERSION"] code')).toHaveText(
    'node -v',
  )
  await page.getByRole('button', { name: 'בדיקה עצמית', exact: true }).click()
  await page
    .getByRole('checkbox', { name: 'בדקתי את התוצאה במחשב שלי' })
    .check()
  await advance(page, 'H02')
  await page.reload()
  await settled(page)
  await at(page, 'H02')
  await roll(page, -1)
  await at(page, 'H01')
  await page.getByRole('button', { name: 'בדיקה עצמית', exact: true }).click()
  await expect(
    page.getByRole('checkbox', { name: 'בדקתי את התוצאה במחשב שלי' }),
  ).toBeChecked()
  const progress = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-hands-on-progress')!).state,
  )
  expect(progress.checked).toEqual(['H01'])
  expect(progress.visited).toEqual(expect.arrayContaining(['H01', 'H02']))
})
test('solutions stay hidden behind hints and copying returns the complete source', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await seedVisited(page, ['H04'])
  await open(page)
  await revisit(page, 'H04 · JSX ראשון')
  await at(page, 'H04')
  await page.getByRole('button', { name: 'רמזים ופתרון', exact: true }).click()
  await expect(page.getByLabel('קובצי הפתרון')).toHaveCount(0)
  await page.getByRole('button', { name: 'רמז ראשון', exact: true }).click()
  await page.getByRole('button', { name: 'רמז שני', exact: true }).click()
  await expect(page.getByLabel('קובצי הפתרון')).toHaveCount(0)
  await page
    .getByRole('button', { name: 'חשיפת פתרון מלא', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'העתקת הקוד המלא', exact: true })
    .click()
  const source = await page.evaluate(() => navigator.clipboard.readText())
  expect(source).toContain('export default function App()')
  expect(source).toContain('<li>State</li>')
  expect(source.endsWith('}\n')).toBe(true)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'הורדת הקובץ', exact: true }).click()
  expect((await download).suggestedFilename()).toBe('App.tsx')
  await expect(page.locator('.workshop-code pre')).toHaveAttribute('dir', 'ltr')
})
test('the coding task is a world node and its live task list survives refresh', async ({
  page,
}) => {
  await seedVisited(page, ['H08'])
  await open(page)
  await revisit(page, 'H08 · Events ורשימת משימות')
  await at(page, 'H08')
  await page.getByRole('button', { name: 'לוח משימות חי', exact: true }).click()
  await page.getByRole('textbox', { name: 'משימה חדשה' }).fill('תרגול מהדפדפן')
  await page.getByRole('button', { name: 'הוספת משימה' }).click()
  await page.getByRole('checkbox').check()
  await expect(page.locator('.workshop-demo')).toContainText('משימות שנותרו: 0')
  await page.reload()
  await settled(page)
  await at(page, 'H08')
  await page.getByRole('button', { name: 'לוח משימות חי', exact: true }).click()
  await expect(page.getByRole('checkbox')).toBeChecked()
  await expect(page.locator('.workshop-demo')).toContainText('תרגול מהדפדפן')
})
test('long content is read within its stop before the next deliberate gesture advances', async ({
  page,
}) => {
  await seedVisited(page, ['H10'])
  await open(page)
  await revisit(page, 'H10 · Effect ושמירה')
  await at(page, 'H10')
  const reader = page.locator('.graph-reading')
  const before = await reader.evaluate((e) => ({
    height: e.clientHeight,
    content: e.scrollHeight,
  }))
  if (before.content > before.height + 1) {
    await roll(page)
    await at(page, 'H10')
    expect(await reader.evaluate((e) => e.scrollTop)).toBeGreaterThan(0)
  }
  await advance(page, 'H10-cleanup')
  await expect(page.locator('.graph-node-active')).toContainText(
    'clearInterval',
  )
  const box = await reader.boundingBox()
  expect(box!.y).toBeGreaterThan(60)
  expect(box!.y + box!.height).toBeLessThan(page.viewportSize()!.height - 60)
})
