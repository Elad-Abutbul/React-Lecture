import { test, expect, type Page } from '@playwright/test'
import { open, travelTo } from './helpers'
import { GRAPH_MOTION as C } from '../src/constants/graphMotion'
async function position(page: Page) {
  return Number(
    await page.locator('.world-stage').getAttribute('data-camera-distance'),
  )
}
async function packet(page: Page, x: number, y: number) {
  await page.evaluate(
    ({ x, y }) =>
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: x,
          deltaY: y,
          bubbles: true,
          cancelable: true,
        }),
      ),
    { x, y },
  )
}
test('small incidental movement holds the node; deliberate scrolling releases it immediately', async ({
  page,
}) => {
  await open(page)
  await page.locator('[data-edge-id="yes"]').click()
  for (let i = 0; i < 15; i++) await packet(page, 0, i % 2 ? -2 : 2)
  await packet(page, 0, 10)
  await page.waitForTimeout(200)
  expect(await position(page)).toBe(0)
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-snap',
    'true',
  )
  await packet(page, 0, 100)
  await expect.poll(() => position(page)).toBeGreaterThan(0)
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-snap',
    'false',
  )
  expect(await position(page)).toBeLessThan(200)
})
test('capture from either direction centers content and stays stable while reading', async ({
  page,
}) => {
  await open(page)
  await page.locator('[data-edge-id="yes"]').click()
  await packet(page, 0, 400)
  await page.waitForTimeout(400)
  const middle = await position(page)
  expect(middle).toBeGreaterThan(C.snapExitRadius)
  await packet(page, 0, -270)
  await expect.poll(() => position(page)).toBe(0)
  // Revisited decisions require a fresh choice; they never auto-follow history.
  await page.locator('[data-edge-id="yes"]').click()
  await packet(page, 0, 400)
  await page.waitForTimeout(400)
  const before = await position(page)
  await packet(page, 0, -3)
  await expect.poll(() => position(page)).toBeLessThan(before)
  expect(await position(page)).toBeGreaterThan(0)
  await travelTo(page, 'verify')
  const stop = await position(page)
  await packet(page, 0, 60)
  await page.waitForTimeout(250)
  expect(await position(page)).toBe(stop)
  await expect
    .poll(() =>
      page
        .locator('.graph-node-active .graph-reading')
        .evaluate((e) => e.scrollTop),
    )
    .toBeGreaterThan(0)
})
test('a branch can be selected away from the exact center without a camera jump', async ({
  page,
}) => {
  await open(page)
  await page.locator('[data-edge-id="yes"]').click()
  await packet(page, 0, 100)
  await page.waitForTimeout(500)
  const before = await page.locator('.world-stage').evaluate((e) => ({
    x: Number((e as HTMLElement).dataset.cameraX),
    y: Number((e as HTMLElement).dataset.cameraY),
  }))
  expect(await position(page)).toBeGreaterThan(100)
  await page.locator('[data-edge-id="no"]').click()
  const after = await page.locator('.world-stage').evaluate((e) => ({
    x: Number((e as HTMLElement).dataset.cameraX),
    y: Number((e as HTMLElement).dataset.cameraY),
  }))
  expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(45)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('react-world-navigation')!).state
            .choices.node,
      ),
    )
    .toBe('no')
  await expect.poll(() => position(page)).toBe(0)
  await expect(page.locator('.graph-node-active .focus-title')).toHaveText(
    'יש לך Node.js מותקן?',
  )
  const pending = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem('react-world-navigation')!).state
        .pendingChoices,
  )
  expect(pending).not.toContain('node')
  await packet(page, 0, 100)
  await expect.poll(() => position(page)).toBeGreaterThan(0)
})

test('keyboard selection keeps deliberate arrow movement available from the focused branch', async ({
  page,
}) => {
  await open(page)
  await page.locator('[data-edge-id="yes"]').focus()
  await page.keyboard.press('Enter')
  expect(await position(page)).toBe(0)
  await page.keyboard.press('ArrowDown')
  await expect.poll(() => position(page)).toBeGreaterThan(0)
  expect(await page.evaluate(() => scrollX === 0 && scrollY === 0)).toBe(true)
})
