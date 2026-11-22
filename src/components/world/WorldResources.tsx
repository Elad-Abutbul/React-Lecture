import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { REFERENCES_COPY } from '@/constants/links'
import { useWorldStore } from '@/store/world-store'
export function WorldResources() {
  return (
    <article className="focus-content">
      <h1 className="focus-title">{REFERENCES_COPY.title}</h1>
      <p className="focus-description">{REFERENCES_COPY.description}</p>
      <Footer />
      <Button
        className="mt-5"
        variant="outline"
        onClick={() => useWorldStore.getState().navigate('node')}
      >
        {REFERENCES_COPY.return}
      </Button>
    </article>
  )
}
