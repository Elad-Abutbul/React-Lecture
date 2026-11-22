import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { FileCode2 } from 'lucide-react'
import { FILES, FILE_COPY } from '@/content/files'
import { Section } from '@/components/layout/Section'
import { FileDetails } from './FileDetails'
import { KnowledgeCheck } from './KnowledgeCheck'
export function FileTreeSection() {
  const [selected, setSelected] = useState<string>(FILES[0].id)
  return (
    <Section id="files">
      <p className="mb-6 max-w-3xl text-muted">{FILE_COPY.intro}</p>
      <p
        dir="ltr"
        className="mb-8 overflow-x-auto font-mono text-sm text-react"
      >
        {FILE_COPY.trace}
      </p>
      <Tabs.Root
        dir="rtl"
        orientation="vertical"
        value={selected}
        onValueChange={setSelected}
        className="file-explorer"
      >
        <Tabs.List aria-label={FILE_COPY.tree} className="file-list">
          <p className="mb-4 p-3 font-mono text-muted" dir="ltr">
            {FILE_COPY.root}
          </p>
          {FILES.map((file) => (
            <Tabs.Trigger key={file.id} value={file.id} className="file-tab">
              <FileCode2 className="size-4 shrink-0" aria-hidden="true" />
              <bdi>{file.path}</bdi>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className="min-w-0 p-6">
          {FILES.map((file) => (
            <Tabs.Content key={file.id} value={file.id}>
              <FileDetails file={file} />
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
      <KnowledgeCheck question={FILE_COPY.check} />
    </Section>
  )
}
