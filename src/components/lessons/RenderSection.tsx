import { useState } from 'react'
import { SnapshotDemo } from '@/components/demos/SnapshotDemo'
import { RENDER_PHASES, SNAPSHOT_UI } from '@/content/lessons'
import { Button } from '@/components/ui/button'
export function RenderSection() {
  const [phase, setPhase] = useState(0)
  return (
    <>
      <SnapshotDemo />
      <div className="mt-5" data-gesture-ignore>
        <p className="text-sm text-muted">{SNAPSHOT_UI.timeline}</p>
        <ol className="my-2 grid grid-cols-4 gap-2" dir="ltr">
          {RENDER_PHASES.map((item, index) => (
            <li key={item.title}>
              <Button
                variant={phase === index ? 'secondary' : 'ghost'}
                onClick={() => setPhase(index)}
                aria-pressed={phase === index}
              >
                {item.title}
              </Button>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted">{RENDER_PHASES[phase].body}</p>
      </div>
    </>
  )
}
