import { LEARNING_SCENES } from '@/content/learningScenes'
import { create } from 'zustand'
export const useWorldStore = create<{
  mode: 'journey' | 'learning'
  requestedId: string
  revision: number
  reveal: boolean
  navigate: (id: string, reveal?: boolean) => void
}>((set) => ({
  mode: 'journey',
  requestedId: 'node',
  revision: 0,
  reveal: false,
  navigate: (id, reveal = false) =>
    set((s) => ({
      requestedId: id,
      mode: LEARNING_SCENES.some((s) => s.id === id) ? 'learning' : 'journey',
      reveal,
      revision: s.revision + 1,
    })),
}))
