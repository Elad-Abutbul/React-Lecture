import { ProgressRail } from './ProgressRail'
import type { ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Header } from './Header'
import { Footer } from './Footer'
import { NAV_COPY } from '@/constants/navigation'
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <a className="skip-link" href="#main">
        {NAV_COPY.skip}
      </a>
      <Header />
      <ProgressRail />
      <main id="main">{children}</main>
      <Footer />
    </TooltipProvider>
  )
}
