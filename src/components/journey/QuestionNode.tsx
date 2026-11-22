import type { JourneyNode } from '@/types/journey'
import { NodeFrame } from './NodeFrame'
export function QuestionNode({ node }: { node: JourneyNode }) {
  return <NodeFrame node={node} />
}
