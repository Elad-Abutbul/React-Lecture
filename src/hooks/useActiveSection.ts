import { useEffect, useState } from 'react'
import { SECTIONS } from '@/constants/navigation'
import { LAYOUT } from '@/constants/layout'
export function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: LAYOUT.activeMargin, threshold: LAYOUT.activeThreshold },
    )
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])
  return active
}
