import { Section } from '@/components/layout/Section'
import { LessonSection } from './LessonSection'
import { ImperativeVsDeclarative } from '@/components/demos/ImperativeVsDeclarative'
import { WHY_REACT } from '@/content/lessons'
export function WhyReactSection() {
  return (
    <Section id="why-react">
      <LessonSection lesson={WHY_REACT}>
        <ImperativeVsDeclarative />
      </LessonSection>
    </Section>
  )
}
