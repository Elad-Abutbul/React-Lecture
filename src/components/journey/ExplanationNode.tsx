import type { JourneyNode } from '@/types/journey'
import { NodeFrame } from './NodeFrame'
import { JOURNEY_COPY } from '@/content/journey'
import { LINKS, TOOL_NAMES } from '@/constants/links'
export function ExplanationNode({ node }: { node: JourneyNode }) {
  return (
    <NodeFrame node={node}>
      {node.helpUrl && (
        <a
          className="mt-4 inline-block text-react underline"
          href={node.helpUrl}
          target="_blank"
          rel="noreferrer"
        >
          {JOURNEY_COPY.help}
        </a>
      )}
      {node.id === 'tools' && (
        <nav aria-label={JOURNEY_COPY.optional} className="mt-4 flex gap-4">
          <a
            href={LINKS.vscode}
            target="_blank"
            rel="noreferrer"
            className="text-react underline"
          >
            {TOOL_NAMES.vscode}
          </a>
          <a
            href={LINKS.git}
            target="_blank"
            rel="noreferrer"
            className="text-react underline"
          >
            {TOOL_NAMES.git}
          </a>
        </nav>
      )}
      {node.kind === 'success' && (
        <a href="#files" className="mt-5 inline-block text-react underline">
          {JOURNEY_COPY.files}
        </a>
      )}
    </NodeFrame>
  )
}
