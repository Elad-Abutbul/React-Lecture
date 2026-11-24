import { test, expect } from 'vitest'
import { courseProgress } from './course-progress'
test('workshop progress starts locally after the lecture and reverses without losing prior history', () => {
  const route = [
      'home',
      'L00',
      'L01',
      'course-bridge',
      'lecture-W00',
      'lecture-W01',
      'course-reference',
      'node',
    ],
    stops = [0, 100, 200, 300, 400, 500, 600, 700]
  expect(courseProgress(route, stops, 200, 2)).toBe(0.5)
  expect(courseProgress(route, stops, 400, 4)).toBe(0)
  expect(courseProgress(route, stops, 450, 5)).toBe(0.5)
  expect(courseProgress(route, stops, 425, 4)).toBe(0.25)
  expect(courseProgress(['node', 'verify'], [0, 100], 50, 0)).toBe(0.5)
})

test('the introduction remains at zero before either learning section starts', () => {
  expect(courseProgress(['home', 'W00', 'W01'], [0, 100, 200], 50, 0)).toBe(0)
})
