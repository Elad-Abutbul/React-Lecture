import { expect, type Page } from '@playwright/test'
import { GRAPH_MOTION as C } from '../src/constants/graphMotion'
export async function settled(page: Page) {
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-camera-busy',
    'false',
  )
  await expect
    .poll(() =>
      page.locator('.world-stage').evaluate((e) => {
        const d = (e as HTMLElement).dataset
        return d.cameraScene === d.activeScene
      }),
    )
    .toBe(true)
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
  await at(page, 'home')
  // Exercise the preserved reference subgraph through the public map.
  await revisit(page, 'יש לך Node.js מותקן?')
  await at(page, 'node')
  // This is a public map arrival now; visual comparisons need a settled baseline.
  await expect(page.locator('.graph-node-active .graph-reading')).toHaveCSS(
    'opacity',
    '1',
  )
}
export async function travelTo(page: Page, id: string, direction = 1) {
  await expect
    .poll(() =>
      page
        .locator('.world-stage')
        .evaluate(
          (e, id) =>
            JSON.parse((e as HTMLElement).dataset.route ?? '[]').includes(id),
          id,
        ),
    )
    .toBe(true)
  // Explicit input driver for content regression tests. at() remains assertion-only.
  for (let attempt = 0; attempt < 35; attempt++) {
    const meta = (await page.locator('.world-stage').evaluate((element) => {
      const e = element as HTMLElement
      return {
        route: JSON.parse(e.dataset.route!),
        stops: JSON.parse(e.dataset.routeStops!),
        position: Number(e.dataset.cameraDistance),
        target: Number(e.dataset.cameraTarget),
        moving: e.dataset.cameraMoving === 'true',
        snapping: e.dataset.cameraSnap === 'true',
        active: e.dataset.activeScene,
      }
    })) as {
      route: string[]
      stops: number[]
      position: number
      target: number
      moving: boolean
      snapping: boolean
      active: string
    }
    const indices = meta.route.flatMap((node, i) => (node === id ? [i] : [])),
      index = direction > 0 ? indices.at(-1)! : indices[0],
      stop = meta.stops[index]
    expect(Number.isFinite(stop), `configured path to ${id}`).toBe(true)
    if (meta.active === id && Math.abs(meta.position - stop) < 0.2) {
      await at(page, id)
      return
    }
    const remaining = stop - meta.target
    // Let nearby captures finish without injecting a correction while their
    // target changes. A deliberately released stop needs explicit reverse input
    // once motion rests; hysteresis correctly prevents automatic recapture.
    if (
      Math.abs(remaining) > C.snapRadius ||
      (!meta.moving && !meta.snapping && Math.abs(remaining) > C.settleDistance)
    ) {
      const brand = (await page.locator('.brand').boundingBox())!
      await page.mouse.move(
        brand.x + brand.width / 2,
        brand.y + brand.height / 2,
      )
      const dpr = await page.evaluate(() => devicePixelRatio)
      await page.mouse.wheel(
        0,
        Math.sign(remaining) *
          Math.min(650, Math.abs(remaining) / C.pixelsPerWheelUnit) *
          dpr,
      )
    }
    await page.waitForTimeout(270)
  }
  throw new Error(`Scroll input did not reach ${id}`)
}
export async function branch(page: Page, id: string) {
  const area = page.locator(`[data-edge-id="${id}"]`),
    target = (await area.getAttribute('data-edge-target'))!,
    box = (await area.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.7)
  await page.waitForTimeout(270)
  await page.mouse.wheel(0, 220)
  await page.waitForTimeout(30)
  await travelTo(page, target)
}
export async function roll(page: Page, direction = 1) {
  const next = await page
    .locator('.world-stage')
    .evaluate((element, direction) => {
      const e = element as HTMLElement,
        route = JSON.parse(e.dataset.route!) as string[],
        stops = JSON.parse(e.dataset.routeStops!) as number[],
        position = Number(e.dataset.cameraDistance),
        nearest = stops.reduce(
          (best, stop, i) =>
            Math.abs(stop - position) < Math.abs(stops[best] - position)
              ? i
              : best,
          0,
        )
      return route[Math.max(0, Math.min(route.length - 1, nearest + direction))]
    }, direction)
  await travelTo(page, next, direction)
}
export async function seedVisited(page: Page, ids: string[]) {
  await page.addInitScript((visited) => {
    if (!localStorage.getItem('react-world-navigation'))
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
export async function advance(page: Page, id: string) {
  await travelTo(page, id)
}
