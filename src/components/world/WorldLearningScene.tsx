import { useState, useId } from 'react'
import { Tabs } from 'radix-ui'
import { LEARNING_SCENES } from '@/content/learningScenes'
import { ImperativeVsDeclarative } from '@/components/demos/ImperativeVsDeclarative'
import { ComponentsDemo } from '@/components/lessons/ComponentsSection'
import { KnowledgeCheck } from '@/components/lessons/KnowledgeCheck'
import { CodeBlock } from '@/components/lessons/CodeBlock'
import { COMPONENT_UI, TOOL_ROLES } from '@/content/lessons'
import { WORLD_COPY } from '@/constants/world'
import { WorldFiles } from './WorldFiles'
function JsxDemo() {
  const id = useId()
  const [name, setName] = useState<string>(COMPONENT_UI.defaultName)
  return (
    <>
      <label htmlFor={id}>{COMPONENT_UI.name}</label>
      <input
        className="field"
        id={id}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h3 className="text-3xl text-react">
        {COMPONENT_UI.hello}
        {name}
      </h3>
      <ul className="mt-5 space-y-2 text-sm text-muted">
        {COMPONENT_UI.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </>
  )
}
function ToolRoles() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {TOOL_ROLES.map((tool) => (
        <div key={tool.name}>
          <h3 className="text-4xl text-react">{tool.name}</h3>
          <p className="mt-3 text-violet">{tool.role}</p>
          <p className="mt-3 text-muted">{tool.description}</p>
        </div>
      ))}
    </div>
  )
}
const DEMOS: Record<string, () => React.ReactNode> = {
  declarative: ImperativeVsDeclarative,
  'react-vite': ToolRoles,
  components: ComponentsDemo,
  jsx: JsxDemo,
}
export function WorldLearningScene({ id }: { id: string }) {
  if (id === 'files') return <WorldFiles />
  const scene = LEARNING_SCENES.find((s) => s.id === id)
  if (!scene?.lesson) return null
  const lesson = scene.lesson
  const Demo = DEMOS[id]
  return (
    <article className="focus-content learning-focus">
      <h1 className="focus-title">{lesson.title}</h1>
      <Tabs.Root dir="rtl" defaultValue="demo" data-gesture-ignore>
        <Tabs.List className="scene-tabs" aria-label={WORLD_COPY.panels}>
          <Tabs.Trigger value="demo">{WORLD_COPY.demo}</Tabs.Trigger>
          <Tabs.Trigger value="code">{WORLD_COPY.code}</Tabs.Trigger>
          <Tabs.Trigger value="check">{WORLD_COPY.check}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="demo">
          <p className="focus-description">{lesson.body}</p>
          {Demo && <Demo />}
        </Tabs.Content>
        <Tabs.Content value="code">
          <CodeBlock code={lesson.code} />
        </Tabs.Content>
        <Tabs.Content value="check">
          <KnowledgeCheck question={lesson.check} />
        </Tabs.Content>
      </Tabs.Root>
    </article>
  )
}
