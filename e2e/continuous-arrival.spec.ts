import { test, expect } from '@playwright/test'
import { GRAPH_MOTION as C } from '../src/constants/graphMotion'
import { open, seedVisited, revisit } from './helpers'

test('momentum reaching another decision cannot choose its next branch automatically', async ({
  page,
}) => {
  await seedVisited(page, ['windows'])
  await open(page)
  await revisit(page, 'התקנת Node.js ב־Windows')
  await page.evaluate(async () => {
    for (let i = 0; i < 16; i++) {
      window.dispatchEvent(
        new WheelEvent('wheel', {
          deltaX: 600,
          deltaY: 650,
          bubbles: true,
          cancelable: true,
        }),
      )
      await new Promise((r) => setTimeout(r, 32))
    }
  })
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem('react-world-navigation')!).state,
  )
  expect(state.choices.verify).toBeUndefined()
  expect(state.route.at(-1)).toBe('verify')
  await expect(page.locator('.world-stage')).toHaveAttribute(
    'data-active-scene',
    'verify',
  )
})

test('arrival visuals keep the same DOM and remain continuous while input reverses', async ({
  page,
}, info) => {
  await open(page)
  await page.locator('[data-edge-id="yes"]').click()
  const samples = await page.evaluate(async () => {
    const node = document.querySelector<HTMLElement>(
        '[data-world-node="node"]',
      )!,
      reader = node.querySelector('.graph-reading')!,
      samples: { distance: number; focus: number; connected: boolean }[] = []
    const wheel = (y: number) =>
      window.dispatchEvent(
        new WheelEvent('wheel', { deltaY: y, bubbles: true, cancelable: true }),
      )
    wheel(300)
    for (let i = 0; i < 60; i++) {
      if (i === 12) wheel(-70)
      if (i === 30) wheel(40)
      await new Promise<void>((r) => requestAnimationFrame(() => r()))
      samples.push({
        distance: Number(
          (document.querySelector('.world-stage') as HTMLElement).dataset
            .cameraDistance,
        ),
        focus: Number(node.style.getPropertyValue('--node-focus')),
        connected: reader.isConnected,
      })
    }
    return samples
  })
  expect(samples.every((s) => s.connected)).toBe(true)
  expect(
    samples
      .slice(10, 28)
      .some((s, i, array) => i > 0 && s.distance < array[i - 1].distance),
  ).toBe(true)
  for (let i = 1; i < samples.length; i++) {
    expect(
      Math.abs(samples[i].distance - samples[i - 1].distance),
    ).toBeLessThanOrEqual(300 * C.pixelsPerWheelUnit)
    expect(Math.abs(samples[i].focus - samples[i - 1].focus)).toBeLessThan(0.25)
  }
  if (info.project.name === 'reduced-motion')
    expect(samples.every((s) => s.focus === 1)).toBe(true)
  else expect(samples.some((s) => s.focus > 0.1 && s.focus < 0.9)).toBe(true)
  await expect(page.locator('.graph-node-active .focus-title')).toHaveCSS(
    'animation-name',
    'none',
  )
})
