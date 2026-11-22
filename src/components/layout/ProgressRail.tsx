import { ACTIVE_NAVIGATION, NAV_COPY } from '@/constants/navigation'
import { JOURNEY_COPY } from '@/content/journey'
import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { useActiveSection } from '@/hooks/useActiveSection'
import { Progress } from '@/components/ui/progress'
export function ProgressRail() {
  const choices = useJourneyStore((s) => s.choices)
  const completed = useJourneyStore((s) => s.completedNodeIds)
  const active = useActiveSection()
  const path = getActivePath(choices)
  const count = path.filter((n) => completed.includes(n.id)).length
  const value = Math.round((count / path.length) * 100)
  return (
    <div className="progress-rail">
      <div className="page-width rail-inner">
        <nav
          aria-label={NAV_COPY.landmark}
          className="flex min-w-0 gap-5 overflow-x-auto py-3 text-sm"
        >
          {ACTIVE_NAVIGATION.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? 'location' : undefined}
              className={`shrink-0 ${active === section.id ? 'text-react' : 'text-muted'}`}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <span className="text-muted">{JOURNEY_COPY.progress}</span>
          <span className="font-mono text-react" dir="ltr">
            {value}%
          </span>
          <Progress
            className="w-20"
            value={value}
            aria-label={JOURNEY_COPY.progress}
          />
        </div>
      </div>
    </div>
  )
}
