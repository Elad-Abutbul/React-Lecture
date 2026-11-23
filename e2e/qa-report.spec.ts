import { test, expect, type Page, type TestInfo } from '@playwright/test'
import { join } from 'node:path'
import { open, at, settled, seedVisited } from './helpers'
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
