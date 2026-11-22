import { Atom } from 'lucide-react'
import { NAV_COPY, SECTIONS } from '@/constants/navigation'
export function Header() {
  return (
    <header className="site-header">
      <div className="page-width flex items-center justify-between gap-4 py-5">
        <a href={`#${SECTIONS[0].id}`} className="brand" dir="ltr">
          <Atom aria-hidden="true" className="text-react" />
          {NAV_COPY.brand}
        </a>
        <span className="hidden text-sm text-muted sm:block">
          {NAV_COPY.edition}
        </span>
      </div>
    </header>
  )
}
