import { ExternalLink } from 'lucide-react'
import { LEARNING_REFERENCES, REFERENCES_COPY } from '@/constants/links'
export function Footer() {
  return (
    <nav aria-label={REFERENCES_COPY.navigation}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {LEARNING_REFERENCES.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-between gap-3 border-b border-border py-3 text-react"
            >
              {link.label}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
