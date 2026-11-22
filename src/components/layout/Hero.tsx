import { Play, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO } from '@/content/hero'
import { SECTIONS } from '@/constants/navigation'
export function Hero() {
  return (
    <section
      id="start"
      className="hero page-width"
      aria-labelledby="hero-title"
    >
      <div className="hero-copy">
        <p className="eyebrow">{HERO.kicker}</p>
        <h1 id="hero-title">{HERO.title}</h1>
        <p className="hero-description">{HERO.description}</p>
        <div className="my-8 flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-7 text-base"
          >
            <a href={`#${SECTIONS[2].id}`}>
              <Play aria-hidden="true" />
              {HERO.cta}
            </a>
          </Button>
          <span className="flex items-center gap-2 text-sm text-muted">
            <Check aria-hidden="true" className="size-4 text-success" />
            {HERO.note}
          </span>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted">
          <span>{HERO.time}</span>
          <span dir="ltr">{HERO.stack}</span>
        </div>
      </div>
      <div className="atom-stage" aria-hidden="true">
        <div className="atom-halo" />
        <svg viewBox="0 0 400 400" className="atom">
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="200" cy="200" rx="166" ry="58" />
            <ellipse
              cx="200"
              cy="200"
              rx="166"
              ry="58"
              transform="rotate(60 200 200)"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="166"
              ry="58"
              transform="rotate(120 200 200)"
            />
          </g>
          <circle cx="200" cy="200" r="17" fill="currentColor" />
        </svg>
        <span className="atom-label" dir="ltr">
          {HERO.stack}
        </span>
      </div>
      <ol className="hero-route">
        {HERO.steps.map((step) => (
          <li key={step}>
            <span className="route-dot" />
            {step}
          </li>
        ))}
      </ol>
    </section>
  )
}
