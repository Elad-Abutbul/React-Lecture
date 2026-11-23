import {
  test as base,
  expect,
  type Page,
  type TestInfo,
} from '@playwright/test'
import { join } from 'node:path'
import { open, at, settled, seedVisited, revisit } from './helpers'
// Browser-injected wheel input covers integration. Synthetic traces below cover
// high-resolution and momentum regressions; neither proves physical Mac hardware.
const test = base.extend<{ navigationErrors: void }>({
  navigationErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await page.addInitScript(() => {
        window.addEventListener('unhandledrejection', (event) => {
          throw event.reason
        })
      })
      await use()
      expect(
        errors,
        'console errors, unhandled exceptions and rejections',
      ).toEqual([])
    },
    { auto: true },
  ],
})
async function capture(page: Page, name: string, info: TestInfo) {
  await expect(page.locator('.graph-node-active .focus-title')).toHaveCSS(
    'opacity',
    '1',
  )
  await expect(
    page.locator('.graph-node-active .graph-node-content'),
  ).toHaveCSS('opacity', '1')
  const file = `${info.project.name}-${name}.jpg`
  const path = process.env.NAVIGATION_SCREENSHOT_DIR
    ? join(process.env.NAVIGATION_SCREENSHOT_DIR, file)
    : info.outputPath(file)
  await page.screenshot({ path, type: 'jpeg', quality: 90 })
  await info.attach(name, { path, contentType: 'image/jpeg' })
}
async function samples(page: Page, values: [number, number][], interval = 8) {
  await page.evaluate(
    async ({ values, interval }) => {
      for (const [x, y] of values) {
        window.dispatchEvent(
          new WheelEvent('wheel', {
            deltaX: x,
            deltaY: y,
            bubbles: true,
            cancelable: true,
          }),
        )
        if (interval)
          await new Promise((resolve) => setTimeout(resolve, interval))
      }
    },
    { values, interval },
  )
}
async function freshWheel(page: Page, x: number, y: number) {
  await page.waitForTimeout(300)
  const brand = (await page.locator('.brand').boundingBox())!
  await page.mouse.move(brand.x + brand.width / 2, brand.y + brand.height / 2)
  await page.mouse.wheel(x, y)
}
async function startAt(page: Page, route: string[]) {
  await page.addInitScript((route) => {
    localStorage.setItem(
      'react-world-navigation',
      JSON.stringify({
        version: 2,
        state: {
          route,
          cursor: route.length - 1,
          visited: route,
          choices: {},
          traversed: [],
        },
      }),
    )
  }, route)
  await page.goto('/')
  await at(page, route.at(-1)!)
  // Seeded scenarios begin at a readable stop, after camera and arrival reveal.
  await expect(
    page.locator('.graph-node-active .graph-node-content'),
  ).toHaveCSS('opacity', '1')
}
const existing = ['node', 'verify', 'project', 'existing']
async function geometry(page: Page) {
  const stage = page.locator('.world-stage')
  const camera = await stage.evaluate((element) => ({
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
  const viewport = page.viewportSize()!
  const anchor = await page
    .locator('.graph-node-active')
    .evaluate((element) => {
      const box = element.getBoundingClientRect(),
        transform = new DOMMatrixReadOnly(getComputedStyle(element).transform)
      return { x: box.x - transform.m41, y: box.y - transform.m42 }
    })
  expect(Math.abs(anchor.x - viewport.width / 2)).toBeLessThan(2)
  expect(Math.abs(anchor.y - viewport.height / 2)).toBeLessThan(2)
  expect(
    await page
      .locator('.world-viewport')
      .evaluate((e) => ({ x: e.scrollLeft, y: e.scrollTop })),
  ).toEqual({ x: 0, y: 0 })
  const reader = await page.locator('.graph-reading').boundingBox()
  expect(reader!.y).toBeGreaterThanOrEqual(0)
  expect(reader!.y + reader!.height).toBeLessThanOrEqual(viewport.height)
  expect(
    await page.evaluate(() => ({
      x: scrollX,
      y: scrollY,
      overflow: document.documentElement.scrollWidth > innerWidth,
    })),
  ).toEqual({ x: 0, y: 0, overflow: false })
  expect(
    await page.locator('path[data-source]').evaluateAll((paths) =>
      paths.every((path) => {
        const line = path as SVGPathElement,
          source = document.querySelector<HTMLElement>(
            `[data-world-node="${line.dataset.source}"]`,
          )!,
          target = document.querySelector<HTMLElement>(
            `[data-world-node="${line.dataset.target}"]`,
          )!,
          start = line.getPointAtLength(0),
          end = line.getPointAtLength(line.getTotalLength())
        return (
          Math.abs(start.x - parseFloat(source.style.left)) < 0.1 &&
          Math.abs(start.y - parseFloat(source.style.top)) < 0.1 &&
          Math.abs(end.x - parseFloat(target.style.left)) < 0.1 &&
          Math.abs(end.y - parseFloat(target.style.top)) < 0.1
        )
      }),
    ),
  ).toBe(true)
  return camera
}
test('positive wheel selects RIGHT and negative wheel selects LEFT in RTL, with diagonal camera travel', async ({
  page,
}, info) => {
  await open(page)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  const origin = await geometry(page)
  await capture(page, 'right-before', info)
  await freshWheel(page, 240, 0)
  await at(page, 'verify')
  const right = await geometry(page)
  expect(right.x).toBeGreaterThan(origin.x)
  expect(right.y).toBeGreaterThan(origin.y)
  await capture(page, 'right-after', info)
  await freshWheel(page, 0, -240)
  await at(page, 'node')
  await capture(page, 'left-before', info)
  await freshWheel(page, -240, 0)
  await at(page, 'os')
  const left = await geometry(page)
  expect(left.x).toBeLessThan(origin.x)
  expect(left.y).toBeGreaterThan(origin.y)
  await capture(page, 'left-after', info)
})
test('vertical DOWN and UP move exactly one stop and settle precisely', async ({
  page,
}, info) => {
  await startAt(page, existing)
  await capture(page, 'down-before', info)
  await freshWheel(page, 0, 1200)
  await at(page, 'scripts')
  await geometry(page)
  await capture(page, 'down-after', info)
  await capture(page, 'up-before', info)
  await freshWheel(page, 0, -1200)
  await at(page, 'existing')
  await geometry(page)
  await capture(page, 'up-after', info)
})
test('positive fractional wheel samples choose RIGHT', async ({ page }) => {
  await open(page)
  await samples(
    page,
    Array.from({ length: 160 }, () => [1.5, 0]),
  )
  await at(page, 'verify')
})
test('negative fractional wheel samples choose LEFT', async ({ page }) => {
  await open(page)
  await samples(
    page,
    Array.from({ length: 160 }, () => [-1.5, 0]),
  )
  await at(page, 'os')
})
test('switching axes never combines unrelated travel into a branch', async ({
  page,
}) => {
  await open(page)
  await samples(page, [
    [0, 110],
    [110, 0],
  ])
  await at(page, 'node')
})
test('downward diagonals choose physical branches and upward diagonals backtrack', async ({
  page,
}) => {
  await open(page)
  await samples(page, [
    [200, 200],
    [100, 100],
  ])
  await at(page, 'verify')
  await freshWheel(page, 0, -240)
  await at(page, 'node')
  await freshWheel(page, -240, 150)
  await at(page, 'os')
  await freshWheel(page, -240, -240)
  await at(page, 'node')
})
test('vertical-dominant diagonal follows the selected path instead of switching branch', async ({
  page,
}) => {
  await open(page)
  await freshWheel(page, 240, 0)
  await at(page, 'verify')
  await freshWheel(page, 0, -240)
  await at(page, 'node')
  await freshWheel(page, -100, 240)
  await at(page, 'verify')
})
test('rapid wheel bursts during and after flight plus decaying momentum cannot skip nodes', async ({
  page,
}) => {
  await startAt(page, existing)
  await samples(
    page,
    Array.from({ length: 40 }, () => [0, 240]),
    40,
  )
  await samples(
    page,
    Array.from({ length: 20 }, (_, i) => [0, 40 - i * 1.9]),
    20,
  )
  await at(page, 'scripts')
  await freshWheel(page, 0, 240)
  await at(page, 'scripts-result')
})
test('reversal after arrival works without waiting for a quiet interval', async ({
  page,
}) => {
  await startAt(page, existing)
  await samples(
    page,
    Array.from({ length: 24 }, () => [0, 200]),
    50,
  )
  await at(page, 'scripts')
  await samples(page, [
    [0, -15],
    [0, 5],
  ])
  await at(page, 'scripts')
  await samples(page, [[0, -180]])
  await at(page, 'existing')
})
test('backtracking and changing a previous decision replaces its future and preserves visited history', async ({
  page,
}) => {
  await open(page)
  await freshWheel(page, 240, 0)
  await at(page, 'verify')
  await freshWheel(page, 0, -240)
  await at(page, 'node')
  await freshWheel(page, -240, 0)
  await at(page, 'os')
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.route).toEqual(['node', 'os'])
  expect(state.choices.node).toBe('no')
  expect(state.visited).toEqual(
    expect.arrayContaining(['node', 'verify', 'os']),
  )
  await geometry(page)
})
test('reading does not swallow horizontal navigation or leak its momentum into the next stop', async ({
  page,
}) => {
  await startAt(page, ['node', 'verify'])
  await page.locator('.graph-reading').evaluate((element) => {
    Object.defineProperty(element, 'scrollHeight', {
      value: 10000,
      configurable: true,
    })
  })
  await samples(
    page,
    [
      [0, 40],
      [220, 0],
    ],
    50,
  )
  await at(page, 'project')
  await samples(page, [[0, 500]])
  await at(page, 'project')
})
test('keyboard, branch click fallback and touch use the same locked navigation state', async ({
  page,
}) => {
  await open(page)
  await page.keyboard.press('ArrowRight')
  await at(page, 'verify')
  await page.keyboard.press('ArrowUp')
  await at(page, 'node')
  await page.locator('[data-edge-id="no"]').click()
  await at(page, 'os')
  await page.keyboard.press('ArrowUp')
  await at(page, 'node')
  await page.keyboard.press('ArrowLeft')
  await at(page, 'os')
  await page.keyboard.press('ArrowUp')
  await at(page, 'node')
  await page.evaluate(() => {
    const dispatch = (type: string, clientX?: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'touches', {
        value: clientX === undefined ? [] : [{ clientX, clientY: 400 }],
      })
      window.dispatchEvent(event)
    }
    dispatch('touchstart', 280)
    dispatch('touchmove', 100)
    dispatch('touchend')
  })
  await at(page, 'verify')
  await geometry(page)
})
test('long content remains readable at the stop and needs a separate gesture after the reading boundary', async ({
  page,
}, info) => {
  await seedVisited(page, ['H04'])
  await open(page)
  await revisit(page, 'H04 · JSX ראשון')
  await at(page, 'H04')
  await page.getByRole('button', { name: 'רמזים ופתרון', exact: true }).click()
  await page.getByRole('button', { name: 'רמז ראשון', exact: true }).click()
  await page.getByRole('button', { name: 'רמז שני', exact: true }).click()
  await page
    .getByRole('button', { name: 'חשיפת פתרון מלא', exact: true })
    .click()
  await expect(
    page.locator('.graph-node-active .graph-node-content'),
  ).toHaveCSS('opacity', '1')
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  const reader = page.locator('.graph-reading')
  await reader.locator('pre').focus()
  expect(await reader.evaluate((e) => e.scrollHeight > e.clientHeight)).toBe(
    true,
  )
  await reader.evaluate((e) => {
    e.scrollTop = 0
  })
  await samples(
    page,
    [
      [0, 300],
      [0, 10000],
      [0, 10000],
    ],
    20,
  )
  await at(page, 'H04')
  expect(
    await reader.evaluate((e) =>
      Math.abs(e.scrollHeight - e.clientHeight - e.scrollTop),
    ),
  ).toBeLessThan(2)
  expect(await reader.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(
    true,
  )
  await geometry(page)
  await capture(page, 'long-reading-bottom', info)
  await freshWheel(page, 0, 240)
  await at(page, 'H05')
})
test('resize during flight cancels the old camera and finishes at the exact target without a stuck lock', async ({
  page,
}) => {
  await open(page)
  await freshWheel(page, 240, 0)
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-active-scene',
    'verify',
  )
  await page.setViewportSize({ width: 800, height: 760 })
  await settled(page)
  await geometry(page)
  await freshWheel(page, 0, -240)
  await at(page, 'node')
  await geometry(page)
})
test('one gesture controller is registered and utility scrolling cannot move the world', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const add = window.addEventListener.bind(window),
      remove = window.removeEventListener.bind(window),
      listeners = new Set<EventListenerOrEventListenerObject>()
    window.addEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions | boolean,
    ) => {
      if (type === 'wheel') listeners.add(listener)
      add(type, listener, options)
    }) as typeof window.addEventListener
    window.removeEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: EventListenerOptions | boolean,
    ) => {
      if (type === 'wheel') listeners.delete(listener)
      remove(type, listener, options)
    }) as typeof window.removeEventListener
    Object.defineProperty(window, 'navigationWheelListeners', {
      get: () => listeners.size,
    })
  })
  await open(page)
  expect(
    await page.evaluate(() => Reflect.get(window, 'navigationWheelListeners')),
  ).toBe(1)
  await page.getByRole('button', { name: 'מפת העץ', exact: true }).click()
  await page.getByRole('textbox', { name: 'סינון צמתים' }).fill('React')
  await page
    .getByRole('textbox', { name: 'סינון צמתים' })
    .dispatchEvent('wheel', { deltaX: 500, deltaY: 500 })
  await page.keyboard.press('Escape')
  await at(page, 'node')
  await geometry(page)
})

test('camera deadlines do not inherit GSAP global lag compensation on slow frames', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.requestAnimationFrame = (callback) =>
      window.setTimeout(() => callback(performance.now()), 650)
    window.cancelAnimationFrame = (id) => clearTimeout(id)
  })
  await open(page)
  await freshWheel(page, 240, 0)
  await at(page, 'verify')
  await geometry(page)
  await freshWheel(page, 0, -240)
  await at(page, 'node')
})

test('camera moves monotonically toward its diagonal target while the same SVG connection stays mounted', async ({
  page,
}, info) => {
  await open(page)
  const line = page.locator('path[data-source="node"][data-target="verify"]')
  const connection = await line.getAttribute('d')
  const origin = await geometry(page)
  const target = await page
    .locator('[data-world-node="verify"]')
    .evaluate((element) => ({
      x: parseFloat((element as HTMLElement).style.left),
      y: parseFloat((element as HTMLElement).style.top),
    }))
  await freshWheel(page, 240, 0)
  const positions = await page.evaluate(async () => {
    const positions: {
      x: number
      y: number
      connected: boolean
      path: string | null
    }[] = []
    for (let i = 0; i < 8; i++) {
      const stage = document.querySelector('.world-stage')!,
        path = document.querySelector(
          'path[data-source="node"][data-target="verify"]',
        )!
      positions.push({
        x: Number(stage.getAttribute('data-camera-x')),
        y: Number(stage.getAttribute('data-camera-y')),
        connected: path.isConnected,
        path: path.getAttribute('d'),
      })
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return positions
  })
  if (info.project.use.reducedMotion !== 'reduce')
    expect(
      positions.some(
        (p) =>
          p.x > origin.x && p.x < target.x && p.y > origin.y && p.y < target.y,
      ),
    ).toBe(true)
  let previous = origin
  for (const position of positions) {
    expect(position.x).toBeGreaterThanOrEqual(previous.x)
    expect(position.y).toBeGreaterThanOrEqual(previous.y)
    expect(position.x).toBeLessThanOrEqual(target.x)
    expect(position.y).toBeLessThanOrEqual(target.y)
    expect(position.connected).toBe(true)
    expect(position.path).toBe(connection)
    previous = position
  }
  await at(page, 'verify')
  await geometry(page)
})
