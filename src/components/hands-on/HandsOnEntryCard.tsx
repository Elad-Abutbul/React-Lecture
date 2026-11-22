import { HANDS_ON_COPY as COPY } from '@/constants/handsOn'
export function HandsOnEntryCard() {
  return (
    <aside className="hands-on-entry">
      <h2>{COPY.entry}</h2>
      <p>{COPY.longPlan}</p>
      <p className="text-xs text-muted">{COPY.local}</p>
    </aside>
  )
}
