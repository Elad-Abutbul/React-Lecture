import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { join } from 'node:path'
import {
  open,
  at,
  branch,
  advance,
  seedVisited,
  revisit,
  settled,
  roll,
  travelTo,
} from './helpers'
async function audit(page: Parameters<typeof open>[0]) {
  await expect(
    page.locator('.graph-node-active .graph-node-content'),
  ).toHaveCSS('opacity', '1')
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([])
}
test('accessible root, reading surface, functional controls and optional map', async ({
  page,
}) => {
  await seedVisited(page, ['H08'])
  await open(page)
  await audit(page)
  await revisit(page, 'H08 · Events ורשימת משימות')
  await at(page, 'H08')
  await page.getByRole('button', { name: 'לוח משימות חי', exact: true }).click()
  await audit(page)
  await page.getByRole('button', { name: 'מפת העץ', exact: true }).click()
  await expect(page.locator('#tree-map-trigger')).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('button', { name: 'מפת העץ', exact: true }),
  ).toBeFocused()
})
test('camera targets and persistent world-space paths remain aligned after resizing', async ({
  page,
}, info) => {
  await seedVisited(page, ['existing'])
  await open(page)
  await revisit(page, 'פותחים את הפרויקט הקיים')
  await at(page, 'existing')
  await expect(page.locator('.graph-node-active .graph-reading')).toBeFocused()
  const camera = await page.locator('.world-stage').evaluate((element) => ({
    x: Number(element.getAttribute('data-camera-x')),
    y: Number(element.getAttribute('data-camera-y')),
  }))
  const point = await page
    .locator('.graph-node-active')
    .evaluate((element) => ({
      x: parseFloat((element as HTMLElement).style.left),
      y: parseFloat((element as HTMLElement).style.top),
    }))
  expect(camera).toEqual(point)
  const endpoints = await page
    .locator('path[data-source]')
    .evaluateAll((paths) =>
      paths.every((path) => {
        const element = path as SVGPathElement,
          target = document.querySelector<HTMLElement>(
            `[data-world-node="${element.dataset.target}"]`,
          )!,
          end = element.getPointAtLength(element.getTotalLength())
        return (
          Math.abs(end.x - parseFloat(target.style.left)) < 0.1 &&
          Math.abs(end.y - parseFloat(target.style.top)) < 0.1
        )
      }),
    )
  expect(endpoints).toBe(true)
  await page.setViewportSize(
    info.project.name === 'mobile'
      ? { width: 320, height: 740 }
      : { width: 1024, height: 768 },
  )
  await page.waitForTimeout(100)
  await settled(page)
  const box = (await page
      .locator('.graph-node-active .graph-reading')
      .boundingBox())!,
    viewport = page.viewportSize()!
  expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(2)
  expect(box.y).toBeGreaterThan(80)
  expect(box.y + box.height).toBeLessThan(viewport.height - 80)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})
test('macOS and an existing project use scroll-only instructions and outcome branches', async ({
  page,
}) => {
  test.setTimeout(60000)
  await open(page)
  await branch(page, 'no')
  await at(page, 'os')
  await branch(page, 'mac')
  await at(page, 'mac')
  await advance(page, 'verify')
  await branch(page, 'done')
  await at(page, 'project')
  await branch(page, 'existing')
  await at(page, 'existing')
  await advance(page, 'scripts')
  await expect(
    page.locator('.graph-node-active [data-command="SCRIPTS"] code'),
  ).toHaveText('npm run')
  await advance(page, 'scripts-result')
  await branch(page, 'done')
  await at(page, 'existing-run')
  await advance(page, 'existing-run-result')
  await branch(page, 'done')
  await at(page, 'browser')
})
test('quiz choices are branches, explanatory feedback merges back, and reset remains non-modal', async ({
  page,
}) => {
  await seedVisited(page, ['quiz'])
  await open(page)
  await revisit(page, 'לאיזה כיוון עוברים Props?')
  await at(page, 'quiz')
  await branch(page, 'answer-1')
  await at(page, 'quiz-answer-1')
  await expect(page.locator('.graph-node-active')).toContainText('ההורה')
  await advance(page, 'quiz-snapshot')
  await page.getByRole('button', { name: 'איפוס הביקורים המקומיים' }).click()
  await at(page, 'node')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
test('desktop and mobile cinematic stops remain readable with visible branch connections', async ({
  page,
}, info) => {
  await open(page)
  await expect(page.locator('.graph-node-active .focus-title')).toHaveCSS(
    'opacity',
    '1',
  )
  await expect(page.locator('.graph-node-active .focus-description')).toHaveCSS(
    'opacity',
    '1',
  )
  const title = (await page.getByRole('heading', { level: 1 }).boundingBox())!,
    size = page.viewportSize()!
  expect(title.y).toBeGreaterThan(100)
  expect(title.y + title.height).toBeLessThan(size.height * 0.65)
  await expect(page.locator('.branch-line').first()).toHaveAttribute(
    'fill',
    'none',
  )
  if (process.env.SCREENSHOT_DIR && info.project.name !== 'reduced-motion')
    await page.screenshot({
      path: join(
        process.env.SCREENSHOT_DIR,
        `react-tree-${info.project.name}.jpg`,
      ),
      type: 'jpeg',
      quality: 90,
    })
  await branch(page, 'yes')
  await at(page, 'verify')
  await expect(page.locator('.graph-node-active .graph-reading')).toBeFocused()
  const frame = (await page
    .locator('.graph-node-active .graph-reading')
    .boundingBox())!
  expect(frame.y).toBeGreaterThan(100)
  await roll(page, -1)
  await at(page, 'node')
  await page.mouse.click(size.width * 0.12, size.height * 0.7)
  await travelTo(page, 'os')
  await at(page, 'os')
})
