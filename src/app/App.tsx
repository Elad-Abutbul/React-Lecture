import { WhyReactSection } from '@/components/lessons/WhyReactSection'
import { AppShell } from '@/components/layout/AppShell'
import { Hero } from '@/components/layout/Hero'
import { JourneySection } from '@/components/journey/JourneySection'
export default function App() {
  return (
    <AppShell>
      <Hero />
      <WhyReactSection />
      <JourneySection />
    </AppShell>
  )
}
