import { Reveal } from '@/components/motion/Reveal'
import type { ReactNode } from 'react'
import { SECTIONS } from '@/constants/navigation'
export function Section({
  id,
  children,
}: {
  id: (typeof SECTIONS)[number]['id']
  children: ReactNode
}) {
  const section = SECTIONS.find((s) => s.id === id)!
  return (
    <Reveal>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        className="section page-width"
      >
        <div className="section-heading">
          <p className="eyebrow">{section.caption}</p>
          <h2 id={`${id}-title`}>{section.label}</h2>
        </div>
        {children}
      </section>
    </Reveal>
  )
}
