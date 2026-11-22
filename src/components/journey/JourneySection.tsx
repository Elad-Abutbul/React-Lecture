import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
import { JOURNEY_COPY } from '@/content/journey'
import { useJourneyStore } from '@/store/journey-store'
import { MobileJourney } from './MobileJourney'
export function JourneySection() {
  const [resetOpen, setResetOpen] = useState(false)
  const reset = useJourneyStore((s) => s.reset)
  return (
    <Section id="journey">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-muted">{JOURNEY_COPY.choose}</p>
        <Button variant="ghost" onClick={() => setResetOpen(true)}>
          <RotateCcw aria-hidden="true" />
          {JOURNEY_COPY.reset}
        </Button>
      </div>
      <MobileJourney />
      <ConfirmationDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={JOURNEY_COPY.resetTitle}
        description={JOURNEY_COPY.resetDescription}
        onConfirm={reset}
      />
    </Section>
  )
}
