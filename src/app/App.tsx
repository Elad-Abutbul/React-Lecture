import { AppShell } from '@/components/layout/AppShell'
import { Hero } from '@/components/layout/Hero'
import { Section } from '@/components/layout/Section'
import { HERO } from '@/content/hero'
export default function App() {
  return (
    <AppShell>
      <Hero />
      <Section id="journey">
        <p className="text-xl text-muted">{HERO.setup}</p>
      </Section>
    </AppShell>
  )
}
