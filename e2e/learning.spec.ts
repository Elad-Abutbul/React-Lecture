import { test, expect, type Page } from '@playwright/test'
async function scene(page: Page, title: string) {
  await page.getByRole('button', { name: 'מפת המסע', exact: true }).click()
  await page.getByRole('tab', { name: 'לומדים React', exact: true }).click()
  await page.getByRole('button', { name: title, exact: true }).click()
  await expect(
    page.getByRole('heading', { name: title, exact: true }),
  ).toBeVisible()
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-busy',
    'false',
  )
}
test('learning scenes retain live props, file exploration, and explanatory quiz feedback', async ({
  page,
}) => {
  await page.goto('/')
  await scene(page, 'ההורה שולח. הילד מציג.')
  await page.getByLabel('השם שההורה שולח').fill('נועה')
  await expect(page.getByRole('heading', { name: 'שלום, נועה' })).toBeVisible()
  await scene(page, 'מפת הקבצים')
  await page.getByRole('tab', { name: 'src/main.tsx', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'מחברים את React לדף' }),
  ).toBeVisible()
  await scene(page, 'מחברים את הרעיונות')
  await page.getByRole('button', { name: 'מילד להורה', exact: true }).click()
  await expect(page.getByRole('article').getByRole('status')).toContainText(
    'עוד ניסיון?',
  )
  await page.getByRole('button', { name: 'מהורה לילד', exact: true }).click()
  await expect(page.getByRole('article').getByRole('status')).toContainText(
    'בדיוק.',
  )
})
test('official sources are reachable and the world has no horizontal overflow', async ({
  page,
}) => {
  await page.goto('/')
  await scene(page, 'מכאן ממשיכים לבנות')
  await expect(
    page.getByRole('link', { name: 'המדריך הרשמי של React', exact: true }),
  ).toHaveAttribute('href', 'https://react.dev/learn')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
