import { test, expect, type Page } from '@playwright/test'
import { open, at, travelTo, seedVisited, revisit } from './helpers'
import { GRAPH_MOTION as C } from '../src/constants/graphMotion'
const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const list: string[] = []
  errors.set(page, list)
  page.on('pageerror', (e) => list.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') list.push(m.text())
  })
})
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([])
})
async function camera(page: Page) {
  return page.locator('.world-stage').evaluate((e) => {
    const d = (e as HTMLElement).dataset
    return {
      x: Number(d.cameraX),
      y: Number(d.cameraY),
      distance: Number(d.cameraDistance),
      target: Number(d.cameraTarget),
      snap: d.cameraSnap,
      moving: d.cameraMoving,
    }
  })
}
async function wheel(page: Page, x: number, y: number) {
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(x, y)
  await page.waitForTimeout(40)
}
async function choose(page: Page, sign = 1) {
  await wheel(page, sign * 300, 0)
  await expect(
    page.locator(
      `.world-path[data-source="node"][data-target="${sign > 0 ? 'verify' : 'os'}"] + path`,
    ),
  ).toHaveCount(1)
}
for (const [x, y, edge] of [
  [300, 0, 'yes'],
  [-300, 0, 'no'],
  [650, 650, 'yes'],
  [-650, 650, 'no'],
  [300, 350, 'yes'],
  [-300, 350, 'no'],
] as const) {
  test(`signed ${x}/${y} chooses ${edge} in RTL without automatic travel`, async ({
    page,
  }) => {
    await open(page)
    const before = await camera(page)
    await wheel(page, x, y)
    await page.waitForTimeout(1000)
    const state = await page.evaluate(
      () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
    )
    expect(state.choices.node).toBe(edge)
    expect((await camera(page)).distance).toBe(before.distance)
    await at(page, 'node')
    expect(await page.locator('html').getAttribute('dir')).toBe('rtl')
  })
}
for (const pixels of [40, 80, 300]) {
  test(`input ${pixels} moves proportionally between nodes instead of completing a flight`, async ({
    page,
  }) => {
    await open(page)
    await choose(page)
    await page.evaluate(() => {
      const started = performance.now()
      Reflect.set(window, 'peakCameraDistance', 0)
      function sample() {
        const distance = Number(
          (document.querySelector('.world-stage') as HTMLElement).dataset
            .cameraDistance,
        )
        Reflect.set(
          window,
          'peakCameraDistance',
          Math.max(Reflect.get(window, 'peakCameraDistance'), distance),
        )
        if (performance.now() - started < 1500) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    await wheel(page, 0, pixels)
    await expect
      .poll(() =>
        page.evaluate(() => Reflect.get(window, 'peakCameraDistance')),
      )
      .toBeGreaterThan(0)
    const peak = (await page.evaluate(() =>
      Reflect.get(window, 'peakCameraDistance'),
    )) as number
    expect(peak).toBeLessThanOrEqual(pixels * C.pixelsPerWheelUnit + 0.01)
    if (pixels * C.pixelsPerWheelUnit > C.snapRadius)
      await expect
        .poll(async () => (await camera(page)).target)
        .toBeCloseTo(pixels * C.pixelsPerWheelUnit, 2)
    expect((await camera(page)).distance).toBeLessThan(1000)
    await at(page, 'node')
  })
}
test('fractional input accumulates into either physical branch, then its remaining packets move continuously', async ({
  page,
}) => {
  await open(page)
  await page.evaluate(async () => {
    for (let i = 0; i < 160; i++) {
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 1.5,
          bubbles: true,
          cancelable: true,
        }),
      )
      await new Promise((r) => setTimeout(r, 4))
    }
  })
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.choices.node).toBe('yes')
  const c = await camera(page)
  expect(c.target).toBeGreaterThan(0)
  expect(c.target).toBeLessThan(300)
})
test('camera moves diagonally on the same persistent SVG curve and reverses immediately between nodes', async ({
  page,
}) => {
  await open(page)
  await choose(page)
  const path = page.locator(
    '.world-path[data-source="node"][data-target="verify"]',
  )
  await path.evaluate((e) => e.setAttribute('data-identity', 'continuous'))
  const start = await camera(page)
  await wheel(page, 0, 420)
  await page.waitForTimeout(100)
  await expect
    .poll(async () => {
      const c = await camera(page)
      return Math.abs(c.distance - c.target)
    })
    .toBeLessThan(0.1)
  const forward = await camera(page)
  expect(forward.x).toBeGreaterThan(start.x)
  expect(forward.y).toBeGreaterThan(start.y)
  expect(forward.distance).toBeGreaterThan(0)
  await wheel(page, 0, -12)
  await expect
    .poll(async () => (await camera(page)).distance)
    .toBeLessThan(forward.distance)
  expect((await camera(page)).distance).toBeGreaterThan(0)
  await expect(path).toHaveAttribute('data-identity', 'continuous')
  const beforeResize = await camera(page)
  await page.setViewportSize({ width: 1000, height: 740 })
  await page.waitForTimeout(100)
  expect(
    Math.abs((await camera(page)).distance - beforeResize.target),
  ).toBeLessThan(20)
  expect(
    await page.evaluate(
      () =>
        scrollX === 0 &&
        scrollY === 0 &&
        document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
test('momentum keeps moving proportionally without selecting another branch or jumping nodes', async ({
  page,
}) => {
  await open(page)
  await choose(page)
  await page.evaluate(async () => {
    for (const deltaY of [2, 6, 14, 28, 40, 32, 20, 10, 4, 1]) {
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }),
      )
      await new Promise((r) => setTimeout(r, 16))
    }
  })
  await expect
    .poll(async () => (await camera(page)).target)
    .toBeCloseTo(157 * C.pixelsPerWheelUnit)
  await page.waitForTimeout(800)
  expect((await camera(page)).distance).toBeCloseTo(
    157 * C.pixelsPerWheelUnit,
    1,
  )
  await at(page, 'node')
})
test('magnet settles only near a node and new input releases it immediately', async ({
  page,
}) => {
  await open(page)
  await choose(page)
  await wheel(page, 0, 350)
  await page.waitForTimeout(1200)
  const middle = await camera(page)
  expect(middle.snap).toBe('false')
  expect(middle.distance).toBeCloseTo(350 * C.pixelsPerWheelUnit, 1)
  await travelTo(page, 'verify')
  const arrived = await camera(page)
  expect(arrived.snap).toBe('true')
  // Read the current node to the top, then make a small reverse gesture outside it.
  await wheel(page, 0, -60)
  await expect
    .poll(async () => (await camera(page)).distance)
    .toBeLessThan(arrived.distance)
  expect((await camera(page)).distance).toBeGreaterThan(arrived.distance - 120)
})
test('proximity text effects remain responsive and reverse without replay or flickering', async ({
  page,
}, info) => {
  await open(page)
  await choose(page)
  const reader = page.locator('[data-world-node="node"] .graph-reading')
  const initial = await reader.elementHandle()
  await wheel(page, 0, 300)
  await page.waitForTimeout(150)
  const before = await reader.evaluate((e) => ({
    opacity: Number(getComputedStyle(e).opacity),
    blur: getComputedStyle(e).filter,
  }))
  if (info.project.name !== 'reduced-motion')
    expect(before.opacity).toBeLessThan(1)
  const position = (await camera(page)).distance
  await wheel(page, 0, -50)
  await expect
    .poll(async () => (await camera(page)).distance)
    .toBeLessThan(position)
  await page.waitForTimeout(250)
  const after = await reader.evaluate((e) => ({
    opacity: Number(getComputedStyle(e).opacity),
    animation: getComputedStyle(e.querySelector('h1')!).animationName,
  }))
  expect(after.opacity).toBeGreaterThanOrEqual(before.opacity)
  expect(after.animation).toBe('none')
  expect(await initial!.evaluate((e) => e.isConnected)).toBe(true)
  expect(await reader.evaluate((e) => getComputedStyle(e).opacity)).not.toBe(
    '0',
  )
})
test('returning to a decision permits changing branches while preserving visited history', async ({
  page,
}) => {
  await open(page)
  await choose(page)
  await travelTo(page, 'verify')
  await travelTo(page, 'node', -1)
  await wheel(page, -300, 350)
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.route).toEqual(['node', 'os'])
  expect(state.visited).toContain('verify')
  expect((await camera(page)).distance).toBe(0)
  await travelTo(page, 'os')
})
test('keyboard, branch click and touch select a path without a flight, and further input moves it', async ({
  page,
}) => {
  await open(page)
  await page.keyboard.press('ArrowRight')
  expect((await camera(page)).distance).toBe(0)
  await page.keyboard.press('ArrowDown')
  await expect
    .poll(async () => (await camera(page)).distance)
    .toBeGreaterThan(0)
  await travelTo(page, 'node', -1)
  await page.locator('[data-edge-id="no"]').click()
  expect((await camera(page)).distance).toBe(0)
  await page.dispatchEvent('main', 'touchstart', {
    touches: [{ identifier: 1, clientX: 200, clientY: 400 }],
  })
  await page.dispatchEvent('main', 'touchmove', {
    touches: [{ identifier: 1, clientX: 200, clientY: 340 }],
  })
  await page.dispatchEvent('main', 'touchend', { touches: [] })
  await expect
    .poll(async () => (await camera(page)).distance)
    .toBeGreaterThan(0)
})
test('long content reads before departure and cannot be covered by branch hit regions', async ({
  page,
}) => {
  await seedVisited(page, ['verify'])
  await open(page)
  await revisit(page, 'בודקים את ההתקנה ידנית')
  const reading = page.locator('.graph-node-active .graph-reading'),
    before = await camera(page)
  const box = (await reading.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height - 15)
  await page.mouse.wheel(0, 300)
  await expect
    .poll(() => reading.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0)
  expect((await camera(page)).distance).toBe(before.distance)
  await at(page, 'verify')
})
