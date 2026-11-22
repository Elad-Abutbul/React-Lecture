import { beforeEach, expect, test } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { JourneySection } from './JourneySection'
import { useJourneyStore } from '@/store/journey-store'
import { JOURNEY_NODES } from '@/content/journey'
beforeEach(() => useJourneyStore.getState().reset())
test('completes the new-project installation with explicit approvals', () => {
  render(<JourneySection />)
  for (const [id, choice] of [
    ['start', 'yes'],
    ['node', 'yes'],
    ['verify', 'done'],
    ['project', 'new'],
    ['create', 'done'],
    ['enter', 'done'],
    ['install', 'done'],
    ['dev', 'done'],
    ['browser', 'done'],
    ['tools', 'done'],
  ]) {
    const node = JOURNEY_NODES.find((n) => n.id === id)!
    const label = node.choices.find((c) => c.id === choice)!.label
    fireEvent.click(
      within(screen.getByRole('article', { name: node.title })).getByRole(
        'button',
        { name: label },
      ),
    )
  }
  expect(
    screen.getByRole('heading', { name: JOURNEY_NODES.at(-1)!.title }),
  ).toBeVisible()
})
