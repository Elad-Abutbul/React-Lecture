import { CheckCircle2, Circle } from 'lucide-react'
import { useJourneyStore } from '@/store/journey-store'
import { JOURNEY_COPY } from '@/content/journey'
export function NodeStatus({ id }: { id: string }) {
  const completed = useJourneyStore((s) => s.completedNodeIds.includes(id))
  const current = useJourneyStore((s) => s.currentNodeId === id)
  const Icon = completed ? CheckCircle2 : Circle
  return (
    <span
      className={`mb-4 flex items-center gap-2 text-sm ${completed ? 'text-success' : current ? 'text-react' : 'text-muted'}`}
    >
      <Icon className="size-4" aria-hidden="true" />
      {completed
        ? JOURNEY_COPY.completed
        : current
          ? JOURNEY_COPY.current
          : JOURNEY_COPY.pending}
    </span>
  )
}
