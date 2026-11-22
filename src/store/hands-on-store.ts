import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { HANDS_ON } from '@/constants/handsOn'
import { HANDS_ON_BY_ID } from '@/content/handsOn'
type WorkshopProgress = {
  visited: string[]
  checked: string[]
  skipped: string[]
  hints: Record<string, number>
  plan: 90 | 120
  instructor: boolean
}
type WorkshopStore = WorkshopProgress & {
  visit: (id: string) => void
  check: (id: string, value: boolean) => void
  skip: (id: string, value: boolean) => void
  hint: (id: string) => void
  reveal: (id: string) => void
  setPlan: (plan: 90 | 120) => void
  setInstructor: (value: boolean) => void
  reset: () => void
}
const blank: WorkshopProgress = {
  visited: [],
  checked: [],
  skipped: [],
  hints: {},
  plan: 120,
  instructor: false,
}
export function sanitizeWorkshop(raw: unknown): WorkshopProgress {
  const d =
    raw && typeof raw === 'object' ? (raw as Partial<WorkshopProgress>) : {}
  const ids = (value: unknown) =>
    Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === 'string' && !!HANDS_ON_BY_ID[id],
            ),
          ),
        ]
      : []
  const hints: Record<string, number> = {}
  if (d.hints && typeof d.hints === 'object')
    for (const [id, level] of Object.entries(d.hints))
      if (
        HANDS_ON_BY_ID[id] &&
        typeof level === 'number' &&
        Number.isFinite(level)
      )
        hints[id] = Math.min(3, Math.max(0, Math.floor(level)))
  return {
    visited: ids(d.visited),
    checked: ids(d.checked),
    skipped: ids(d.skipped).filter((id) => !ids(d.checked).includes(id)),
    hints,
    plan: d.plan === 90 ? 90 : 120,
    instructor: d.instructor === true,
  }
}
export const useHandsOnStore = create<WorkshopStore>()(
  persist(
    (set) => ({
      ...blank,
      visit: (id) => {
        if (HANDS_ON_BY_ID[id])
          set((s) => ({ visited: [...new Set([...s.visited, id])] }))
      },
      check: (id, value) => {
        if (HANDS_ON_BY_ID[id])
          set((s) => ({
            checked: value
              ? [...new Set([...s.checked, id])]
              : s.checked.filter((v) => v !== id),
            skipped: s.skipped.filter((v) => v !== id),
          }))
      },
      skip: (id, value) => {
        if (HANDS_ON_BY_ID[id])
          set((s) => ({
            skipped: value
              ? [...new Set([...s.skipped, id])]
              : s.skipped.filter((v) => v !== id),
            checked: s.checked.filter((v) => v !== id),
          }))
      },
      hint: (id) => {
        if (HANDS_ON_BY_ID[id])
          set((s) => ({
            hints: { ...s.hints, [id]: Math.min(3, (s.hints[id] ?? 0) + 1) },
          }))
      },
      reveal: (id) => {
        if (HANDS_ON_BY_ID[id])
          set((state) => ({ hints: { ...state.hints, [id]: 3 } }))
      },
      setPlan: (plan) => set({ plan }),
      setInstructor: (instructor) => set({ instructor }),
      reset: () =>
        set((state) => ({
          ...blank,
          visited: [],
          checked: [],
          skipped: [],
          hints: {},
          plan: state.plan,
          instructor: state.instructor,
        })),
    }),
    {
      name: HANDS_ON.storage.key,
      version: HANDS_ON.storage.version,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ visited, checked, skipped, hints, plan, instructor }) => ({
        visited,
        checked,
        skipped,
        hints,
        plan,
        instructor,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeWorkshop(persisted),
      }),
      migrate: sanitizeWorkshop,
    },
  ),
)
