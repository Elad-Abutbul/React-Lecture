import { test, expect, type Page } from '@playwright/test'
const nodeTitle = 'יש לך Node.js מותקן?'
async function settled(page: Page) {
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-busy',
    'false',
  )
}
async function open(page: Page) {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: nodeTitle, exact: true }),
  ).toBeVisible()
  await settled(page)
}
async function direction(page: Page, key: 'ArrowLeft' | 'ArrowRight') {
  await page.keyboard.press(key)
  await settled(page)
}
test('opens a full-screen centered decision without yes/no buttons or embedded diagrams', async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await open(page)
  await expect(page.getByText('המסע שלך', { exact: true })).toHaveCount(0)
  await expect(page.locator('.react-flow')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'כן, נבדוק גרסאות', exact: true }),
  ).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  if (info.project.name === 'reduced-motion' || info.project.name === 'mobile')
    await expect(page.locator('.react-cursor')).toHaveCount(0)
  expect(errors).toEqual([])
})
test('keyboard follows the left installation branch and merges into the shared checkpoint', async ({
  page,
}) => {
  await open(page)
  await direction(page, 'ArrowLeft')
  await expect(
    page.getByRole('heading', { name: 'מה מערכת ההפעלה שלך?', exact: true }),
  ).toBeVisible()
  await direction(page, 'ArrowLeft')
  await expect(
    page.getByRole('heading', { name: 'התקנת Node.js ב־Windows', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'פתיחת המדריך הרשמי' }),
  ).toHaveAttribute('href', 'https://nodejs.org/')
  await page
    .getByRole('button', { name: 'התקנתי, בודקים', exact: true })
    .click()
  await settled(page)
  await expect(
    page.getByRole('heading', { name: 'בודקים את ההתקנה ידנית', exact: true }),
  ).toBeVisible()
  await expect(page.locator('[data-command="NODE_VERSION"] code')).toHaveText(
    'node -v',
  )
  await expect(page.locator('[data-command="NPM_VERSION"] code')).toHaveText(
    'npm -v',
  )
})
test('horizontal intent rejects small movement and accepts a deliberate diagonal gesture', async ({
  page,
}) => {
  await open(page)
  await page.mouse.wheel(30, 0)
  await page.waitForTimeout(280)
  await expect(
    page.getByRole('heading', { name: nodeTitle, exact: true }),
  ).toBeVisible()
  await page.mouse.wheel(100, 80)
  await page.mouse.wheel(100, 70)
  await expect(
    page.getByRole('heading', { name: 'בודקים את ההתקנה ידנית', exact: true }),
  ).toBeVisible()
  await settled(page)
  await page.mouse.wheel(300, 0)
  await page.waitForTimeout(280)
  await expect(
    page.getByRole('heading', { name: 'בודקים את ההתקנה ידנית', exact: true }),
  ).toBeVisible()
})
test('vertical native scroll moves the camera through the chosen path without changing choices', async ({
  page,
}) => {
  await open(page)
  await direction(page, 'ArrowLeft')
  const before = await page
    .locator('.world-stage')
    .getAttribute('data-camera-y')
  const saved = await page.evaluate(() =>
    localStorage.getItem('react-journey-progress'),
  )
  await page.mouse.wheel(0, -450)
  await expect
    .poll(() => page.locator('.world-stage').getAttribute('data-camera-y'))
    .not.toBe(before)
  expect(
    await page.evaluate(() => localStorage.getItem('react-journey-progress')),
  ).toBe(saved)
})
test('new project remains manual and its exact command copies to the clipboard', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  await direction(page, 'ArrowRight')
  await page.getByRole('button', { name: 'הבדיקה הצליחה', exact: true }).click()
  await settled(page)
  await direction(page, 'ArrowLeft')
  await expect(
    page.getByRole('heading', { name: 'יוצרים את הפרויקט', exact: true }),
  ).toBeVisible()
  const command = 'npm create vite@latest my-app -- --template react-ts'
  await expect(page.locator('[data-command="CREATE_REACT"] code')).toHaveText(
    command,
  )
  await page
    .getByRole('button', { name: `העתק פקודה: ${command}`, exact: true })
    .click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    command,
  )
  await expect(
    page.getByRole('button', { name: 'בוצע', exact: true }),
  ).toBeVisible()
  await page.reload()
  await settled(page)
  await expect(page.locator('.world-chrome')).toContainText('%')
})
