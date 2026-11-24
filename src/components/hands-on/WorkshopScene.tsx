import { useEffect } from 'react'
import { HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { useHandsOnStore } from '@/store/hands-on-store'
import { ExerciseNode } from './ExerciseNode'
import { CleanupDemo } from '../demos/CleanupDemo'
import { CLEANUP_SOLUTION } from '@/content/handsOnSolutions'
import { CodeSnippet } from './CodeSnippet'
export function WorkshopScene({
  id,
  active = true,
}: {
  id: string
  active?: boolean
}) {
  const plan = id === 'plan-90' ? 90 : 120
  useEffect(() => {
    if (active && id.startsWith('plan-'))
      useHandsOnStore.getState().setPlan(plan)
  }, [id, plan, active])
  if (id === 'cleanup')
    return (
      <>
        <CleanupDemo />
        <CodeSnippet code={CLEANUP_SOLUTION} filename="CleanupDemo.tsx" />
      </>
    )
  if (id.startsWith('plan-'))
    return (
      <p className="text-violet">
        {plan === 90 ? COPY.planNote : COPY.classCheck}
      </p>
    )
  if (id.startsWith('summary-'))
    return <p className="text-muted">{COPY.local}</p>
  return <ExerciseNode key={id} id={id} active={active} />
}
