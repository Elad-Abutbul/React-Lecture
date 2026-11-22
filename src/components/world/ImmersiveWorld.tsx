import { useRef, useState, type CSSProperties } from 'react'
import { Atom, Compass, RotateCcw } from 'lucide-react'
import { WORLD_GRAPH, GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_COPY, GRAPH_NAV } from '@/constants/graphNavigation'
import { ATMOSPHERE } from '@/constants/atmosphere'
import { WORLD_COPY } from '@/constants/world'
import { useGraphStore } from '@/store/graph-store'
import { useGraphGesture } from '@/hooks/useGraphGesture'
import { useGraphCamera } from '@/hooks/useGraphCamera'
import { useWorldViewport } from '@/hooks/useWorldViewport'
import { GraphContent } from '../tree/GraphContent'
import { GraphBranches } from '../tree/GraphBranches'
import { GraphPaths } from '../tree/GraphPaths'
import { GraphProgress } from '../tree/GraphProgress'
import { GraphMenu } from '../tree/GraphMenu'
import { Button } from '../ui/button'
import { Atmosphere } from './Atmosphere'
import { ReactCursor } from './ReactCursor'
export function ImmersiveWorld() {
  const route = useGraphStore((s) => s.route),
    cursor = useGraphStore((s) => s.cursor),
    visited = useGraphStore((s) => s.visited)
  const transitioning = useGraphStore((state) => state.transitioning)
  const node = GRAPH_BY_ID[route[cursor]]
  const [menuOpen, setMenuOpen] = useState(false),
    [announcement, setAnnouncement] = useState('')
  const stage = useRef<HTMLDivElement>(null),
    progress = useRef<HTMLDivElement>(null)
  const viewport = useWorldViewport()
  useGraphGesture()
  useGraphCamera(stage, progress, viewport.width, viewport.height)
  const near = new Set(
    [node.id, ...node.edges.map((e) => e.target), route[cursor - 1]].filter(
      Boolean,
    ),
  )
  return (
    <>
      <main
        id="main"
        className={`world-viewport unified-world topic-${node.kind}`}
        aria-label={WORLD_COPY.world}
        aria-busy={transitioning}
        style={
          {
            '--topic-hue': `${ATMOSPHERE.topicHue[node.sourceId ?? node.id] ?? 0}deg`,
            '--arrival-duration': `${GRAPH_NAV.arrival.duration}s`,
            '--arrival-stagger': `${GRAPH_NAV.arrival.stagger}s`,
            '--path-pulse': `${GRAPH_NAV.arrival.pulse}s`,
            '--ghost-scale': GRAPH_NAV.ghostScale,
          } as CSSProperties
        }
      >
        <Atmosphere />
        <ReactCursor />
        <header className="world-chrome">
          <span className="brand" dir="ltr">
            <Atom aria-hidden="true" className="text-react" />
            {WORLD_COPY.brand}
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              id="tree-map-trigger"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="world-tree-menu"
              aria-label={GRAPH_COPY.map}
              onClick={() => setMenuOpen(true)}
            >
              <Compass aria-hidden="true" />
            </Button>
            <span className="graph-visited">
              {GRAPH_COPY.visited}
              {visited.length} {GRAPH_COPY.nodes}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={GRAPH_COPY.reset}
              onClick={() => {
                useGraphStore.getState().reset()
                setAnnouncement(GRAPH_COPY.resetDone)
              }}
            >
              <RotateCcw aria-hidden="true" />
            </Button>
          </div>
        </header>
        <GraphProgress progressRef={progress} />
        <div ref={stage} className="world-stage" data-active-scene={node.id}>
          <GraphPaths route={route} />
          {WORLD_GRAPH.map((scene) => (
            <section
              key={scene.id}
              className={`graph-node ${scene.id === node.id ? 'graph-node-active' : 'graph-node-distant'} ${scene.edges.length > 1 ? 'graph-decision' : ''}`}
              style={{ left: scene.position.x, top: scene.position.y }}
              aria-hidden={scene.id !== node.id}
              inert={scene.id !== node.id}
              data-world-node={scene.id}
            >
              {scene.id === node.id ? (
                <article
                  className="graph-reading"
                  tabIndex={0}
                  aria-label={GRAPH_COPY.read}
                  aria-labelledby={`graph-title-${scene.id}`}
                >
                  <h1 id={`graph-title-${scene.id}`} className="focus-title">
                    {scene.title}
                  </h1>
                  {scene.description && (
                    <p className="focus-description">{scene.description}</p>
                  )}
                  <div className="graph-node-content">
                    <GraphContent key={scene.id} node={scene} />
                  </div>
                </article>
              ) : near.has(scene.id) || visited.includes(scene.id) ? (
                <div className="graph-ghost">
                  <Atom aria-hidden="true" />
                  <p>{scene.title}</p>
                </div>
              ) : (
                <span className="graph-star" />
              )}
            </section>
          ))}
        </div>
        <GraphBranches key={node.id} node={node} />
        <footer className="world-footer">
          <span>
            {node.edges.length > 1
              ? GRAPH_COPY.branch
              : node.edges.length === 0
                ? GRAPH_COPY.end
                : GRAPH_COPY.scroll}
          </span>
        </footer>
        <p className="sr-only" role="status">
          {announcement}
        </p>
        <GraphMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </main>
    </>
  )
}
