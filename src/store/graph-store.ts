import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { GRAPH_NAV } from '@/constants/graphNavigation'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { extendPath, pathTo } from '@/lib/graph-navigation'
import { createGraphMotion, type GraphMotion } from '@/lib/graph-motion'
import { GRAPH_MOTION } from '@/constants/graphMotion'
type GraphState = {
  route: string[]
  cursor: number
  visited: string[]
  choices: Record<string, string>
  traversed: string[]
  pendingChoices: string[]
}
type GraphStore = GraphState & {
  motion: GraphMotion
  synchronize: () => void
  revision: number
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
        pendingChoices: [],
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
    pendingChoices: [],
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
        (!prefix.length &&
          id !== GRAPH_NAV.start &&
          id !== GRAPH_NAV.referenceStart) ||
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
    pendingChoices: unique([
      ...(Array.isArray(data.pendingChoices)
        ? data.pendingChoices.filter(
            (id): id is string =>
              typeof id === 'string' &&
              route.includes(id) &&
              GRAPH_BY_ID[id].edges.length > 1,
          )
        : []),
      ...(GRAPH_BY_ID[route[cursor]].edges.length > 1 && route[cursor + 1]
        ? [route[cursor]]
        : []),
    ]),
  }
}
const starting = initial()
const motion = createGraphMotion(starting.route, starting.cursor)
let observedPosition = motion.position
export const useGraphStore = create<GraphStore>()(
  persist(
    (set, get) => ({
      ...starting,
      motion,
      synchronize: () => {
        const state = get()
        const position = motion.position,
          path = motion.path,
          cursor = path.nearest(position),
          reached: string[] = []
        for (let i = 0; i < path.stops.length; i++) {
          const stop = path.stops[i]
          if (
            Math.abs(stop - position) <= GRAPH_MOTION.arrivalRadius ||
            (stop > Math.min(position, observedPosition) &&
              stop < Math.max(position, observedPosition))
          )
            reached.push(state.route[i])
        }
        const pendingChoices =
          position < observedPosition
            ? unique([
                ...state.pendingChoices,
                ...state.route.filter(
                  (id, index) =>
                    state.visited.includes(id) &&
                    GRAPH_BY_ID[id].edges.length > 1 &&
                    path.stops[index] >=
                      position - GRAPH_MOTION.decisionRadius &&
                    path.stops[index] <=
                      observedPosition + GRAPH_MOTION.decisionRadius,
                ),
              ])
            : state.pendingChoices
        observedPosition = position
        const visited = unique([...state.visited, ...reached])
        const traversed = unique([
          ...state.traversed,
          ...connections(
            state.route,
            Math.abs(path.stops[cursor] - position) <=
              GRAPH_MOTION.arrivalRadius
              ? cursor
              : Math.floor(motion.point.index),
          ),
        ])
        // A completed retry rejoins the existing stop without extending history forever.
        const id = state.route[cursor],
          earlier = state.route.indexOf(id)
        if (
          earlier < cursor &&
          Math.abs(path.stops[cursor] - position) <= GRAPH_MOTION.settleDistance
        ) {
          const route = extendPath(state.route.slice(0, earlier + 1)),
            choices = { ...state.choices }
          for (const key of Object.keys(choices))
            if (!route.includes(key) || key === id) delete choices[key]
          motion.configure(route, earlier)
          observedPosition = motion.position
          set({
            route,
            cursor: earlier,
            choices,
            visited,
            traversed,
            pendingChoices: pendingChoices.filter((id) => route.includes(id)),
            revision: state.revision + 1,
          })
          return
        }
        if (
          cursor === state.cursor &&
          visited.length === state.visited.length &&
          traversed.length === state.traversed.length &&
          pendingChoices.length === state.pendingChoices.length
        )
          return
        set({ cursor, visited, traversed, pendingChoices })
      },
      revision: 0,
      select: (edgeId) =>
        set((state) => {
          const node = GRAPH_BY_ID[state.route[state.cursor]],
            edge = node?.edges.find((edge) => edge.id === edgeId)
          if (
            !edge ||
            Math.abs(motion.position - motion.path.stops[state.cursor]) >
              GRAPH_MOTION.decisionRadius
          )
            return state
          if (state.route[state.cursor + 1] === edge.target) {
            motion.configure(state.route)
            observedPosition = motion.position
            return {
              pendingChoices: state.pendingChoices.filter(
                (id) => id !== node.id,
              ),
            }
          }
          const route = extendPath([
              ...state.route.slice(0, state.cursor + 1),
              edge.target,
            ]),
            choices = { ...state.choices, [node.id]: edge.id },
            valid = new Set(route)
          for (const id of Object.keys(choices))
            if (!valid.has(id)) delete choices[id]
          motion.configure(route)
          observedPosition = motion.position
          return {
            route,
            choices,
            pendingChoices: state.pendingChoices.filter(
              (id) => id !== node.id && valid.has(id),
            ),
            revision: state.revision + 1,
          }
        }),
      jump: (id) => {
        const state = get(),
          index = state.route.indexOf(id)
        if (index >= 0) {
          motion.configure(state.route, index)
          observedPosition = motion.position
          set({
            cursor: index,
            pendingChoices:
              GRAPH_BY_ID[id].edges.length > 1
                ? unique([...state.pendingChoices, id])
                : state.pendingChoices,
            visited: unique([...state.visited, id]),
            traversed: unique([
              ...state.traversed,
              ...connections(state.route, index),
            ]),
            revision: state.revision + 1,
          })
          return
        }
        if (!GRAPH_BY_ID[id]) return
        const prefix = pathTo(id),
          route = extendPath(prefix),
          clean = sanitizeGraph({ ...state, route, cursor: prefix.length - 1 })
        motion.configure(route, clean.cursor)
        observedPosition = motion.position
        set({ ...clean, revision: state.revision + 1 })
      },
      reset: () => {
        motion.configure(extendPath([GRAPH_NAV.start]), 0)
        observedPosition = motion.position
        set((state) => ({
          route: extendPath([GRAPH_NAV.start]),
          cursor: 0,
          visited: [GRAPH_NAV.start],
          choices: {},
          traversed: [],
          pendingChoices: [],
          revision: state.revision + 1,
        }))
      },
    }),
    {
      name: GRAPH_NAV.storage.key,
      version: GRAPH_NAV.storage.version,
      storage: createJSONStorage(() => localStorage),
      partialize: ({
        route,
        cursor,
        visited,
        choices,
        traversed,
        pendingChoices,
      }) => ({
        route,
        cursor,
        visited,
        choices,
        traversed,
        pendingChoices,
      }),
      merge: (persisted, current) => {
        const clean = sanitizeGraph(persisted)
        motion.configure(clean.route, clean.cursor)
        observedPosition = motion.position
        return { ...current, ...clean }
      },
      migrate: (raw) =>
        sanitizeGraph({
          ...(raw && typeof raw === 'object' ? raw : {}),
          route: [GRAPH_NAV.start],
          cursor: 0,
          pendingChoices: [],
        }),
    },
  ),
)
