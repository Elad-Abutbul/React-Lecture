import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TIMER_UI } from '@/content/lessons'
function Timer() {
  const [seconds, setSeconds] = useState<number>(TIMER_UI.initial)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(
      () => setSeconds((prev) => prev + 1),
      TIMER_UI.tickMs,
    )
    return () => window.clearInterval(id)
  }, [running])
  return (
    <>
      <p className="text-sm text-muted" role="status">
        {running ? TIMER_UI.active : TIMER_UI.paused}
      </p>
      <output className="demo-number" aria-label={TIMER_UI.seconds}>
        {seconds}
      </output>
      <Button onClick={() => setRunning((value) => !value)}>
        {running ? TIMER_UI.stop : TIMER_UI.start}
      </Button>
    </>
  )
}
export function CleanupDemo() {
  const [mounted, setMounted] = useState(true)
  return (
    <>
      {mounted ? (
        <Timer />
      ) : (
        <p className="py-8 text-success" role="status">
          {TIMER_UI.removed}
        </p>
      )}
      <Button
        variant="outline"
        className="ms-3"
        onClick={() => setMounted((value) => !value)}
      >
        {mounted ? TIMER_UI.remove : TIMER_UI.mount}
      </Button>
    </>
  )
}
