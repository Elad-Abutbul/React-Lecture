import { test, expect, type Page, type TestInfo } from '@playwright/test'
import { join } from 'node:path'
import { GRAPH_GESTURE } from '../src/constants/graphNavigation'
import { open, at, settled, seedVisited } from './helpers'
const errorsByPage = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  errorsByPage.set(page, errors)
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    const trace: unknown[] = []
    Reflect.set(window, 'qaWheelTrace', trace)
    window.addEventListener(
      'wheel',
      (event) =>
        trace.push({
          x: event.deltaX,
          y: event.deltaY,
          mode: event.deltaMode,
          trusted: event.isTrusted,
          at: event.timeStamp,
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      { passive: true },
    )
  })
})
test.afterEach(async ({ page }, info) => {
  await info.attach('actual-wheel-packets', {
    body: JSON.stringify(
      await page.evaluate(() => Reflect.get(window, 'qaWheelTrace')),
    ),
    contentType: 'application/json',
  })
  expect(errorsByPage.get(page)).toEqual([])
})
async function ready(page: Page) {
  await settled(page)
  await expect(
    page.locator('.graph-node-active .graph-node-content'),
  ).toHaveCSS('opacity', '1')
}
async function screenshot(page: Page, info: TestInfo, name: string) {
  const path = process.env.QA_SCREENSHOT_DIR
    ? join(process.env.QA_SCREENSHOT_DIR, `${info.project.name}-${name}.jpg`)
    : info.outputPath(`${name}.jpg`)
  await page.screenshot({ path, type: 'jpeg', quality: 90 })
  await info.attach(name, { path, contentType: 'image/jpeg' })
}
async function visit(page: Page, id: string) {
  await page.getByRole('button', { name: 'מפת העץ', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'סינון צמתים' })
    .fill(id === 'verify' ? 'בודקים את ההתקנה' : id)
  await page
    .getByRole('dialog')
    .getByRole('button', {
      name: id === 'verify' ? 'בודקים את ההתקנה ידנית' : new RegExp(`^${id} ·`),
    })
    .click()
  await at(page, id)
  await ready(page)
}
for (const [x, y, target] of [
  [650, 650, 'verify'],
  [-650, 650, 'os'],
  [300, 350, 'verify'],
  [-300, 350, 'os'],
] as const) {
  test(`QA-01 diagonal ${x}/${y} follows its horizontal sign`, async ({
    page,
  }, info) => {
    await open(page)
    await ready(page)
    const size = page.viewportSize()!
    await page.mouse.move(size.width / 2, size.height * 0.65)
    await screenshot(page, info, `diagonal-${x}-before`)
    await page.mouse.wheel(x, y)
    await at(page, target)
    await ready(page)
    await screenshot(page, info, `diagonal-${x}-after`)
    const point = await page.locator('.graph-node-active').evaluate((e) => ({
      x: parseFloat((e as HTMLElement).style.left),
      y: parseFloat((e as HTMLElement).style.top),
    }))
    expect(
      Number(await page.locator('.world-stage').getAttribute('data-camera-x')),
    ).toBe(point.x)
    expect(
      Number(await page.locator('.world-stage').getAttribute('data-camera-y')),
    ).toBe(point.y)
  })
}
test('QA-02 branch rectangles do not cover the verify reading surface', async ({
  page,
}, info) => {
  await seedVisited(page, ['verify'])
  await open(page)
  await visit(page, 'verify')
  const reader = (await page.locator('.graph-reading').boundingBox())!
  const branches = await page.locator('.graph-branch').evaluateAll((buttons) =>
    buttons.map((e) => {
      const r = e.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom }
    }),
  )
  await info.attach('reading-and-hit-rects', {
    body: JSON.stringify({ reader, branches }),
    contentType: 'application/json',
  })
  await screenshot(page, info, 'reading-hit-areas')
  for (const branch of branches)
    expect(branch.top).toBeGreaterThanOrEqual(reader.y + reader.height)
})
test('QA-02 scrolling over both sides of code reads instructions without selecting a branch', async ({
  page,
}, info) => {
  await seedVisited(page, ['verify'])
  await open(page)
  for (const side of ['right', 'left'] as const) {
    await visit(page, 'verify')
    const reader = page.locator('.graph-reading'),
      box = (await reader.boundingBox())!
    await reader.evaluate((element) => {
      element.scrollTop = 0
    })
    expect(await reader.evaluate((e) => e.scrollHeight > e.clientHeight)).toBe(
      true,
    )
    const exact = info.project.name === 'qa-report'
    await page.mouse.move(
      exact
        ? side === 'right'
          ? 1100
          : 600
        : box.x + box.width * (side === 'right' ? 0.75 : 0.25),
      exact ? 420 : box.y + box.height - 20,
    )
    await screenshot(page, info, `code-${side}-before`)
    await page.waitForTimeout(300)
    await page.mouse.wheel(0, 300)
    await screenshot(page, info, `code-${side}-after`)
    await expect(page.locator('.world-stage')).toHaveAttribute(
      'data-active-scene',
      'verify',
    )
    await expect
      .poll(() => reader.evaluate((e) => e.scrollTop))
      .toBeGreaterThan(0)
  }
})
test('QA-02 hit boundaries follow content and resize at verify, H05 and pause-2', async ({
  page,
}, info) => {
  test.setTimeout(60000)
  await seedVisited(page, ['verify', 'H05', 'pause-2'])
  await open(page)
  for (const id of ['verify', 'H05', 'pause-2']) {
    await visit(page, id)
    for (const size of [
      { width: 1789, height: 819 },
      { width: 390, height: 844 },
      { width: 1280, height: 720 },
    ]) {
      await page.setViewportSize(size)
      await ready(page)
      const box = (await page.locator('.graph-reading').boundingBox())!
      await expect
        .poll(() =>
          page
            .locator('.graph-branch')
            .evaluateAll((bs) =>
              Math.min(...bs.map((b) => b.getBoundingClientRect().top)),
            ),
        )
        .toBeGreaterThanOrEqual(box.y + box.height)
      expect(
        await page.evaluate(
          () =>
            scrollX === 0 &&
            scrollY === 0 &&
            document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true)
    }
  }
  await screenshot(page, info, 'responsive-hit-areas')
})

for (const [x, target] of [
  [120, 'verify'],
  [-120, 'os'],
] as const) {
  test(`QA-03 horizontal request ${x} gives intent or selection from actual wheel packets`, async ({
    page,
  }) => {
    await open(page)
    await ready(page)
    const brand = (await page.locator('.brand').boundingBox())!
    await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
    await page.mouse.wheel(x, 0)
    await expect
      .poll(
        () => page.evaluate(() => Reflect.get(window, 'qaWheelTrace').length),
        { intervals: [5, 10, 20, 30] },
      )
      .toBeGreaterThan(0)
    const packets = (await page.evaluate(() =>
      Reflect.get(window, 'qaWheelTrace'),
    )) as { x: number; mode: number }[]
    expect(packets.every((packet) => packet.mode === 0)).toBe(true)
    const travel = packets.reduce((sum, packet) => sum + packet.x, 0)
    expect(Math.sign(travel)).toBe(Math.sign(x))
    if (Math.abs(travel) >= GRAPH_GESTURE.branchThreshold)
      await at(page, target)
    else {
      await expect(
        page.locator(x > 0 ? '.branch-right' : '.branch-left'),
      ).toHaveAttribute('data-gesture-intent', 'true')
      await at(page, 'node')
    }
  })
}
test('QA-03 short intent is visible, expires cleanly, and five packets select only once', async ({
  page,
}, info) => {
  await open(page)
  await ready(page)
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(80, 0)
  const branch = page.locator('.branch-right')
  await expect(branch).toHaveAttribute('data-gesture-intent', 'true')
  await expect(branch.locator('.graph-intent-feedback')).toContainText('%')
  await expect(branch.locator('.graph-intent-feedback')).toHaveCSS(
    'opacity',
    '1',
  )
  await screenshot(page, info, 'short-intent-feedback')
  await expect(branch).not.toHaveAttribute('data-gesture-intent', 'true')
  await at(page, 'node')
  for (let i = 0; i < 5; i++) await page.mouse.wheel(80, 0)
  await at(page, 'verify')
  await page.waitForTimeout(300)
  await expect(page.locator('[data-gesture-intent]')).toHaveCount(0)
  await at(page, 'verify')
})

async function realisticTrace(page: Page, direction: 'right' | 'left' | 'up') {
  await page.evaluate(async (direction) => {
    const acceleration = [
      1.5, 2.5, 5, 9, 14, 20, 28, 35, 40, 36, 28, 20, 12, 8, 4, 2,
    ]
    const packets = [
      ...acceleration,
      ...Array.from({ length: 80 }, (_, i) => 18 * Math.exp(-i / 25)),
    ]
    for (let i = 0; i < packets.length; i++) {
      const amount = packets[i],
        x =
          direction === 'up'
            ? amount * 0.05
            : amount * (direction === 'right' ? 1 : -1),
        y = direction === 'up' ? -amount : amount * (i % 2 ? 1.05 : 0.95)
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: x,
          deltaY: y,
          deltaMode: 0,
          bubbles: true,
          cancelable: true,
        }),
      )
      await new Promise((resolve) => setTimeout(resolve, 12))
    }
  }, direction)
}
test('QA-01/03 realistic packet traces preserve one stop, smooth reversal and branch switching', async ({
  page,
}, info) => {
  await open(page)
  await ready(page)
  await realisticTrace(page, 'right')
  await at(page, 'verify')
  await ready(page)
  await expect(page.locator('[data-gesture-intent]')).toHaveCount(0)
  await page.waitForTimeout(300)
  await realisticTrace(page, 'up')
  await at(page, 'node')
  await ready(page)
  await page.waitForTimeout(300)
  await realisticTrace(page, 'left')
  await at(page, 'os')
  await ready(page)
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.choices.node).toBe('no')
  expect(state.route).toEqual(['node', 'os'])
  expect(state.visited).toEqual(
    expect.arrayContaining(['node', 'verify', 'os']),
  )
  await screenshot(page, info, 'realistic-trace-branch-switch')
})

test('QA-01 near-diagonal intent ignores the opposite hovered branch', async ({
  page,
}) => {
  await open(page)
  await ready(page)
  await page.locator('[data-edge-id="no"]').hover()
  await page.mouse.wheel(300, 350)
  await at(page, 'verify')
  await ready(page)
  await page.keyboard.press('ArrowUp')
  await at(page, 'node')
  await ready(page)
  await page.locator('[data-edge-id="yes"]').hover()
  await page.mouse.wheel(-300, 350)
  await at(page, 'os')
})

test('QA-03 controlled short packets accumulate across 350ms pauses and commit once', async ({
  page,
}, info) => {
  await open(page)
  await ready(page)
  await page.evaluate(async () => {
    for (let i = 0; i < 3; i++) {
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 40,
          deltaY: 0,
          deltaMode: 0,
          bubbles: true,
          cancelable: true,
        }),
      )
      if (i < 2) await new Promise((resolve) => setTimeout(resolve, 350))
    }
  })
  await at(page, 'verify')
  await page.waitForTimeout(300)
  await at(page, 'verify')
  await screenshot(page, info, 'paused-intent-committed-once')
})
