import { useState } from 'react'
import { HANDS_ON, HANDS_ON_COPY as COPY } from '@/constants/handsOn'
import { Button } from '../ui/button'
export function CodeSnippet({
  code,
  filename,
}: {
  code: string
  filename: string
}) {
  const [status, setStatus] = useState('')
  const lines = code.split('\n'),
    excerpt = lines.slice(0, HANDS_ON.previewLines).join('\n')
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus(COPY.copied)
    } catch {
      setStatus(COPY.copyFailed)
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([code], { type: 'text/plain;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = filename.split('/').at(-1)!
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="workshop-code">
      <bdi className="text-sm text-violet">{filename}</bdi>
      <pre dir="ltr" tabIndex={0}>
        <code>{excerpt}</code>
      </pre>
      {lines.length > HANDS_ON.previewLines && (
        <p className="text-xs text-muted">{COPY.excerpt}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copy}>
          {COPY.copy}
        </Button>
        <Button variant="ghost" size="sm" onClick={download}>
          {COPY.download}
        </Button>
      </div>
      <p role="status" className="text-xs text-muted">
        {status}
      </p>
    </div>
  )
}
