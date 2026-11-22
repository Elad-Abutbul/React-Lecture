import { Section } from '@/components/layout/Section'
import { ComponentsSection } from './ComponentsSection'
import { JsxSection } from './JsxSection'
export function FoundationsSection() {
  return (
    <Section id="foundations">
      <ComponentsSection />
      <JsxSection />
    </Section>
  )
}
