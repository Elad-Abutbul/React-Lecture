export type Point = { x: number; y: number }
export type WorldEdge = {
  id: string
  target: string
  label: string
  direction: 'left' | 'right' | 'forward'
}
export type WorldNode = {
  id: string
  title: string
  description: string
  kind:
    | 'installation'
    | 'decision'
    | 'lesson'
    | 'file'
    | 'lab'
    | 'code'
    | 'feedback'
    | 'workshop'
    | 'resources'
  position: Point
  edges: WorldEdge[]
  sourceId?: string
  part?: 'demo' | 'code'
  commandIds?: string[]
  helpUrl?: string
}
