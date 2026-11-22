import type { CommandId } from '@/constants/commands'
export type Choice = {
  id: string
  label: string
  nextNodeId: string
  retry?: boolean
  complete?: boolean
}
export type Command = {
  id: CommandId
  code: string
  description: string
  expected: string
}
export type Checkpoint = { commandIds: readonly CommandId[]; manual: true }
export type JourneyNode = {
  id: string
  kind:
    | 'question'
    | 'command'
    | 'explanation'
    | 'checkpoint'
    | 'success'
    | 'errorHelp'
  title: string
  description: string
  choices: readonly Choice[]
  commandId?: CommandId
  checkpoint?: Checkpoint
  helpUrl?: string
  helpKey?: 'node' | 'browser'
}
export type Choices = Record<string, string>
