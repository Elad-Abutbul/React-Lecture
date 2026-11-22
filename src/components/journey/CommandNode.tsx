import type { JourneyNode } from '@/types/journey'
import { NodeFrame } from './NodeFrame'
import { CommandCard } from './CommandCard'
import { JOURNEY_COPY } from '@/content/journey'
export function CommandNode({ node }: { node: JourneyNode }) {
  return (
    <NodeFrame node={node}>
      <p className="mt-4 text-sm text-warning">{JOURNEY_COPY.manual}</p>
      {node.commandId && <CommandCard commandId={node.commandId} />}
    </NodeFrame>
  )
}
