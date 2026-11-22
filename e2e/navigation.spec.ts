import { test, expect } from '@playwright/test'
import { open, at, branch, roll, settled } from './helpers'
test('opens a large spatial decision with no traditional progression controls', async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await open(page)
  await expect(
    page.getByRole('heading', { name: 'יש לך Node.js מותקן?', exact: true }),
  ).toBeVisible()
  await expect(page.getByText('המסע שלך', { exact: true })).toHaveCount(0)
  await expect(page.locator('.react-flow')).toHaveCount(0)
  await expect(
    page.getByRole('button', {
      name: /^(המשך|הבא|הקודם|הצלחתי|בוצע|נתקלתי בבעיה)$/,
    }),
  ).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  if (info.project.name !== 'desktop')
    await expect(page.locator('.react-cursor')).toHaveCount(0)
  expect(errors).toEqual([])
})
test('mouse-wheel-only Windows installation reaches commands and learning without clicking progression', async ({
  page,
}) => {
  test.setTimeout(60000)
  await open(page)
  await branch(page, 'no')
  await at(page, 'os')
  await branch(page, 'windows')
  await at(page, 'windows')
  await expect(
    page.getByRole('link', { name: 'המדריך הרשמי' }),
  ).toHaveAttribute('href', 'https://nodejs.org/')
  await roll(page)
  await at(page, 'verify')
  await branch(page, 'done')
  await at(page, 'project')
  await branch(page, 'new')
  await at(page, 'create')
  await expect(page.locator('[data-command="CREATE_REACT"] code')).toHaveText(
    'npm create vite@latest my-app -- --template react-ts',
  )
  await branch(page, 'installation')
  await at(page, 'create-result')
  await branch(page, 'done')
  await at(page, 'enter')
  for (const [current, next] of [
    ['enter', 'install'],
    ['install', 'dev'],
    ['dev', 'browser'],
  ]) {
    await roll(page)
    await at(page, `${current}-result`)
    await branch(page, 'done')
    await at(page, next)
  }
  await branch(page, 'done')
  await at(page, 'tools')
  await roll(page)
  await at(page, 'success')
  await roll(page)
  await at(page, 'declarative')
  await expect(page.locator('.graph-node-active')).toContainText('React')
})
test('real horizontal and diagonal wheel intent ignores small movement and suppresses momentum', async ({
  page,
}) => {
  await open(page)
  await page.mouse.move(600, 300)
  await page.mouse.wheel(35, 0)
  await page.waitForTimeout(280)
  await at(page, 'node')
  await page.mouse.wheel(210, 150)
  await page.evaluate(() =>
    window.dispatchEvent(
      new WheelEvent('wheel', {
        deltaX: 300,
        deltaY: 20,
        bubbles: true,
        cancelable: true,
      }),
    ),
  )
  await at(page, 'verify')
  await page.waitForTimeout(280)
  await at(page, 'verify')
})
test('exact command copying remains a utility and does not navigate', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  await branch(page, 'yes')
  await at(page, 'verify')
  await page
    .getByRole('button', { name: 'העתק פקודה: node -v', exact: true })
    .click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'node -v',
  )
  await at(page, 'verify')
  await page.reload()
  await settled(page)
  await at(page, 'verify')
})
