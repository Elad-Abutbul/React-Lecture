import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LESSON_UI, COUNTER_CONFIG } from '@/content/lessons'
export function ImperativeVsDeclarative() {
  const manualCount = useRef<number>(COUNTER_CONFIG.initial)
  const label = useRef<HTMLOutputElement>(null)
  const [count, setCount] = useState<number>(COUNTER_CONFIG.initial)
  function manual() {
    manualCount.current += COUNTER_CONFIG.step
    if (label.current) label.current.textContent = String(manualCount.current)
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h4 dir="ltr" className="text-sm text-muted">
          {LESSON_UI.manual}
        </h4>
        <output ref={label} className="demo-number">
          {COUNTER_CONFIG.initial}
        </output>
        <Button variant="outline" onClick={manual}>
          {LESSON_UI.increment}
        </Button>
      </div>
      <div>
        <h4 dir="ltr" className="text-sm text-react">
          {LESSON_UI.react}
        </h4>
        <output className="demo-number">{count}</output>
        <Button onClick={() => setCount((n) => n + COUNTER_CONFIG.step)}>
          {LESSON_UI.increment}
        </Button>
      </div>
    </div>
  )
}
