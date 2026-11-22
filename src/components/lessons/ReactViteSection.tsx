import { REACT_VITE, TOOL_ROLES } from '@/content/lessons'
import { LessonSection } from './LessonSection'
export function ReactViteSection() {
  return (
    <LessonSection lesson={REACT_VITE}>
      <div className="grid gap-4">
        {TOOL_ROLES.map((tool) => (
          <div key={tool.name} className="rounded-xl border border-border p-5">
            <h4 className="flex justify-between gap-3 text-xl text-react">
              <bdi>{tool.name}</bdi>
              <span className="text-sm text-muted">{tool.role}</span>
            </h4>
            <p className="mt-3 text-muted">{tool.description}</p>
          </div>
        ))}
      </div>
    </LessonSection>
  )
}
