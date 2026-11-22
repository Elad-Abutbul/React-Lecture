import { NAV_COPY, SECTIONS } from '@/constants/navigation'
export function Footer() {
  return (
    <footer className="page-width flex flex-wrap items-center justify-between gap-6 border-t border-border py-10 text-sm text-muted">
      <p>{NAV_COPY.footer}</p>
      <a href={`#${SECTIONS[0].id}`} className="text-react">
        {NAV_COPY.back}
      </a>
    </footer>
  )
}
