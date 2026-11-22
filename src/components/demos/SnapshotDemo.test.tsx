import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SnapshotDemo } from './SnapshotDemo'
import { SNAPSHOT_UI } from '@/content/lessons'
test('handler snapshot remains old while functional queued updates accumulate', () => {
  render(<SnapshotDemo />)
  fireEvent.click(screen.getByRole('button', { name: SNAPSHOT_UI.single }))
  expect(screen.getByLabelText(SNAPSHOT_UI.before)).toHaveTextContent('0')
  expect(screen.getByLabelText(SNAPSHOT_UI.after)).toHaveTextContent('1')
  fireEvent.click(screen.getByRole('button', { name: SNAPSHOT_UI.batchLabel }))
  expect(screen.getByLabelText(SNAPSHOT_UI.before)).toHaveTextContent('1')
  expect(screen.getByLabelText(SNAPSHOT_UI.after)).toHaveTextContent('4')
})
