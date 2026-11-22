import { useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { COMMANDS, type CommandId } from '@/constants/commands'
import { JOURNEY_COPY } from '@/content/journey'
import { Button } from '@/components/ui/button'
export function CommandCard({ commandId }: { commandId: CommandId }) {
  const command = COMMANDS[commandId]
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  async function copy() {
    try {
      await navigator.clipboard.writeText(command.code)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }
  return (
    <div className="command-card">
      <div className="flex items-center justify-between gap-3 border-b border-border p-3">
        <span className="font-mono text-xs text-muted" dir="ltr">
          {commandId}
        </span>
        <Button variant="ghost" onClick={copy} aria-label={JOURNEY_COPY.copy}>
          {status === 'copied' ? (
            <Check aria-hidden="true" />
          ) : (
            <Clipboard aria-hidden="true" />
          )}
          {status === 'copied' ? JOURNEY_COPY.copied : JOURNEY_COPY.copy}
        </Button>
      </div>
      <pre
        dir="ltr"
        className="overflow-x-auto p-5 text-start text-sm text-react"
      >
        <code>{command.code}</code>
      </pre>
      <div className="border-t border-border p-4 text-sm text-muted">
        <p>{command.description}</p>
        <p className="mt-3">
          <strong className="text-text">{JOURNEY_COPY.expected} </strong>
          {command.expected}
        </p>
      </div>
      <p role="status" className="px-4 text-sm text-warning">
        {status === 'error'
          ? JOURNEY_COPY.copyFailed
          : status === 'copied'
            ? JOURNEY_COPY.copied
            : null}
      </p>
    </div>
  )
}
