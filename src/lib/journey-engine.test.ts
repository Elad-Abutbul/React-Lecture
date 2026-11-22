import { expect, test } from 'vitest'
import { JOURNEY_NODES } from '@/content/journey'
import {
  getActivePath,
  getNextNode,
  reconcileChoices,
  validateJourneyGraph,
} from './journey-engine'
import type { Choices, JourneyNode } from '@/types/journey'
const newProject: Choices = {
  start: 'yes',
  node: 'yes',
  verify: 'done',
  project: 'new',
  create: 'done',
  enter: 'done',
  install: 'done',
  dev: 'done',
  browser: 'done',
  tools: 'done',
}
test.each(['windows', 'mac'])('supports %s without Node', (os) => {
  const path = getActivePath({ ...newProject, node: 'no', os, [os]: 'done' })
  expect(path.map((n) => n.id)).toContain(os)
  expect(path.at(-1)?.id).toBe('success')
})
test('supports an installed Node', () =>
  expect(getActivePath(newProject).at(-1)?.id).toBe('success'))
test('supports an existing project without creating it', () => {
  const ids = getActivePath({
    ...newProject,
    project: 'existing',
    existing: 'done',
    scripts: 'done',
    'existing-run': 'done',
  }).map((n) => n.id)
  expect(ids).toContain('existing-run')
  expect(ids).not.toContain('create')
  expect(ids.at(-1)).toBe('success')
})
test('routes failed checks to help', () =>
  expect(
    getActivePath({ start: 'yes', node: 'yes', verify: 'error' }).at(-1)?.id,
  ).toBe('node-help'))
test('only prunes downstream choices when switching an OS', () => {
  const result = reconcileChoices(
    { ...newProject, node: 'no', os: 'mac', windows: 'done' },
    Object.keys(newProject),
  )
  expect(result.choices).toEqual({ start: 'yes', node: 'no', os: 'mac' })
  expect(result.completedNodeIds).toEqual(['start', 'node'])
})
test('stops at an unanswered node', () =>
  expect(getActivePath({ start: 'yes' }).map((n) => n.id)).toEqual([
    'start',
    'node',
  ]))
test('does not advance for an invalid choice', () =>
  expect(getNextNode(JOURNEY_NODES[0], { start: 'missing' })).toBeUndefined())
test('accepts explicit recovery edges but bounds a traversal', () => {
  expect(validateJourneyGraph(JOURNEY_NODES)).toEqual([])
  expect(getActivePath({ start: 'no', why: 'done' }).map((n) => n.id)).toEqual([
    'start',
    'why',
  ])
})
test('rejects cycles, missing targets, duplicates and missing roots', () => {
  const node: JourneyNode = {
    id: 'start',
    title: '',
    description: '',
    kind: 'question',
    choices: [
      { id: 'loop', label: '', nextNodeId: 'start' },
      { id: 'missing', label: '', nextNodeId: 'absent' },
    ],
  }
  expect(validateJourneyGraph([node, node])).toEqual(
    expect.arrayContaining([
      'duplicate node',
      'missing target: absent',
      'cycle: start',
    ]),
  )
  expect(validateJourneyGraph([])).toContain('missing start')
  expect(getActivePath({ start: 'loop' }, [node])).toHaveLength(1)
})
test('failed checkpoints are not completed', () =>
  expect(
    reconcileChoices({ start: 'yes', node: 'yes', verify: 'error' }, [
      'start',
      'verify',
    ]).completedNodeIds,
  ).toEqual(['start']))
