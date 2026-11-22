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
  traversed: string[]
}
type GraphStore = GraphState & {
  revision: number
  transitioning: boolean
  beginTransition: () => void
  arrive: () => void
  step: (direction: number) => void
  visit: (index: number) => void
  select: (edgeId: string) => void
  jump: (id: string) => void
  reset: () => void
}
const connections = (route: readonly string[], cursor: number) =>
  route.slice(0, cursor).map((id, index) => `${id}::${route[index + 1]}`)
const unique = (values: string[]) => [...new Set(values)]
function initial(): GraphState {
  try {
    const legacy = JSON.parse(
      localStorage.getItem('react-journey-progress') ?? 'null',
    )?.state
    if (legacy?.choices) {
      const route = extendPath([GRAPH_NAV.start], legacy.choices),
        cursor = Math.max(0, route.indexOf(legacy.currentNodeId))
      return {
        route,
        cursor,
        visited: route.slice(0, cursor + 1),
        choices: legacy.choices,
        traversed: connections(route, cursor),
      }
    }
  } catch {
    /* Corrupt or blocked legacy storage never prevents using the tree. */
  }
  return {
    route: extendPath([GRAPH_NAV.start]),
    cursor: 0,
    visited: [GRAPH_NAV.start],
    choices: {},
    traversed: [],
  }
}
export function sanitizeGraph(raw: unknown): GraphState {
  if (!raw || typeof raw !== 'object') return initial()
  const data = raw as Partial<GraphState>,
    prefix: string[] = []
  if (Array.isArray(data.route))
    for (const id of data.route.slice(0, GRAPH_NAV.maxHistory)) {
      if (
        typeof id !== 'string' ||
        !GRAPH_BY_ID[id] ||
        (!prefix.length && id !== GRAPH_NAV.start) ||
        (prefix.length &&
          !GRAPH_BY_ID[prefix.at(-1)!].edges.some((edge) => edge.target === id))
      )
        break
      prefix.push(id)
    }
  if (!prefix.length) return initial()
  const route = extendPath(prefix),
    cursor =
      typeof data.cursor === 'number' && Number.isFinite(data.cursor)
        ? Math.max(0, Math.min(prefix.length - 1, Math.floor(data.cursor)))
        : 0,
    choices: Record<string, string> = {}
  for (let index = 0; index < route.length - 1; index++) {
    const edge = GRAPH_BY_ID[route[index]].edges.find(
      (edge) => edge.target === route[index + 1],
    )
    if (edge) choices[route[index]] = edge.id
  }
  const archived = Array.isArray(data.traversed)
    ? data.traversed.filter((value): value is string => {
        if (typeof value !== 'string') return false
        const [source, target] = value.split('::')
        return !!GRAPH_BY_ID[source]?.edges.some(
          (edge) => edge.target === target,
        )
      })
    : []
  return {
    route,
    cursor,
    choices,
    visited: unique([
      ...(Array.isArray(data.visited)
        ? data.visited.filter(
            (id): id is string => typeof id === 'string' && !!GRAPH_BY_ID[id],
          )
        : []),
      ...route.slice(0, cursor + 1),
    ]),
    traversed: unique([...archived, ...connections(route, cursor)]),
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
        set((state) => {
          if (state.transitioning) return state
          let cursor = Math.max(
            0,
            Math.min(
              state.route.length - 1,
              state.cursor + Math.sign(direction),
            ),
          )
          if (cursor === state.cursor) return state
          const target = state.route[cursor],
            traversed =
              direction > 0
                ? unique([
                    ...state.traversed,
                    `${state.route[state.cursor]}::${target}`,
                  ])
                : state.traversed
          let route = state.route,
            choices = state.choices
          // A retry rejoins the existing node rather than indefinitely appending duplicate history.
          const earlier = route.indexOf(target)
          if (direction > 0 && earlier < state.cursor) {
            route = extendPath(route.slice(0, earlier + 1))
            cursor = earlier
            choices = { ...state.choices }
            const valid = new Set(route)
            for (const id of Object.keys(choices))
              if (!valid.has(id) || id === target) delete choices[id]
          }
          return {
            cursor,
            route,
            choices,
            traversed,
            visited: unique([...state.visited, target]),
            transitioning: true,
            revision: state.revision + 1,
          }
        }),
      visit: (index) =>
        set((state) => {
          const cursor = Math.max(0, Math.min(state.route.length - 1, index)),
            id = state.route[cursor]
          return { cursor, visited: unique([...state.visited, id]) }
        }),
      select: (edgeId) =>
        set((state) => {
          if (state.transitioning) return state
          const node = GRAPH_BY_ID[state.route[state.cursor]],
            edge = node?.edges.find((edge) => edge.id === edgeId)
          if (!edge) return state
          const traversed = unique([
            ...state.traversed,
            `${node.id}::${edge.target}`,
          ])
          if (state.route[state.cursor + 1] === edge.target)
            return {
              cursor: state.cursor + 1,
              traversed,
              transitioning: true,
              revision: state.revision + 1,
            }
          const route = extendPath([
              ...state.route.slice(0, state.cursor + 1),
              edge.target,
            ]),
            choices = { ...state.choices, [node.id]: edge.id },
            valid = new Set(route)
          for (const id of Object.keys(choices))
            if (!valid.has(id)) delete choices[id]
          return {
            route,
            choices,
            traversed,
            cursor: state.cursor + 1,
            visited: unique([...state.visited, edge.target]),
            transitioning: true,
            revision: state.revision + 1,
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
          route = extendPath(prefix),
          clean = sanitizeGraph({ ...state, route, cursor: prefix.length - 1 })
        set({ ...clean, revision: state.revision + 1 })
      },
      reset: () =>
        set((state) => ({
          route: extendPath([GRAPH_NAV.start]),
          cursor: 0,
          visited: [GRAPH_NAV.start],
          choices: {},
          traversed: [],
          transitioning: false,
          revision: state.revision + 1,
        })),
    }),
    {
      name: GRAPH_NAV.storage.key,
      version: GRAPH_NAV.storage.version,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ route, cursor, visited, choices, traversed }) => ({
        route,
        cursor,
        visited,
        choices,
        traversed,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeGraph(persisted),
      }),
      migrate: sanitizeGraph,
    },
  ),
)
