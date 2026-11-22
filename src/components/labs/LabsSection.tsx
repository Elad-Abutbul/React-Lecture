import { useState } from 'react'
import { Tabs } from 'radix-ui'
import { LABS_COPY, LAB_STATIONS } from '@/content/labs'
import { WORLD_COPY } from '@/constants/world'
import { CodeBlock } from '@/components/lessons/CodeBlock'
import { useWideLayout } from '@/hooks/useWideLayout'
import { Step01Components } from './Step01Components'
import { Step02Props } from './Step02Props'
import { Step03State } from './Step03State'
import { Step04Effect } from './Step04Effect'
const DEMOS = {
  components: Step01Components,
  props: Step02Props,
  state: Step03State,
  effect: Step04Effect,
}
export function LabsSection() {
  const [stationId, setStationId] = useState<string>(LAB_STATIONS[0].id)
  const station = LAB_STATIONS.find((s) => s.id === stationId)!
  const Demo = DEMOS[station.id]
  const wide = useWideLayout()
  return (
    <article className="focus-content learning-focus">
      <h1 className="focus-title">{LABS_COPY.title}</h1>
      <Tabs.Root
        dir="rtl"
        value={stationId}
        onValueChange={setStationId}
        data-gesture-ignore
      >
        <Tabs.List aria-label={LABS_COPY.stations} className="scene-tabs">
          {LAB_STATIONS.map((s) => (
            <Tabs.Trigger key={s.id} value={s.id}>
              {s.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <p dir="ltr" className="mb-4 font-mono text-sm text-violet">
          {station.filename}
        </p>
        {wide ? (
          <div className="lesson-grid">
            <div>
              <Demo key={station.id} />
            </div>
            <CodeBlock code={station.code} />
          </div>
        ) : (
          <Tabs.Root dir="rtl" defaultValue="demo" key={station.id}>
            <Tabs.List className="scene-tabs">
              <Tabs.Trigger value="demo">{WORLD_COPY.demo}</Tabs.Trigger>
              <Tabs.Trigger value="code">{WORLD_COPY.code}</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="demo">
              <Demo />
            </Tabs.Content>
            <Tabs.Content value="code">
              <CodeBlock code={station.code} />
            </Tabs.Content>
          </Tabs.Root>
        )}
      </Tabs.Root>
      <p className="mt-4 text-xs text-muted">{LABS_COPY.description}</p>
    </article>
  )
}
