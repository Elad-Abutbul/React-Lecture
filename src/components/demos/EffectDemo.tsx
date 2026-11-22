import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { COUNTER_CONFIG, EFFECT_UI } from '@/content/lessons'
export function EffectDemo() {
  const [count, setCount] = useState<number>(COUNTER_CONFIG.initial)
  useEffect(() => {
    const previousTitle = document.title
    document.title = EFFECT_UI.prefix + count
    return () => {
      document.title = previousTitle
    }
  }, [count])
  return (
    <>
      <output className="demo-number">{count}</output>
      <Button onClick={() => setCount((prev) => prev + COUNTER_CONFIG.step)}>
        {EFFECT_UI.increment}
      </Button>
      <p className="mt-4 text-sm text-muted">
        {EFFECT_UI.title}:{' '}
        <bdi className="text-react">
          {EFFECT_UI.prefix}
          {count}
        </bdi>
      </p>
    </>
  )
}
