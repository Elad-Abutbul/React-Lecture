import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { extendPath, pathTo } from '@/lib/graph-navigation'
type GraphState = {
  route: string[]
  cursor: number
  visited: string[]
  choices: Record<string, string>
}
type GraphStore = GraphState & {
  transitioning: boolean
  beginTransition: () => void
  arrive: () => void
  step: (direction: number) => void
  revision: number
  visit: (index: number) => void
  select: (edgeId: string) => void
  jump: (id: string) => void
  reset: () => void
}
function initial(): GraphState {
  try {
    const legacy = JSON.parse(
      localStorage.getItem('react-journey-progress') ?? 'null',
    )?.state
    if (legacy?.choices) {
      const route = extendPath([GRAPH_NAV.start], legacy.choices)
      const cursor = Math.max(0, route.indexOf(legacy.currentNodeId))
      return {
        route,
        cursor,
        visited: route.slice(0, cursor + 1),
        choices: legacy.choices,
      }
    }
  } catch {
    /* A blocked or corrupted legacy store does not prevent navigation. */
  }
  return {
    route: extendPath([GRAPH_NAV.start]),
    cursor: 0,
    visited: [GRAPH_NAV.start],
    choices: {},
  }
}
export function sanitizeGraph(raw: unknown): GraphState {
  if (!raw || typeof raw !== 'object') return initial()
  const data = raw as Partial<GraphState>
  const route: string[] = []
  if (Array.isArray(data.route))
    for (const id of data.route.slice(0, GRAPH_NAV.maxHistory)) {
      if (
        typeof id !== 'string' ||
        !GRAPH_BY_ID[id] ||
        (!route.length && id !== GRAPH_NAV.start) ||
        (route.length &&
          !GRAPH_BY_ID[route.at(-1)!].edges.some((e) => e.target === id))
      )
        break
      route.push(id)
    }
  if (!route.length) return initial()
  const cursor =
    typeof data.cursor === 'number' && Number.isFinite(data.cursor)
      ? Math.max(0, Math.min(route.length - 1, Math.floor(data.cursor)))
      : 0
  const choices: Record<string, string> = {}
  for (let i = 0; i < route.length - 1; i++) {
    const edge = GRAPH_BY_ID[route[i]].edges.find(
      (e) => e.target === route[i + 1],
    )
    if (edge) choices[route[i]] = edge.id
  }
  return {
    route,
    cursor,
    choices,
    visited: [
      ...new Set([
        ...(Array.isArray(data.visited)
          ? data.visited.filter(
              (id) => typeof id === 'string' && !!GRAPH_BY_ID[id],
            )
          : []),
        ...route.slice(0, cursor + 1),
      ]),
    ],
  }
}
export const useGraphStore = create<GraphStore>()(
  persist(
    (set, get) => ({
      ...initial(),
      revision: 0,
      transitioning: false,
      beginTransition: () => set({ transitioning: true }),
      arrive: () => set({ transitioning: false }),
      step: (direction) =>
        set((s) => {
          if (s.transitioning) return s
          const cursor = Math.max(
            0,
            Math.min(s.route.length - 1, s.cursor + Math.sign(direction)),
          )
          if (cursor === s.cursor) return s
          return {
            cursor,
            visited: [...new Set([...s.visited, s.route[cursor]])],
            transitioning: true,
            revision: s.revision + 1,
          }
        }),
      visit: (index) =>
        set((s) => {
          const cursor = Math.max(0, Math.min(s.route.length - 1, index))
          const id = s.route[cursor]
          if (cursor === s.cursor && s.visited.includes(id)) return s
          return { cursor, visited: [...new Set([...s.visited, id])] }
        }),
      select: (edgeId) =>
        set((s) => {
          if (s.transitioning) return s
          const node = GRAPH_BY_ID[s.route[s.cursor]],
            edge = node?.edges.find((e) => e.id === edgeId)
          if (!edge) return s
          if (s.route[s.cursor + 1] === edge.target)
            return { cursor: s.cursor + 1, revision: s.revision + 1 }
          const prefix = s.route.slice(0, s.cursor + 1)
          const choices = { ...s.choices, [node.id]: edge.id }
          // Keep the explored archive while removing obsolete descendants from the active trail.
          const route = extendPath([...prefix, edge.target])
          const valid = new Set(route)
          for (const id of Object.keys(choices))
            if (!valid.has(id)) delete choices[id]
          return {
            route,
            choices,
            cursor: s.cursor + 1,
            visited: [...new Set([...s.visited, edge.target])],
            transitioning: true,
            revision: s.revision + 1,
          }
        }),
      jump: (id) => {
        const state = get(),
          index = state.route.indexOf(id)
        if (index >= 0) {
          set({ cursor: index, revision: state.revision + 1 })
          return
        }
        if (!GRAPH_BY_ID[id]) return
        const prefix = pathTo(id),
          route = extendPath(prefix)
        const clean = sanitizeGraph({
          ...state,
          route,
          cursor: prefix.length - 1,
        })
        set({ ...clean, revision: state.revision + 1 })
      },
      reset: () =>
        set((s) => ({
          route: extendPath([GRAPH_NAV.start]),
          cursor: 0,
          visited: [GRAPH_NAV.start],
          choices: {},
          transitioning: false,
          revision: s.revision + 1,
        })),
    }),
    {
      name: GRAPH_NAV.storage.key,
      version: GRAPH_NAV.storage.version,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ route, cursor, visited, choices }) => ({
        route,
        cursor,
        visited,
        choices,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeGraph(persisted),
      }),
      migrate: sanitizeGraph,
    },
  ),
)
