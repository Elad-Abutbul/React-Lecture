import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SceneConsole } from './SceneConsole'
import { WorldJourneyScene } from './WorldJourneyScene'
import { JOURNEY_NODES, JOURNEY_COPY } from '@/content/journey'
import { COMMANDS } from '@/constants/commands'
const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
beforeEach(() =>
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  }),
)
afterEach(() => {
  if (original) Object.defineProperty(navigator, 'clipboard', original)
  else Reflect.deleteProperty(navigator, 'clipboard')
})
test('copy uses the exact command and never confirms completion', async () => {
  const choose = vi.fn()
  render(
    <WorldJourneyScene
      node={JOURNEY_NODES.find((n) => n.id === 'create')!}
      onChoose={choose}
    />,
  )
  fireEvent.click(
    screen.getByRole('button', {
      name: `${JOURNEY_COPY.copy}: ${COMMANDS.CREATE_REACT.code}`,
    }),
  )
  await waitFor(() =>
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      COMMANDS.CREATE_REACT.code,
    ),
  )
  expect(choose).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'בוצע' }))
  expect(choose).toHaveBeenCalledWith('done')
})
test('clipboard rejection produces a usable manual-copy explanation', async () => {
  vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
    new Error('blocked'),
  )
  render(<SceneConsole commandId="NODE_VERSION" />)
  fireEvent.click(
    screen.getByRole('button', { name: `${JOURNEY_COPY.copy}: node -v` }),
  )
  await waitFor(() =>
    expect(screen.getByRole('status')).toHaveTextContent(
      JOURNEY_COPY.copyFailed,
    ),
  )
})
