import { useGraphStore } from '@/store/graph-store'
// Isolate the original navigation subgraph in unit tests. Production always starts at home.
export function resetLegacyGraph() {
  const store = useGraphStore.getState()
  store.reset()
  store.motion.configure(['node'], 0)
  useGraphStore.setState({
    route: ['node'],
    cursor: 0,
    visited: ['node'],
    choices: {},
    traversed: [],
    pendingChoices: [],
  })
}
