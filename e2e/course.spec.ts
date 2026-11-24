import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { at, travelTo, revisit } from './helpers'
const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const list: string[] = []
  errors.set(page, list)
  page.on('pageerror', (e) => list.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') list.push(m.text())
  })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
async function fresh(page: Page) {
  await page.goto('/')
  await at(page, 'home')
  await expect(page.locator('.graph-node-active h1')).toHaveText(
    'מה תרצו לעשות?',
  )
}
async function input(page: Page, x: number, y: number) {
  const b = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
  await page.mouse.wheel(x, y)
}
test('homepage has exactly two immediate diagonal choices; both routes and a full return work', async ({
  page,
}, info) => {
  await fresh(page)
  await expect(page.locator('.graph-branch')).toHaveCount(2)
  await expect(page.locator('.branch-left strong')).toHaveText('הרצאה')
  await expect(page.locator('.branch-right strong')).toHaveText('סדנה מעשית')
  await page.screenshot({ path: info.outputPath('home-initial.png') })
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await input(page, -350, 350)
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-distance',
    '0',
  )
  await travelTo(page, 'L00')
  await travelTo(page, 'home', -1)
  await expect(page.locator('.graph-node-active h1')).toHaveText(
    'מה תרצו לעשות?',
  )
  await expect(page.locator('.graph-branch')).toHaveCount(2)
  await page.screenshot({ path: info.outputPath('home-revisited.png') })
  await input(page, 350, 350)
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-distance',
    '0',
  )
  await travelTo(page, 'W00')
  await expect(
    page.locator('.graph-node-active [data-course-stop="W00"]'),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => scrollX === 0 && document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
test('lecture follows all twelve stops vertically and joins the workshop continuously', async ({
  page,
}) => {
  test.setTimeout(120000)
  await fresh(page)
  await page.locator('[data-edge-id="lecture"]').click()
  let x: string | null = null
  for (let i = 0; i < 12; i++) {
    const id = `L${String(i).padStart(2, '0')}`
    await travelTo(page, id)
    await expect(
      page.locator(`.graph-node-active [data-course-stop="${id}"]`),
    ).toBeVisible()
    const current = await page
      .locator('.world-stage')
      .getAttribute('data-camera-x')
    if (x) expect(Number(current)).toBeCloseTo(Number(x), 1)
    x = current
    if (id === 'L02') {
      const node = page.locator('.graph-node-active')
      await node
        .getByRole('button', { name: 'src/main.tsx', exact: true })
        .click()
      await expect(
        node.getByRole('heading', {
          name: 'נקודת הכניסה של React',
          exact: true,
        }),
      ).toBeVisible()
    }
    if (id === 'L06') {
      const node = page.locator('.graph-node-active')
      await node.getByRole('button', { name: 'ריווח רחב', exact: true }).click()
      await expect(
        node.getByText('bg-cyan-100 p-8 rounded-2xl', { exact: true }),
      ).toBeVisible()
    }
    if (id === 'L08') {
      const node = page.locator('.graph-node-active .graph-demo')
      await node.getByRole('button').first().click()
      await expect(node.locator('output').nth(1)).toHaveText('1')
    }
    if (id === 'L01') {
      await page
        .locator('.graph-node-active summary')
        .filter({ hasText: 'I03' })
        .click()
      await expect(
        page
          .locator('.graph-node-active pre')
          .filter({ hasText: 'npm create vite@latest my-react-app' }),
      ).toHaveCount(2)
    }
  }
  await travelTo(page, 'course-bridge')
  await travelTo(page, 'lecture-W00')
  await expect(
    page.locator('.graph-node-active [data-course-stop="W00"]'),
  ).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  )
})
test('workshop target, two independent hint levels and manual checks remain accessible and persistent', async ({
  page,
}, info) => {
  await fresh(page)
  await page.locator('[data-edge-id="workshop"]').click()
  await travelTo(page, 'W00')
  await page.getByRole('button', { name: 'הגדלת תמונת היעד' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await travelTo(page, 'W01')
  const node = page.locator('.graph-node-active')
  await expect(
    node.getByRole('region', { name: 'קובצי פתרון לתחנה' }),
  ).toHaveCount(0)
  await node.getByText('רמז ראשון — הסבר בלי קוד', { exact: true }).click()
  await expect(node.locator('details').first().locator('pre')).toHaveCount(0)
  await node.getByText('רמז מלא — הסבר וקוד עובד', { exact: true }).click()
  await expect(
    node.getByRole('region', { name: 'קובצי פתרון לתחנה' }),
  ).toBeVisible()
  await node
    .getByRole('checkbox', { name: 'בדקתי בעצמי את תוצאת התרגיל' })
    .check()
  await page.reload()
  await at(page, 'W01')
  await expect(
    page.locator('.graph-node-active').getByRole('checkbox'),
  ).toBeChecked()
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.screenshot({ path: info.outputPath('workshop-hints.png') })
})
test('React Tasks supports CRUD, title search, filters, three summaries and opt-in category persistence', async ({
  page,
}, info) => {
  await fresh(page)
  await revisit(page, 'W10 · בודקים את React Tasks המלאה')
  const app = page.getByRole('region', { name: 'React Tasks', exact: true })
  await expect(app.getByLabel('סך משימות', { exact: true })).toHaveText('8')
  await expect(
    app.getByRole('region', { name: 'סיכום משימות' }).locator('output'),
  ).toHaveCount(3)
  await app.getByLabel('שם המשימה החדשה', { exact: true }).fill('בדיקת תרגול')
  await app.getByRole('button', { name: 'הוספת משימה +' }).click()
  await app
    .getByRole('button', { name: 'עריכת משימה: בדיקת תרגול', exact: true })
    .click()
  await app.getByLabel('עריכת כותרת', { exact: true }).fill('React חדש')
  await app.getByRole('button', { name: 'שמירה', exact: true }).click()
  await app.getByLabel('חיפוש לפי כותרת', { exact: true }).fill('react חדש')
  await expect(app.getByRole('listitem')).toHaveCount(1)
  await app
    .getByRole('checkbox', { name: 'סימון השלמה: React חדש', exact: true })
    .check()
  await app
    .getByRole('group', { name: 'סינון משימות' })
    .getByRole('button', { name: 'פעילות', exact: true })
    .click()
  await expect(app.getByText('אין משימות להצגה.')).toBeVisible()
  await app
    .getByRole('group', { name: 'סינון משימות' })
    .getByRole('button', { name: 'הכול', exact: true })
    .click()
  await app
    .getByRole('button', { name: 'מחיקת משימה: React חדש', exact: true })
    .click()
  await app.getByRole('button', { name: 'Guide', exact: true }).click()
  await app
    .getByRole('checkbox', { name: 'הפעלת בונוס: קטגוריות ושמירה' })
    .check()
  await app.getByRole('button', { name: 'Tasks', exact: true }).click()
  await app.getByLabel('חיפוש לפי כותרת', { exact: true }).fill('')
  await app.getByLabel('שם המשימה החדשה', { exact: true }).fill('משימת בונוס')
  await app.getByLabel('קטגוריה', { exact: true }).selectOption('work')
  await app.getByRole('button', { name: 'הוספת משימה +' }).click()
  await app.getByLabel('סינון לפי קטגוריה').selectOption('work')
  await page.reload()
  await at(page, 'W10')
  await expect(
    app.getByRole('checkbox', {
      name: 'סימון השלמה: משימת בונוס',
      exact: true,
    }),
  ).toBeVisible()
  await app.locator('header').scrollIntoViewIfNeeded()
  await page.screenshot({ path: info.outputPath('react-tasks.png') })
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(
    audit.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([])
})
test('upgrading saved installation progress opens the new homepage without erasing the archive', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'react-world-navigation',
      JSON.stringify({
        version: 2,
        state: {
          route: ['node', 'verify'],
          cursor: 1,
          visited: ['node', 'verify'],
          choices: { node: 'yes' },
          traversed: ['node::verify'],
        },
      }),
    ),
  )
  await fresh(page)
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.visited).toContain('verify')
  expect(state.traversed).toContain('node::verify')
  await expect(page.locator('.graph-branch')).toHaveCount(2)
})
