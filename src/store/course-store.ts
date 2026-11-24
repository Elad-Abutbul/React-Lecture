import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COURSE_CONFIG, COURSE_QUIZ_OPTIONS } from '@/constants/course'
type State = {
  hints: Record<string, boolean>
  checked: string[]
  answers: Record<string, string>
  hint: (id: string, value: boolean) => void
  check: (id: string, value: boolean) => void
  answer: (id: string, value: string) => void
}
export const useCourseStore = create<State>()(
  persist(
    (set) => ({
      hints: {},
      checked: [],
      answers: {},
      hint: (id, value) => set((s) => ({ hints: { ...s.hints, [id]: value } })),
      check: (id, value) =>
        set((s) => ({
          checked: value
            ? [...new Set([...s.checked, id])]
            : s.checked.filter((v) => v !== id),
        })),
      answer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),
    }),
    {
      name: COURSE_CONFIG.storage,
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === 'object'
            ? (persisted as Partial<State>)
            : {}
        const hints = Object.fromEntries(
          Object.entries(
            raw.hints && typeof raw.hints === 'object' ? raw.hints : {},
          ).filter(
            ([key, value]) =>
              /^W(?:0[0-9]|10)-(?:basic|full)$/.test(key) &&
              typeof value === 'boolean',
          ),
        )
        const answers = Object.fromEntries(
          Object.entries(
            raw.answers && typeof raw.answers === 'object' ? raw.answers : {},
          ).filter(
            ([key, value]) =>
              /^[0-4]$/.test(key) &&
              typeof value === 'string' &&
              COURSE_QUIZ_OPTIONS.includes(value),
          ),
        )
        return {
          ...current,
          hints,
          answers,
          checked: Array.isArray(raw.checked)
            ? [
                ...new Set(
                  raw.checked.filter(
                    (id) =>
                      typeof id === 'string' && /^W(?:0[0-9]|10)$/.test(id),
                  ),
                ),
              ]
            : [],
        }
      },
      partialize: ({ hints, checked, answers }) => ({
        hints,
        checked,
        answers,
      }),
    },
  ),
)
