import { useState } from 'react'
import type { JourneyNode } from '@/types/journey'
import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { JOURNEY_COPY } from '@/content/journey'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
export function NodeChoices({ node }: { node: JourneyNode }) {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const choose = useJourneyStore((s) => s.choose)
  const [pending, setPending] = useState<string | null>(null)
  function select(id: string) {
    const path = getActivePath(choices)
    const index = path.findIndex((n) => n.id === node.id)
    if (
      choices[node.id] &&
      choices[node.id] !== id &&
      path.slice(index + 1).some((n) => completed.includes(n.id))
    )
      setPending(id)
    else choose(node.id, id)
  }
  return (
    <>
      <div className="mt-6 flex flex-wrap gap-3">
        {node.choices.map((c) => (
          <Button
            key={c.id}
            className="h-auto min-h-11 whitespace-normal text-start"
            variant={choices[node.id] === c.id ? 'default' : 'outline'}
            aria-pressed={choices[node.id] === c.id}
            aria-expanded={choices[node.id] === c.id}
            onClick={() => select(c.id)}
          >
            {c.label}
          </Button>
        ))}
      </div>
      <ConfirmationDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
        title={JOURNEY_COPY.changeTitle}
        description={JOURNEY_COPY.changeDescription}
        onConfirm={() => {
          if (pending) choose(node.id, pending)
        }}
      />
    </>
  )
}
