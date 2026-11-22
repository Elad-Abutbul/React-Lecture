import { useRef, useState, useCallback, useMemo } from 'react'
import { Atom, Compass } from 'lucide-react'
import { HERO } from '@/content/hero'
import { JOURNEY_NODES } from '@/content/journey'
import {
  WORLD,
  WORLD_POSITIONS,
  WORLD_COPY,
  WORLD_CONNECTIONS,
} from '@/constants/world'
import { getActivePath } from '@/lib/journey-engine'
import { useJourneyStore } from '@/store/journey-store'
import { useWorldStore } from '@/store/world-store'
import { useWorldViewport } from '@/hooks/useWorldViewport'
import { useWorldCamera } from '@/hooks/useWorldCamera'
import { Button } from '@/components/ui/button'
export function ImmersiveWorld() {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const [active, setActive] = useState('intro')
  const [revealing, setRevealing] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const space = useRef<HTMLDivElement>(null)
  const viewport = useWorldViewport()
  const route = useMemo(
    () => ['intro', ...getActivePath(choices).map((n) => n.id)],
    [choices],
  )
  const changeScene = useCallback((id: string) => setActive(id), [])
  const changeReveal = useCallback((value: boolean) => setRevealing(value), [])
  useWorldCamera({
    stage,
    space,
    route,
    ...viewport,
    onScene: changeScene,
    onReveal: changeReveal,
  })
  const width = Math.min(viewport.width - WORLD.gutter * 2, WORLD.maxWidth)
  const height = viewport.height - WORLD.chrome * 2
  const outgoing = WORLD_CONNECTIONS.filter((e) => e.source === active)
  const visible = new Set([...route, ...outgoing.map((e) => e.target)])
  function select(source: string, choice: string) {
    useJourneyStore.getState().choose(source, choice)
    useWorldStore.getState().navigate(useJourneyStore.getState().currentNodeId)
  }
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
      <main id="main" className="world-viewport" aria-label={WORLD_COPY.world}>
        <div className="world-aura" />
        <header className="world-chrome">
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              useWorldStore.getState().navigate('intro')
            }}
            className="brand"
            dir="ltr"
          >
            <Atom className="text-react" aria-hidden="true" />
            {WORLD_COPY.brand}
          </a>
          <span className="text-sm text-muted">
            {completed.length} / {WORLD_COPY.chapter}
          </span>
        </header>
        <div ref={stage} className="world-stage">
          {[...visible].map((id) => {
            const point = WORLD_POSITIONS[id]
            const node = JOURNEY_NODES.find((n) => n.id === id)
            const edge = outgoing.find((e) => e.target === id)
            const current = active === id
            const preview = !current && !!edge
            return (
              <section
                key={id}
                data-world-scene={id}
                className={`world-scene ${preview ? 'world-preview' : ''}`}
                style={{
                  left: point.x - width / 2,
                  top: point.y - height / 2,
                  width,
                  height,
                }}
                inert={!current && !(revealing && preview)}
                aria-hidden={!current && !(revealing && preview)}
              >
                {preview ? (
                  <button
                    className="world-portal"
                    onClick={() =>
                      id === 'start'
                        ? useWorldStore.getState().navigate('start')
                        : select(active, edge!.choiceId)
                    }
                  >
                    <span className="eyebrow">
                      {edge?.label || WORLD_COPY.continue}
                    </span>
                    <h2>{node?.title}</h2>
                    <span className="world-portal-label">
                      {WORLD_COPY.choose}
                    </span>
                  </button>
                ) : id === 'intro' ? (
                  <div className="world-intro">
                    <p className="eyebrow">{HERO.kicker}</p>
                    <h1>{HERO.title}</h1>
                    <p className="world-description">{HERO.description}</p>
                    <Button
                      size="lg"
                      className="rounded-full px-8 py-7 text-base"
                      onClick={() => useWorldStore.getState().navigate('start')}
                    >
                      {WORLD_COPY.continue}
                    </Button>
                  </div>
                ) : (
                  <div className="world-content">
                    <p className="eyebrow">{WORLD_COPY.chapter}</p>
                    <h2>{node?.title}</h2>
                    <p className="world-description">{node?.description}</p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        useWorldStore.getState().navigate(id, true)
                      }
                    >
                      {WORLD_COPY.reveal}
                    </Button>
                  </div>
                )}
              </section>
            )
          })}
        </div>
        <footer className="world-footer">
          <span className="flex items-center gap-3">
            <Compass className="size-4 text-react" aria-hidden="true" />
            {revealing ? WORLD_COPY.choose : WORLD_COPY.scroll}
          </span>
          <span className="font-mono text-xs text-muted" dir="ltr">
            {active}
          </span>
        </footer>
      </main>
    </>
  )
}
