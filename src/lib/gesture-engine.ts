import { GESTURE, type BranchDirection } from '@/constants/gestures'
export type GestureState = { sum: number; lastAt: number }
export function accumulateGesture(
  previous: GestureState,
  x: number,
  y: number,
  now: number,
): { state: GestureState; direction: BranchDirection | null } {
  if (
    Math.abs(x) < GESTURE.minDelta ||
    Math.abs(x) < Math.abs(y) * GESTURE.diagonalRatio
  )
    return { state: { sum: 0, lastAt: now }, direction: null }
  const sum = (now - previous.lastAt > GESTURE.idleReset ? 0 : previous.sum) + x
  const direction =
    Math.abs(sum) >= GESTURE.threshold ? (sum > 0 ? 'right' : 'left') : null
  return { state: { sum: direction ? 0 : sum, lastAt: now }, direction }
}
