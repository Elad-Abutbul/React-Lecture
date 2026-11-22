import { useRef, useState } from 'react'
import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getActivePath } from '@/lib/journey-engine'
import { flowLayout } from '@/lib/flow-layout'
import { useJourneyStore, journeyNodeById } from '@/store/journey-store'
import { FlowSummary } from './flow-nodes/FlowSummary'
import { DecisionNode } from './DecisionNode'
import { DecisionEdge } from './DecisionEdge'
import { TreeCamera } from './TreeCamera'
import { TREE_NAV, TREE_COPY } from '@/constants/tree'
import { FLOW_LABELS } from '@/constants/flow'
import { JOURNEY_COPY } from '@/content/journey'
import { Button } from '@/components/ui/button'
const NODE_TYPES = { journey: FlowSummary }
const EDGE_TYPES = { journey: DecisionEdge }
export default function FlowCanvas() {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const current = useJourneyStore((s) => s.currentNodeId)
  const [exploring, setExploring] = useState(false)
  const track = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const path = getActivePath(choices)
  const { nodes, edges } = flowLayout(path, completed, current)
  const node = journeyNodeById(current) ?? path.at(-1)!
  return (
    <>
      <p className="mb-5 text-sm text-muted">{TREE_COPY.hint}</p>
      <div
        ref={track}
        className="tree-scroll-track"
        style={{
          minHeight: `${Math.max(2, path.length) * TREE_NAV.scrollStep}px`,
        }}
      >
        <div className="tree-stage">
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-react">{TREE_COPY.map}</p>
              <Button
                variant="outline"
                aria-pressed={exploring}
                onClick={() => setExploring((v) => !v)}
              >
                {exploring ? TREE_COPY.follow : TREE_COPY.explore}
              </Button>
            </div>
            <div
              ref={frame}
              className="tree-canvas"
              role="region"
              aria-label={TREE_COPY.map}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={NODE_TYPES}
                edgeTypes={EDGE_TYPES}
                nodesDraggable={false}
                nodesConnectable={false}
                nodesFocusable={false}
                elementsSelectable={false}
                panOnDrag={exploring}
                zoomOnScroll={exploring}
                zoomOnPinch={exploring}
                zoomOnDoubleClick={false}
                panOnScroll={false}
                preventScrolling={exploring}
                minZoom={TREE_NAV.minZoom}
                maxZoom={TREE_NAV.maxZoom}
                className="dark"
                ariaLabelConfig={FLOW_LABELS}
              >
                <Background />
                <Controls showInteractive={false} />
                <TreeCamera
                  path={path}
                  current={current}
                  exploring={exploring}
                  track={track}
                  frame={frame}
                />
              </ReactFlow>
            </div>
          </div>
          <div className="tree-details" aria-label={JOURNEY_COPY.details}>
            <DecisionNode node={node} />
          </div>
        </div>
      </div>
    </>
  )
}
