import { test, expect } from '@playwright/test'
import { join } from 'node:path'
import { open, at } from './helpers'
// Enable the existing 3D scene on a software-backed WebGL context for this test.
// This checks real Canvas initialization and rendering, not physical GPU performance.
test('OBS-01 fresh 3D initialization renders continuing frames without a deprecated Clock warning', async ({
  page,
}, info) => {
  test.setTimeout(45000)
  const errors: string[] = [],
    clockWarnings: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
    if (message.text().includes('THREE.Clock'))
      clockWarnings.push(message.text())
  })
  await page.addInitScript(() => {
    let draws = 0
    Object.defineProperty(window, 'qaDrawCalls', { get: () => draws })
    for (const type of [
      typeof WebGLRenderingContext === 'undefined'
        ? null
        : WebGLRenderingContext,
      typeof WebGL2RenderingContext === 'undefined'
        ? null
        : WebGL2RenderingContext,
    ]) {
      if (!type) continue
      const parameter = type.prototype.getParameter,
        arrays = type.prototype.drawArrays,
        elements = type.prototype.drawElements
      type.prototype.getParameter = function (key: number) {
        return key === 37446 ? 'QA-renderer' : parameter.call(this, key)
      }
      type.prototype.drawArrays = function (
        mode: number,
        first: number,
        count: number,
      ) {
        draws++
        return arrays.call(this, mode, first, count)
      }
      type.prototype.drawElements = function (
        mode: number,
        count: number,
        value: number,
        offset: number,
      ) {
        draws++
        return elements.call(this, mode, count, value, offset)
      }
    }
  })
  await open(page)
  await expect(page.locator('.atmosphere-atom canvas')).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'qaDrawCalls')))
    .toBeGreaterThan(0)
  const before = (await page.evaluate(() =>
    Reflect.get(window, 'qaDrawCalls'),
  )) as number
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'qaDrawCalls')))
    .toBeGreaterThan(before)
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(650, 650)
  await at(page, 'verify')
  await page.waitForTimeout(300)
  await page.mouse.wheel(0, -650)
  await at(page, 'node')
  expect(clockWarnings).toEqual([])
  expect(errors).toEqual([])
  if (process.env.QA_SCREENSHOT_DIR)
    await page.screenshot({
      path: join(
        process.env.QA_SCREENSHOT_DIR,
        `${info.project.name}-timer-backed-3d.jpg`,
      ),
      type: 'jpeg',
      quality: 90,
    })
})
