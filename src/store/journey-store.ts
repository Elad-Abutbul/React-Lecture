import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { JOURNEY_NODES, JOURNEY_START } from '@/content/journey'
import { getActivePath, reconcileChoices } from '@/lib/journey-engine'
import { JOURNEY_STORAGE } from '@/constants/storage'
import type { Choices } from '@/types/journey'
export type Progress = {
  choices: Choices
  completedNodeIds: string[]
  currentNodeId: string
}
type JourneyStore = Progress & {
  choose: (nodeId: string, choiceId: string) => void
  complete: (nodeId: string) => void
  backTo: (nodeId: string) => void
  reset: () => void
}
const initial: Progress = {
  choices: {},
  completedNodeIds: [],
  currentNodeId: JOURNEY_START,
}
export function sanitizeProgress(value: unknown): Progress {
  const data =
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  const choices: Choices = {}
  if (data.choices && typeof data.choices === 'object')
    for (const [id, choice] of Object.entries(data.choices))
      if (typeof choice === 'string') choices[id] = choice
  const completed = Array.isArray(data.completedNodeIds)
    ? data.completedNodeIds.filter((id): id is string => typeof id === 'string')
    : []
  const clean = reconcileChoices(choices, completed)
  const path = getActivePath(clean.choices)
  const currentNodeId = path.some((n) => n.id === data.currentNodeId)
    ? String(data.currentNodeId)
    : path.at(-1)!.id
  return { ...clean, currentNodeId }
}
export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      ...initial,
      choose: (nodeId, choiceId) =>
        set((state) => {
          const path = getActivePath(state.choices)
          const node = path.find((n) => n.id === nodeId)
          const choice = node?.choices.find((c) => c.id === choiceId)
          if (!choice) return state
          const choices = { ...state.choices }
          let completed = [...state.completedNodeIds]
          if (choice.retry) {
            const target = path.findIndex((n) => n.id === choice.nextNodeId)
            if (target < 0) return state
            for (const n of path.slice(target)) {
              delete choices[n.id]
              completed = completed.filter((id) => id !== n.id)
            }
          } else {
            choices[nodeId] = choiceId
            completed = completed.filter((id) => id !== nodeId)
            if (choice.complete !== false) completed.push(nodeId)
          }
          const clean = reconcileChoices(choices, completed)
          const nextPath = getActivePath(clean.choices)
          const next =
            nextPath.find((n) => n.id === choice.nextNodeId) ?? nextPath.at(-1)!
          if (!next.choices.length && !clean.completedNodeIds.includes(next.id))
            clean.completedNodeIds.push(next.id)
          return { ...clean, currentNodeId: next.id }
        }),
      complete: (nodeId) => get().choose(nodeId, 'done'),
      backTo: (nodeId) => {
        if (getActivePath(get().choices).some((n) => n.id === nodeId))
          set({ currentNodeId: nodeId })
      },
      reset: () => set({ ...initial, choices: {}, completedNodeIds: [] }),
    }),
    {
      name: JOURNEY_STORAGE.key,
      version: JOURNEY_STORAGE.version,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ choices, completedNodeIds, currentNodeId }) => ({
        choices,
        completedNodeIds,
        currentNodeId,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeProgress(persisted),
      }),
    },
  ),
)
export const journeyNodeById = (id: string) =>
  JOURNEY_NODES.find((n) => n.id === id)
