import { join } from 'node:path'
import { test, expect, type Page, type TestInfo } from '@playwright/test'
import { open, branch, travelTo, at } from './helpers'
async function screenshot(page: Page, info: TestInfo, name: string) {
  const path = process.env.NAV_FIX_SCREENSHOT_DIR
    ? join(
        process.env.NAV_FIX_SCREENSHOT_DIR,
        `${info.project.name}-${name}.jpg`,
      )
    : info.outputPath(`${name}.jpg`)
  await page.screenshot({ path, type: 'jpeg', quality: 90 })
  await info.attach(name, { path, contentType: 'image/jpeg' })
}
async function snapshot(page: Page) {
  return page.locator('.graph-node-active').evaluate((e) => {
    const title = e.querySelector('h1')!,
      rect = title.getBoundingClientRect()
    return {
      title: title.textContent,
      size: getComputedStyle(title).fontSize,
      width: rect.width,
      height: rect.height,
    }
  })
}
async function fullDecision(
  page: Page,
  id: string,
  before: Awaited<ReturnType<typeof snapshot>>,
) {
  await at(page, id)
  await expect
    .poll(async () => {
      const current = await snapshot(page)
      return {
        title: current.title,
        size: current.size,
        sameWidth: Math.abs(current.width - before.width) < 0.1,
        sameHeight: Math.abs(current.height - before.height) < 0.1,
      }
    })
    .toEqual({
      title: before.title,
      size: before.size,
      sameWidth: true,
      sameHeight: true,
    })
  await expect(page.locator('.graph-branches')).toHaveCSS('opacity', '1')
  await expect(page.locator('.graph-branch')).toHaveCount(2)
  await expect(page.locator('.graph-branch').first()).toBeEnabled()
  await expect(page.locator('.graph-branch').last()).toBeEnabled()
  expect(
    await page.locator('.graph-node-active').getAttribute('class'),
  ).not.toContain('distant')
  expect(await page.locator('.graph-node-active .graph-ghost').count()).toBe(0)
}
test('YES, several nodes, backward to the original full question, then NO preserves the archive', async ({
  page,
}, info) => {
  await open(page)
  const original = await snapshot(page),
    question = await page.locator('[data-world-node="node"] h1').elementHandle()
  await branch(page, 'yes')
  await branch(page, 'done')
  await branch(page, 'existing')
  await travelTo(page, 'node', -1)
  await fullDecision(page, 'node', original)
  await screenshot(page, info, 'revisited-node')
  expect(await question!.evaluate((e) => e.isConnected)).toBe(true)
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(300)
  expect(
    Number(
      await page.locator('.world-stage').getAttribute('data-camera-distance'),
    ),
  ).toBe(0)
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.pendingChoices).toContain('node')
  await page.mouse.wheel(-350, 350)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('react-world-navigation')!).state
            .choices.node,
      ),
    )
    .toBe('no')
  await travelTo(page, 'os')
  const after = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(after.route).toEqual(['node', 'os'])
  expect(after.visited).toEqual(
    expect.arrayContaining(['verify', 'project', 'existing']),
  )
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '100',
  )
})
test('project and operating-system decisions restore their original framing and allow the other branch', async ({
  page,
}, info) => {
  await open(page)
  await branch(page, 'no')
  const os = await snapshot(page)
  await branch(page, 'mac')
  await travelTo(page, 'verify')
  await branch(page, 'done')
  const project = await snapshot(page)
  await branch(page, 'existing')
  await travelTo(page, 'project', -1)
  await fullDecision(page, 'project', project)
  await screenshot(page, info, 'revisited-project')
  await page.locator('[data-edge-id="new"]').click()
  await travelTo(page, 'create')
  await travelTo(page, 'os', -1)
  await fullDecision(page, 'os', os)
  await screenshot(page, info, 'revisited-os')
  await page.locator('[data-edge-id="windows"]').click()
  await travelTo(page, 'windows')
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.choices.os).toBe('windows')
  expect(state.visited).toEqual(
    expect.arrayContaining(['mac', 'existing', 'create']),
  )
  expect(
    await page.evaluate(
      () =>
        scrollX === 0 &&
        scrollY === 0 &&
        document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('returning to a long decision restores its heading instead of retaining a clipped reading offset', async ({
  page,
}, info) => {
  await open(page)
  await branch(page, 'yes')
  const reading = page.locator('[data-world-node="verify"] .graph-reading')
  const box = (await reading.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.wheel(0, 650)
  await expect
    .poll(() => reading.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0)
  await page.locator('[data-edge-id="done"]').click()
  await travelTo(page, 'project')
  await travelTo(page, 'verify', -1)
  await expect.poll(() => reading.evaluate((e) => e.scrollTop)).toBe(0)
  expect(
    await reading.evaluate(
      (e) =>
        e.querySelector('h1')!.getBoundingClientRect().top >=
        e.getBoundingClientRect().top,
    ),
  ).toBe(true)
  await expect(page.locator('.graph-branch')).toHaveCount(2)
  await screenshot(page, info, 'revisited-long-decision')
  await page.locator('[data-edge-id="error"]').click()
  await travelTo(page, 'verify-help-0')
})
