import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { DecisionNode } from './DecisionNode'
export function MobileJourney() {
  const choices = useJourneyStore((s) => s.choices)
  return (
    <ol className="journey-list">
      {getActivePath(choices).map((node) => (
        <li key={node.id}>
          <DecisionNode node={node} />
        </li>
      ))}
    </ol>
  )
}
