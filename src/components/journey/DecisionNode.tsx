import type { JourneyNode } from '@/types/journey'
import { QuestionNode } from './QuestionNode'
import { ExplanationNode } from './ExplanationNode'
import { CommandNode } from './CommandNode'
import { CheckpointNode } from './CheckpointNode'
import { ErrorHelpNode } from './ErrorHelpNode'
const RENDERERS = {
  question: QuestionNode,
  explanation: ExplanationNode,
  command: CommandNode,
  checkpoint: CheckpointNode,
  errorHelp: ErrorHelpNode,
  success: ExplanationNode,
} as const
export function DecisionNode({ node }: { node: JourneyNode }) {
  const Component = RENDERERS[node.kind]
  return <Component node={node} />
}
