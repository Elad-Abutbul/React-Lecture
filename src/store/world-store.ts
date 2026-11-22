import { create } from 'zustand'
export const useWorldStore = create<{
  requestedId: string
  revision: number
  reveal: boolean
  navigate: (id: string, reveal?: boolean) => void
}>((set) => ({
  requestedId: 'intro',
  revision: 0,
  reveal: false,
  navigate: (id, reveal = false) =>
    set((s) => ({ requestedId: id, reveal, revision: s.revision + 1 })),
}))
