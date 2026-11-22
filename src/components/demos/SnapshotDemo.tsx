import { useState } from 'react'
import { COUNTER_CONFIG, SNAPSHOT_UI } from '@/content/lessons'
import { Button } from '@/components/ui/button'
export function SnapshotDemo() {
  const [count, setCount] = useState<number>(COUNTER_CONFIG.initial)
  const [before, setBefore] = useState<number | null>(null)
  function update(times: number) {
    setBefore(count)
    for (let i = 0; i < times; i++)
      setCount((prev) => prev + COUNTER_CONFIG.step)
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <span className="text-sm text-muted">{SNAPSHOT_UI.before}</span>
          <output aria-label={SNAPSHOT_UI.before} className="demo-number">
            {before ?? SNAPSHOT_UI.empty}
          </output>
        </div>
        <div>
          <span className="text-sm text-muted">{SNAPSHOT_UI.after}</span>
          <output aria-label={SNAPSHOT_UI.after} className="demo-number">
            {count}
          </output>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => update(COUNTER_CONFIG.step)}>
          {SNAPSHOT_UI.single}
        </Button>
        <Button
          variant="outline"
          className="h-auto min-h-11 whitespace-normal"
          onClick={() => update(SNAPSHOT_UI.batch)}
        >
          {SNAPSHOT_UI.batchLabel}
        </Button>
      </div>
    </>
  )
}
