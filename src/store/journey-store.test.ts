import { beforeEach, expect, test } from 'vitest'
import { useJourneyStore, sanitizeProgress } from './journey-store'
import { JOURNEY_STORAGE } from '@/constants/storage'
beforeEach(() => {
  useJourneyStore.getState().reset()
  localStorage.clear()
})
test('persists choices and rehydrates them', async () => {
  useJourneyStore.getState().choose('node', 'yes')
  expect(
    JSON.parse(localStorage.getItem(JOURNEY_STORAGE.key)!).state.choices,
  ).toEqual({ node: 'yes' })
  useJourneyStore.setState({
    choices: {},
    completedNodeIds: [],
    currentNodeId: 'node',
  })
  localStorage.setItem(
    JOURNEY_STORAGE.key,
    JSON.stringify({
      version: JOURNEY_STORAGE.version,
      state: {
        choices: { node: 'yes' },
        completedNodeIds: ['node'],
        currentNodeId: 'verify',
      },
    }),
  )
  await useJourneyStore.persist.rehydrate()
  expect(useJourneyStore.getState().choices).toEqual({ node: 'yes' })
})
test('switching a branch prunes dependent progress', () => {
  const store = () => useJourneyStore.getState()
  store().choose('node', 'yes')
  store().choose('verify', 'done')
  store().choose('node', 'no')
  expect(store().choices).toEqual({ node: 'no' })
  expect(store().completedNodeIds).not.toContain('verify')
})
test('retry preserves ancestors and clears the failed checkpoint', () => {
  const store = () => useJourneyStore.getState()
  store().choose('node', 'yes')
  store().choose('verify', 'error')
  store().choose('node-help', 'done')
  expect(store().currentNodeId).toBe('verify')
  expect(store().choices).toEqual({ node: 'yes' })
})
test('rejects hidden-node actions and resets', () => {
  useJourneyStore.getState().complete('create')
  expect(useJourneyStore.getState().choices).toEqual({})
  useJourneyStore.getState().choose('node', 'yes')
  useJourneyStore.getState().reset()
  expect(useJourneyStore.getState().completedNodeIds).toEqual([])
})
test('sanitizes corruption and migrates meaningful legacy progress', () => {
  expect(
    sanitizeProgress({
      choices: null,
      completedNodeIds: [null, 'unknown'],
      currentNodeId: 'absent',
    }),
  ).toEqual({ choices: {}, completedNodeIds: [], currentNodeId: 'node' })
  expect(
    sanitizeProgress({
      choices: { start: 'yes', node: 'yes', verify: 'done' },
      completedNodeIds: ['start', 'node', 'verify'],
      currentNodeId: 'project',
    }).choices,
  ).toEqual({ node: 'yes', verify: 'done' })
})
