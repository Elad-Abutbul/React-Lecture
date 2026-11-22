import { useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { CheckCircle2, Circle } from 'lucide-react'
import type { FlowNode } from '@/lib/flow-layout'
import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
import { JOURNEY_COPY } from '@/content/journey'
import { TREE_COPY } from '@/constants/tree'
export function FlowSummary({ data }: NodeProps<FlowNode>) {
  const [confirm, setConfirm] = useState(false)
  const Icon = data.done ? CheckCircle2 : Circle
  function apply() {
    const store = useJourneyStore.getState()
    if (data.sourceId && data.choiceId)
      store.choose(data.sourceId, data.choiceId)
    else store.backTo(data.journeyId)
  }
  function select() {
    const store = useJourneyStore.getState()
    const path = getActivePath(store.choices)
    const source = path.findIndex((n) => n.id === data.sourceId)
    if (
      data.sourceId &&
      data.choiceId &&
      store.choices[data.sourceId] &&
      store.choices[data.sourceId] !== data.choiceId &&
      path.slice(source + 1).some((n) => store.completedNodeIds.includes(n.id))
    )
      setConfirm(true)
    else apply()
  }
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <button
        className={`flow-node nodrag ${data.active ? 'flow-node-active' : ''} ${data.available ? 'flow-node-available' : ''}`}
        aria-pressed={data.active}
        disabled={!data.onPath && !data.available}
        onClick={select}
      >
        <Icon
          className={data.done ? 'text-success' : 'text-react'}
          aria-hidden="true"
        />
        <span>
          <span className="block">{data.title}</span>
          <small className="mt-2 block text-violet">
            {data.choiceLabel ??
              (data.onPath ? TREE_COPY.jump : TREE_COPY.locked)}
          </small>
        </span>
      </button>
      <Handle type="source" position={Position.Bottom} />
      <ConfirmationDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={JOURNEY_COPY.changeTitle}
        description={JOURNEY_COPY.changeDescription}
        onConfirm={apply}
      />
    </>
  )
}
