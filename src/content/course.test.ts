import { test, expect } from 'vitest'
import { COURSE_GRAPH } from './courseGraph'
import { LECTURE, INSTALLATION_GUIDE } from './lecture'
import { WORKSHOP } from './workshop'
import { COURSE_BUILDS } from './courseBuilds'
import { graphErrors, extendPath } from '@/lib/graph-navigation'
import { useGraphStore } from '@/store/graph-store'
test('the homepage has exactly lecture-left and workshop-right branches', () => {
  const home = COURSE_GRAPH[0]
  expect(home.id).toBe('home')
  expect(home.edges.map((e) => [e.label, e.direction, e.target])).toEqual([
    ['הרצאה', 'left', 'L00'],
    ['סדנה מעשית', 'right', 'W00'],
  ])
  expect(graphErrors()).toEqual([])
})
test('lecture order is vertical and leads continuously into the same workshop content', () => {
  expect(LECTURE.map((s) => s.id)).toEqual(
    Array.from({ length: 12 }, (_, i) => `L${String(i).padStart(2, '0')}`),
  )
  const path = extendPath(['home'], { home: 'lecture' })
  expect(path.slice(1, 13)).toEqual(LECTURE.map((s) => s.id))
  expect(path).toContain('lecture-W00')
  expect(
    new Set(
      COURSE_GRAPH.filter((s) => /^L\d/.test(s.id)).map((s) => s.position.x),
    ).size,
  ).toBe(1)
  expect(INSTALLATION_GUIDE).toHaveLength(5)
})
test('every exercise has progressive hints, instructions, expected output and a complete student build', () => {
  expect(WORKSHOP).toHaveLength(11)
  for (const step of WORKSHOP) {
    expect(step.instructions.length).toBeGreaterThan(1)
    expect(step.basicHint).not.toContain('```')
    expect(step.expectedResult).toBeTruthy()
    expect(COURSE_BUILDS[step.id]['src/App.tsx']).toBeTruthy()
  }
  expect(WORKSHOP.find((s) => s.id === 'W09')?.bonus).toBe(true)
})
test('fresh navigation begins at home without automatically traveling after either choice', () => {
  const s = () => useGraphStore.getState()
  s().reset()
  expect(s().route).toEqual(['home'])
  s().select('workshop')
  expect(s().motion.position).toBe(0)
  expect(s().route).toContain('W00')
  s().jump('home')
  s().select('lecture')
  expect(s().pendingChoices).not.toContain('home')
  expect(s().route[1]).toBe('L00')
})

test('old saved progress opens the new homepage while retaining visits and separate exercise checks', async () => {
  localStorage.setItem(
    'react-world-navigation',
    JSON.stringify({
      version: 2,
      state: {
        route: ['node', 'verify'],
        cursor: 1,
        visited: ['node', 'verify'],
        choices: { node: 'yes' },
        traversed: ['node::verify'],
      },
    }),
  )
  localStorage.setItem('react-hands-on-progress', 'preserved')
  await useGraphStore.persist.rehydrate()
  const state = useGraphStore.getState()
  expect(state.route).toEqual(['home'])
  expect(state.visited).toContain('verify')
  expect(state.traversed).toContain('node::verify')
  expect(localStorage.getItem('react-hands-on-progress')).toBe('preserved')
})
