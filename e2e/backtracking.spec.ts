import { test, expect } from '@playwright/test'
import {
  open,
  at,
  branch,
  roll,
  settled,
  seedVisited,
  revisit,
  travelTo,
} from './helpers'
test('backtracking reverses the camera and progress, and branch changes retain the visited archive', async ({
  page,
}) => {
  const alerts: string[] = []
  page.on('dialog', (d) => {
    alerts.push(d.type())
    void d.dismiss()
  })
  await open(page)
  const originalX = Number(
    await page.locator('.world-stage').getAttribute('data-camera-x'),
  )
  await branch(page, 'yes')
  await at(page, 'verify')
  expect(
    Number(await page.locator('.world-stage').getAttribute('data-camera-x')),
  ).toBeGreaterThan(originalX)
  await roll(page, -1)
  await at(page, 'node')
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  )
  await branch(page, 'no')
  await at(page, 'os')
  expect(
    Number(await page.locator('.world-stage').getAttribute('data-camera-x')),
  ).toBeLessThan(originalX)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('.world-trail')).not.toContainText(
    'בודקים את ההתקנה',
  )
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.route).toEqual(['node', 'os'])
  expect(state.visited).toContain('verify')
  expect(alerts).toEqual([])
})
test('single-path nodes advance and return by native scrolling without changing decisions', async ({
  page,
}) => {
  await open(page)
  await branch(page, 'no')
  await at(page, 'os')
  await branch(page, 'mac')
  await at(page, 'mac')
  await roll(page)
  await travelTo(page, 'verify')
  await at(page, 'verify')
  await roll(page, -1)
  await at(page, 'mac')
  await page.reload()
  await settled(page)
  await at(page, 'mac')
})
test('a rapid wheel stream follows the configured path without creating a choice beyond its endpoint', async ({
  page,
}) => {
  await seedVisited(page, ['existing'])
  await open(page)
  await revisit(page, 'פותחים את הפרויקט הקיים')
  await page.evaluate(async () => {
    for (let i = 0; i < 12; i++) {
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaY: 80,
          bubbles: true,
          cancelable: true,
        }),
      )
      await new Promise((r) => setTimeout(r, 16))
    }
  })
  const distance = Number(
    await page.locator('.world-stage').getAttribute('data-camera-distance'),
  )
  await page.waitForTimeout(150)
  expect(
    Number(
      await page.locator('.world-stage').getAttribute('data-camera-distance'),
    ),
  ).toBeGreaterThanOrEqual(distance)
  await travelTo(page, 'scripts')
  await roll(page, -1)
  await at(page, 'existing')
})
test('touch swipe and keyboard alternatives use the same graph', async ({
  page,
}, info) => {
  await open(page)
  if (info.project.name === 'mobile') {
    await page.dispatchEvent('main', 'touchstart', {
      touches: [{ identifier: 1, clientX: 320, clientY: 400 }],
    })
    await page.dispatchEvent('main', 'touchmove', {
      touches: [{ identifier: 1, clientX: 90, clientY: 420 }],
    })
    await page.dispatchEvent('main', 'touchend', { touches: [] })
  } else await page.keyboard.press('ArrowRight')
  await travelTo(page, 'verify')
  await at(page, 'verify')
  await roll(page, -1)
  await at(page, 'node')
  await page.getByRole('button', { name: /^לא · התקנת Node.js/ }).focus()
  await page.keyboard.press('Enter')
  await travelTo(page, 'os')
  await at(page, 'os')
})
test('troubleshooting reconnects to the exact failed command through a continuous path', async ({
  page,
}) => {
  await open(page)
  await branch(page, 'yes')
  await at(page, 'verify')
  await branch(page, 'error')
  await at(page, 'verify-help-0')
  await roll(page)
  await at(page, 'verify-help-1')
  await roll(page)
  await at(page, 'verify')
  await expect(
    page.locator('.graph-node-active [data-command="NODE_VERSION"] code'),
  ).toHaveText('node -v')
})
