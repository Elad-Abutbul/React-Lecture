import { useState, useRef } from 'react'
import { Dialog } from 'radix-ui'
import { GRAPH_BY_ID } from '@/content/worldGraph'
import { GRAPH_COPY } from '@/constants/graphNavigation'
import { useGraphStore } from '@/store/graph-store'
import { Button } from '../ui/button'
export function GraphMenu({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [query, setQuery] = useState('')
  const selected = useRef(false)
  const visited = useGraphStore((s) => s.visited)
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value)
        if (!value) setQuery('')
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl" />
        <Dialog.Content
          id="world-tree-menu"
          className="world-menu"
          dir="rtl"
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            if (selected.current) {
              selected.current = false
              if (!useGraphStore.getState().transitioning)
                document
                  .querySelector<HTMLElement>(
                    '.graph-node-active .graph-reading',
                  )
                  ?.focus({ preventScroll: true })
            } else document.getElementById('tree-map-trigger')?.focus()
          }}
        >
          <Dialog.Title className="text-2xl font-semibold">
            {GRAPH_COPY.map}
          </Dialog.Title>
          <Dialog.Description className="my-3 text-sm text-muted">
            {GRAPH_COPY.mapDescription}
          </Dialog.Description>
          <label className="graph-map-search">
            {GRAPH_COPY.search}
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="graph-map-list">
            {visited
              .filter((id) =>
                GRAPH_BY_ID[id]?.title
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .slice(-12)
              .map((id) => (
                <Button
                  variant="outline"
                  key={id}
                  onClick={() => {
                    selected.current = true
                    useGraphStore.getState().jump(id)
                    onOpenChange(false)
                  }}
                >
                  {GRAPH_BY_ID[id]?.title}
                </Button>
              ))}
          </div>
          <Dialog.Close asChild>
            <Button className="mt-4">{GRAPH_COPY.close}</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
