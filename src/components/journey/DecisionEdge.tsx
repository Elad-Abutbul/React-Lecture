import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react'
export function DecisionEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props)
  return <BaseEdge id={props.id} path={path} className="journey-edge" />
}
