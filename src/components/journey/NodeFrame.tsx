import type { ReactNode } from 'react'
import type { JourneyNode } from '@/types/journey'
import { NodeStatus } from './NodeStatus'
import { NodeChoices } from './NodeChoices'
export function NodeFrame({
  node,
  children,
}: {
  node: JourneyNode
  children?: ReactNode
}) {
  return (
    <article
      id={`node-${node.id}`}
      className="node-card"
      tabIndex={-1}
      aria-labelledby={`node-title-${node.id}`}
    >
      <NodeStatus id={node.id} />
      <h3 id={`node-title-${node.id}`} className="text-2xl font-semibold">
        {node.title}
      </h3>
      <p className="mt-3 text-muted">{node.description}</p>
      {children}
      <NodeChoices node={node} />
    </article>
  )
}
