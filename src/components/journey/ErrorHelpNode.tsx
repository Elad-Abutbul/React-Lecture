import type { JourneyNode } from '@/types/journey'
import { NodeFrame } from './NodeFrame'
import { TROUBLESHOOTING } from '@/content/troubleshooting'
export function ErrorHelpNode({ node }: { node: JourneyNode }) {
  return (
    <NodeFrame node={node}>
      <ul className="mt-5 space-y-4">
        {TROUBLESHOOTING[node.helpKey ?? 'browser'].map((tip) => (
          <li
            key={tip.title}
            className="rounded-xl border border-warning/25 p-4"
          >
            <h4 className="text-warning">{tip.title}</h4>
            <p className="mt-2 text-sm text-muted">{tip.body}</p>
          </li>
        ))}
      </ul>
    </NodeFrame>
  )
}
