import { expect, type Page } from '@playwright/test'
export async function settled(page: Page) {
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-busy',
    'false',
  )
}
export async function at(page: Page, id: string) {
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-active-scene',
    id,
  )
  await settled(page)
}
export async function open(page: Page) {
  await page.goto('/')
  await at(page, 'node')
}
export async function branch(page: Page, id: string) {
  const area = page.locator(`[data-edge-id="${id}"]`),
    box = (await area.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.7)
  await page.waitForTimeout(270) // A separate, deliberate wheel gesture after momentum has stopped.
  await page.mouse.wheel(0, 220)
  await settled(page)
}
export async function roll(page: Page, direction = 1) {
  const size = page.viewportSize()!
  await page.mouse.move(size.width / 2, size.height * 0.3)
  await page.waitForTimeout(270)
  await page.mouse.wheel(0, direction * 1100)
}
export async function seedVisited(page: Page, ids: string[]) {
  await page.addInitScript((visited) => {
    localStorage.setItem(
      'react-world-navigation',
      JSON.stringify({
        version: 1,
        state: {
          route: ['node'],
          cursor: 0,
          choices: {},
          visited: ['node', ...visited],
        },
      }),
    )
  }, ids)
}
export async function revisit(page: Page, idTitle: string) {
  await page.getByRole('button', { name: 'מפת העץ', exact: true }).click()
  await page
    .getByRole('dialog')
    .getByRole('textbox', { name: 'סינון צמתים' })
    .fill(idTitle)
  await page
    .getByRole('dialog')
    .getByRole('button', { name: idTitle, exact: true })
    .click()
  await settled(page)
}
