import { APP_CONTENT } from '@/content/app'
import { AppShell } from '@/components/layout/AppShell'
export default function App() {
  return (
    <AppShell>
      <section id="start" className="section page-width">
        <h1 className="text-5xl text-react">{APP_CONTENT.title}</h1>
        <p className="mt-6 text-xl text-muted">{APP_CONTENT.description}</p>
      </section>
    </AppShell>
  )
}
