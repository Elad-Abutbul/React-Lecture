import type { JourneyNode } from '@/types/journey'
import { NodeFrame } from './NodeFrame'
import { CommandCard } from './CommandCard'
import { JOURNEY_COPY } from '@/content/journey'
export function CheckpointNode({ node }: { node: JourneyNode }) {
  return (
    <NodeFrame node={node}>
      <p className="mt-4 text-sm text-warning">{JOURNEY_COPY.manual}</p>
      {node.checkpoint?.commandIds.map((id) => (
        <CommandCard key={id} commandId={id} />
      ))}
      {node.helpUrl && (
        <a
          className="mt-4 inline-block text-react underline"
          href={node.helpUrl}
          target="_blank"
          rel="noreferrer"
        >
          {JOURNEY_COPY.help}
        </a>
      )}
    </NodeFrame>
  )
}
