import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { FILES, FILE_COPY } from '@/content/files'
import { FileDetails } from '@/components/lessons/FileDetails'
export function WorldFiles() {
  const [fileId, setFileId] = useState<string>(FILES[0].id)
  const file = FILES.find((f) => f.id === fileId)!
  return (
    <article className="focus-content world-files">
      <h1 className="focus-title">{FILE_COPY.tree}</h1>
      <p className="focus-description">{FILE_COPY.intro}</p>
      <Tabs.Root
        dir="rtl"
        value={fileId}
        onValueChange={setFileId}
        data-gesture-ignore
      >
        <Tabs.List aria-label={FILE_COPY.tree} className="world-file-tabs">
          {FILES.map((file) => (
            <Tabs.Trigger key={file.id} value={file.id} className="file-tab">
              <bdi>{file.path}</bdi>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <FileDetails file={file} />
      </Tabs.Root>
    </article>
  )
}
