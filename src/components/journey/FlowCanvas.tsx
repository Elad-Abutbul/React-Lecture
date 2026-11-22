import { DecisionEdge } from './DecisionEdge'
import { ReactFlow, Controls, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getActivePath } from '@/lib/journey-engine'
import { flowLayout } from '@/lib/flow-layout'
import { useJourneyStore, journeyNodeById } from '@/store/journey-store'
import { FlowSummary } from './flow-nodes/FlowSummary'
import { DecisionNode } from './DecisionNode'
import { JOURNEY_COPY } from '@/content/journey'
import { FLOW, FLOW_LABELS } from '@/constants/flow'
const EDGE_TYPES = { journey: DecisionEdge }
const NODE_TYPES = { journey: FlowSummary }
export default function FlowCanvas() {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const current = useJourneyStore((s) => s.currentNodeId)
  const path = getActivePath(choices)
  const { nodes, edges } = flowLayout(path, completed, current)
  const node = journeyNodeById(current) ?? path.at(-1)!
  return (
    <div className="flow-layout">
      <div>
        <p className="mb-4 text-sm text-muted">{JOURNEY_COPY.mapHint}</p>
        <div
          className="flow-container"
          role="region"
          aria-label={JOURNEY_COPY.map}
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
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            preventScrolling={false}
            minZoom={FLOW.minZoom}
            maxZoom={FLOW.maxZoom}
            fitView
            fitViewOptions={FLOW.fit}
            className="dark"
            ariaLabelConfig={FLOW_LABELS}
          >
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>
      <div aria-label={JOURNEY_COPY.details}>
        <DecisionNode node={node} />
      </div>
    </div>
  )
}
