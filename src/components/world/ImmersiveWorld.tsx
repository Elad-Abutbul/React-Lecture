import { useRef, useState, useCallback, useMemo } from 'react'
import { Atom, RotateCcw } from 'lucide-react'
import { JOURNEY_NODES, JOURNEY_COPY } from '@/content/journey'
import { WORLD, WORLD_COPY } from '@/constants/world'
import {
  BRANCH_DIRECTIONS,
  GESTURE_COPY,
  type BranchDirection,
} from '@/constants/gestures'
import { getActivePath } from '@/lib/journey-engine'
import { useJourneyStore } from '@/store/journey-store'
import { useWorldStore } from '@/store/world-store'
import { useWorldViewport } from '@/hooks/useWorldViewport'
import { useWorldCamera } from '@/hooks/useWorldCamera'
import { useBranchGesture } from '@/hooks/useBranchGesture'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
import { WorldJourneyScene } from './WorldJourneyScene'
import { WorldPaths } from './WorldPaths'
import { DirectionGuide } from './DirectionGuide'
export function ImmersiveWorld() {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const [active, setActive] = useState('node')
  const [pending, setPending] = useState<{
    nodeId: string
    choiceId: string
  } | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const stage = useRef<HTMLDivElement>(null)
  const space = useRef<HTMLDivElement>(null)
  const viewport = useWorldViewport()
  const route = useMemo(
    () => getActivePath(choices).map((n) => n.id),
    [choices],
  )
  const changeScene = useCallback((id: string) => setActive(id), [])
  const changeReveal = useCallback(() => undefined, [])
  useWorldCamera({
    stage,
    space,
    route,
    ...viewport,
    onScene: changeScene,
    onReveal: changeReveal,
  })
  const node =
    JOURNEY_NODES.find((n) => n.id === active) ??
    JOURNEY_NODES.find((n) => n.id === 'node')!
  const apply = useCallback((nodeId: string, choiceId: string) => {
    useJourneyStore.getState().choose(nodeId, choiceId)
    useWorldStore.getState().navigate(useJourneyStore.getState().currentNodeId)
  }, [])
  const select = useCallback(
    (nodeId: string, choiceId: string) => {
      const state = useJourneyStore.getState()
      const path = getActivePath(state.choices)
      const index = path.findIndex((n) => n.id === nodeId)
      if (
        state.choices[nodeId] &&
        state.choices[nodeId] !== choiceId &&
        path.slice(index + 1).some((n) => state.completedNodeIds.includes(n.id))
      )
        setPending({ nodeId, choiceId })
      else apply(nodeId, choiceId)
    },
    [apply],
  )
  const direction = useCallback(
    (value: BranchDirection) => {
      const option = BRANCH_DIRECTIONS[node.id]?.[value]
      if (option) {
        setAnnouncement(`${GESTURE_COPY.announcement}: ${option.label}`)
        select(node.id, option.choiceId)
      }
    },
    [node.id, select],
  )
  useBranchGesture(node.kind === 'question', node.id, direction)
  return (
    <>
      <div
        ref={space}
        className="world-scroll-space"
        style={{
          height: `${(route.length + 1) * WORLD.scrollStep + viewport.height}px`,
        }}
        aria-hidden="true"
      />
      <main
        id="main"
        className={`world-viewport scene-${node.kind}`}
        aria-label={WORLD_COPY.world}
      >
        <div className="world-aura" />
        <header className="world-chrome">
          <span className="brand" dir="ltr">
            <Atom className="text-react" aria-hidden="true" />
            {WORLD_COPY.brand}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-react" dir="ltr">
              {completed.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={JOURNEY_COPY.reset}
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
        </header>
        <div ref={stage} className="world-stage">
          <WorldPaths route={route} active={active} />
        </div>
        <div className="world-focus" data-active-scene={node.id}>
          <WorldJourneyScene
            key={node.id}
            node={node}
            onChoose={(choiceId) => select(node.id, choiceId)}
          />
          {node.kind === 'question' && <DirectionGuide node={node} />}
        </div>
        <footer className="world-footer">
          <span>
            {node.kind === 'question' ? GESTURE_COPY.wheel : WORLD_COPY.scroll}
          </span>
          <span className="font-mono text-xs text-muted" dir="ltr">
            {node.id}
          </span>
        </footer>
        <p className="sr-only" role="status">
          {announcement}
        </p>
        <ConfirmationDialog
          open={pending !== null}
          onOpenChange={(open) => {
            if (!open) setPending(null)
          }}
          title={JOURNEY_COPY.changeTitle}
          description={JOURNEY_COPY.changeDescription}
          onConfirm={() => {
            if (pending) apply(pending.nodeId, pending.choiceId)
          }}
        />
        <ConfirmationDialog
          open={resetOpen}
          onOpenChange={setResetOpen}
          title={JOURNEY_COPY.resetTitle}
          description={JOURNEY_COPY.resetDescription}
          onConfirm={() => {
            useJourneyStore.getState().reset()
            useWorldStore.getState().navigate('node')
          }}
        />
      </main>
    </>
  )
}
