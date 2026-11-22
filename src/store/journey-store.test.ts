import { beforeEach, expect, test } from 'vitest'
import { useJourneyStore, sanitizeProgress } from './journey-store'
import { JOURNEY_STORAGE } from '@/constants/storage'
beforeEach(() => {
  useJourneyStore.getState().reset()
  localStorage.clear()
})
test('persists choices and rehydrates them', async () => {
  useJourneyStore.getState().choose('start', 'yes')
  expect(
    JSON.parse(localStorage.getItem(JOURNEY_STORAGE.key)!).state.choices,
  ).toEqual({ start: 'yes' })
  useJourneyStore.setState({
    choices: {},
    completedNodeIds: [],
    currentNodeId: 'start',
  })
  localStorage.setItem(
    JOURNEY_STORAGE.key,
    JSON.stringify({
      version: JOURNEY_STORAGE.version,
      state: {
        choices: { start: 'yes' },
        completedNodeIds: ['start'],
        currentNodeId: 'node',
      },
    }),
  )
  await useJourneyStore.persist.rehydrate()
  expect(useJourneyStore.getState().choices).toEqual({ start: 'yes' })
})
test('switching a branch removes dependent choices and completion', () => {
  const store = () => useJourneyStore.getState()
  store().choose('start', 'yes')
  store().choose('node', 'yes')
  store().choose('verify', 'done')
  store().choose('node', 'no')
  expect(store().choices).toEqual({ start: 'yes', node: 'no' })
  expect(store().completedNodeIds).not.toContain('verify')
})
test('retry clears the failed checkpoint and retains its ancestors', () => {
  const store = () => useJourneyStore.getState()
  store().choose('start', 'yes')
  store().choose('node', 'yes')
  store().choose('verify', 'error')
  store().choose('node-help', 'done')
  expect(store().currentNodeId).toBe('verify')
  expect(store().choices).toEqual({ start: 'yes', node: 'yes' })
  expect(store().completedNodeIds).not.toContain('verify')
})
test('rejects hidden-node actions and resets', () => {
  useJourneyStore.getState().complete('create')
  expect(useJourneyStore.getState().choices).toEqual({})
  useJourneyStore.getState().choose('start', 'yes')
  useJourneyStore.getState().reset()
  expect(useJourneyStore.getState().completedNodeIds).toEqual([])
})
test('sanitizes corrupted persisted data', () => {
  expect(
    sanitizeProgress({
      choices: null,
      completedNodeIds: [null, 'unknown'],
      currentNodeId: 'absent',
    }),
  ).toEqual({ choices: {}, completedNodeIds: [], currentNodeId: 'start' })
  expect(sanitizeProgress(null).choices).toEqual({})
})
