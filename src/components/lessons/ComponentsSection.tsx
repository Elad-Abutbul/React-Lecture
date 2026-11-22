import { useState } from 'react'
import { COMPONENTS, COMPONENT_UI } from '@/content/lessons'
import { Button } from '@/components/ui/button'
import { LessonSection } from './LessonSection'
function Welcome() {
  return (
    <div className="rounded-xl border border-react/25 bg-react/5 p-4 text-react">
      {COMPONENT_UI.greeting}
    </div>
  )
}
export function ComponentsDemo() {
  const [instances, setInstances] = useState<number>(COMPONENT_UI.initial)
  return (
    <>
      <p className="mb-4 text-sm text-muted">
        {instances} {COMPONENT_UI.instances}
      </p>
      <div className="grid gap-3">
        {Array.from({ length: instances }, (_, index) => (
          <Welcome key={index} />
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={() => setInstances((n) => n + 1)}
          disabled={instances >= COMPONENT_UI.max}
        >
          {COMPONENT_UI.add}
        </Button>
        <Button
          variant="outline"
          onClick={() => setInstances((n) => n - 1)}
          disabled={instances <= COMPONENT_UI.min}
        >
          {COMPONENT_UI.remove}
        </Button>
      </div>
    </>
  )
}
export function ComponentsSection() {
  return (
    <LessonSection lesson={COMPONENTS}>
      <ComponentsDemo />
    </LessonSection>
  )
}
