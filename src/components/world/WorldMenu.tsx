import { Dialog, Tabs } from 'radix-ui'
import { Button } from '@/components/ui/button'
import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { LEARNING_SCENES } from '@/content/learningScenes'
import { WORLD_COPY } from '@/constants/world'
import { useWorldStore } from '@/store/world-store'
export function WorldMenu({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
}) {
  const choices = useJourneyStore((s) => s.choices)
  function visit(id: string) {
    useWorldStore.getState().navigate(id)
    onOpenChange(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl" />
        <Dialog.Content className="world-menu" dir="rtl">
          <Dialog.Title className="mb-3 text-3xl font-semibold">
            {WORLD_COPY.map}
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-muted">
            {WORLD_COPY.menuDescription}
          </Dialog.Description>
          <Tabs.Root dir="rtl" defaultValue="setup">
            <Tabs.List className="scene-tabs">
              <Tabs.Trigger value="setup">{WORLD_COPY.setup}</Tabs.Trigger>
              <Tabs.Trigger value="learning">
                {WORLD_COPY.learning}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="setup">
              <div className="world-menu-grid">
                {getActivePath(choices).map((n) => (
                  <Button
                    key={n.id}
                    variant="outline"
                    onClick={() => visit(n.id)}
                  >
                    {n.title}
                  </Button>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="learning">
              <div className="world-menu-grid">
                {LEARNING_SCENES.map((s) => (
                  <Button
                    key={s.id}
                    variant="outline"
                    onClick={() => visit(s.id)}
                  >
                    {s.title}
                  </Button>
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
          <Dialog.Close asChild>
            <Button className="mt-6" variant="secondary">
              {WORLD_COPY.close}
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
