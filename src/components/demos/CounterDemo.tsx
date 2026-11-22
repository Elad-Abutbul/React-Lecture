/* eslint-disable react-hooks/immutability -- This isolated teaching demo intentionally contrasts the local-variable anti-pattern with a functional State update. */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { COUNTER_CONFIG, STATE_UI } from '@/content/lessons'
export function CounterDemo() {
  const [count, setCount] = useState<number>(COUNTER_CONFIG.initial)
  let ordinary: number = COUNTER_CONFIG.initial
  function incrementOrdinary() {
    ordinary += COUNTER_CONFIG.step
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-react">{STATE_UI.state}</h3>
          <output className="demo-number" aria-label={STATE_UI.stateValue}>
            {count}
          </output>
          <Button
            onClick={() => setCount((prev) => prev + COUNTER_CONFIG.step)}
          >
            {STATE_UI.addState}
          </Button>
        </div>
        <div>
          <h3 className="text-sm text-muted">{STATE_UI.plain}</h3>
          <output className="demo-number" aria-label={STATE_UI.plainValue}>
            {ordinary}
          </output>
          <Button
            variant="outline"
            className="h-auto min-h-11 whitespace-normal"
            onClick={incrementOrdinary}
          >
            {STATE_UI.addPlain}
          </Button>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">{STATE_UI.note}</p>
      <Button
        variant="ghost"
        className="mt-3"
        onClick={() => setCount(COUNTER_CONFIG.initial)}
      >
        {STATE_UI.reset}
      </Button>
    </>
  )
}
