import { Handle, Position, type NodeProps } from '@xyflow/react'
import { CheckCircle2, Circle } from 'lucide-react'
import type { FlowNode } from '@/lib/flow-layout'
import { useJourneyStore } from '@/store/journey-store'
export function FlowSummary({ data }: NodeProps<FlowNode>) {
  const backTo = useJourneyStore((s) => s.backTo)
  const Icon = data.done ? CheckCircle2 : Circle
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button
        className={`flow-node nodrag ${data.active ? 'flow-node-active' : ''}`}
        aria-pressed={data.active}
        onClick={() => backTo(data.journeyId)}
      >
        <Icon
          className={data.done ? 'text-success' : 'text-react'}
          aria-hidden="true"
        />
        <span>{data.title}</span>
      </button>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
