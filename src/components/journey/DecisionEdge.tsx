import { getSmoothStepPath, type EdgeProps } from '@xyflow/react'
export function DecisionEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props)
  const active = props.data?.active
  const available = props.data?.available
  return (
    <path
      d={path}
      pathLength={1}
      className={`react-flow__edge-path spatial-edge ${active ? 'spatial-edge-active' : available ? 'spatial-edge-available' : ''}`}
    />
  )
}
