import { useId, useState } from 'react'
import { PROPS_UI } from '@/content/lessons'
function Greeting({ name }: { readonly name: string }) {
  return (
    <h3 className="rounded-xl border border-react/25 bg-react/5 p-5 text-2xl text-react">
      {PROPS_UI.greeting}
      {name}
    </h3>
  )
}
export function PropsDemo() {
  const id = useId()
  const [name, setName] = useState<string>(PROPS_UI.initial)
  return (
    <>
      <label htmlFor={id}>{PROPS_UI.label}</label>
      <input
        id={id}
        className="field"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p className="mb-3 text-sm text-muted">{PROPS_UI.child}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Greeting name={name} />
        <Greeting name={PROPS_UI.second} />
      </div>
    </>
  )
}
