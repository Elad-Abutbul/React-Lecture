import { test, expect } from '@playwright/test'
import { join } from 'node:path'
import { open, travelTo } from './helpers'
test('continuous approach, reverse and magnetic arrival preserve readable content and connected paths', async ({
  page,
}, info) => {
  const shot = async (name: string) => {
    const path = process.env.CM_SCREENSHOT_DIR
      ? join(process.env.CM_SCREENSHOT_DIR, `${info.project.name}-${name}.jpg`)
      : info.outputPath(`${name}.jpg`)
    await page.screenshot({ path, type: 'jpeg', quality: 90 })
    await info.attach(name, { path, contentType: 'image/jpeg' })
  }
  await open(page)
  await page.locator('[data-edge-id="yes"]').click()
  await shot('before')
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(0, 270)
  await page.waitForTimeout(650)
  const before = Number(
    await page.locator('.world-stage').getAttribute('data-camera-distance'),
  )
  expect(before).toBeGreaterThan(0)
  expect(before).toBeLessThan(1000)
  await shot('approach')
  await page.mouse.wheel(0, -80)
  await page.waitForTimeout(400)
  expect(
    Number(
      await page.locator('.world-stage').getAttribute('data-camera-distance'),
    ),
  ).toBeLessThan(before)
  await shot('reverse')
  await travelTo(page, 'verify')
  const reader = page.locator('.graph-node-active .graph-reading')
  await expect(reader).toHaveCSS('opacity', '1')
  await expect(reader).toHaveCSS(
    'filter',
    info.project.name === 'reduced-motion' ? 'none' : 'blur(0px)',
  )
  await expect(
    page.locator('path[data-source="node"][data-target="verify"]'),
  ).toBeVisible()
  await shot('arrived')
  expect(
    await page.evaluate(
      () =>
        scrollX === 0 &&
        scrollY === 0 &&
        document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
