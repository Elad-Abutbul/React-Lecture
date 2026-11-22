import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { COMMANDS, type CommandId } from '@/constants/commands'
import { JOURNEY_COPY } from '@/content/journey'
import { Button } from '@/components/ui/button'
export function SceneConsole({ commandId }: { commandId: CommandId }) {
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
    <div className="scene-console" data-command={commandId}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted" dir="ltr">
          {commandId}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          aria-label={`${JOURNEY_COPY.copy}: ${command.code}`}
        >
          {status === 'copied' ? (
            <Check aria-hidden="true" />
          ) : (
            <Copy aria-hidden="true" />
          )}
          {status === 'copied' ? JOURNEY_COPY.copied : JOURNEY_COPY.copy}
        </Button>
      </div>
      <pre dir="ltr">
        <code>{command.code}</code>
      </pre>
      <p className="scene-expected">{command.expected}</p>
      <p className="text-sm text-warning" role="status">
        {status === 'error'
          ? JOURNEY_COPY.copyFailed
          : status === 'copied'
            ? JOURNEY_COPY.copied
            : null}
      </p>
    </div>
  )
}
