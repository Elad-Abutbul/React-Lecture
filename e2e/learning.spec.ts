import { test, expect } from '@playwright/test'
import { open, at, seedVisited, revisit, roll, branch } from './helpers'
test('live lessons, code, and answer feedback remain inside the same tree', async ({
  page,
}) => {
  await seedVisited(page, ['props'])
  await open(page)
  await revisit(page, 'ההורה שולח. הילד מציג.')
  await at(page, 'props')
  const input = page.getByRole('textbox')
  await input.fill('דנה')
  await expect(page.locator('.graph-node-active')).toContainText('דנה')
  await roll(page)
  await at(page, 'props-code')
  await roll(page)
  await at(page, 'props-check')
  await branch(page, 'answer-0')
  await at(page, 'props-check-answer-0')
  await expect(page.locator('.graph-node-active')).toContainText('ההורה')
  await roll(page)
  await at(page, 'state')
})
test('file steps and official resources have no horizontal overflow or nested scroll containers', async ({
  page,
}) => {
  await seedVisited(page, ['files', 'resources'])
  await open(page)
  await revisit(page, 'index.html')
  await at(page, 'files')
  await roll(page)
  await at(page, 'file-main')
  await expect(page.locator('.graph-node-active')).toContainText('createRoot')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  expect(await page.locator('.graph-reading').count()).toBe(1)
  await revisit(page, 'מכאן ממשיכים לבנות')
  await at(page, 'resources')
  await expect(
    page.getByRole('link', { name: 'המדריך הרשמי של React', exact: true }),
  ).toHaveAttribute('href', 'https://react.dev/learn')
})
