import { useState } from 'react'
import { JSX, COMPONENT_UI } from '@/content/lessons'
import { LessonSection } from './LessonSection'
export function JsxSection() {
  const [name, setName] = useState<string>(COMPONENT_UI.defaultName)
  return (
    <LessonSection lesson={JSX}>
      <label htmlFor="jsx-name">{COMPONENT_UI.name}</label>
      <input
        id="jsx-name"
        className="field"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <h4 className="my-5 text-2xl text-react">
        {COMPONENT_UI.hello}
        {name}
      </h4>
      <ul className="space-y-3 text-sm text-muted">
        {COMPONENT_UI.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </LessonSection>
  )
}
