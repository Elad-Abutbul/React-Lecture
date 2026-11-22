import { Dialog } from 'radix-ui'
import { Button } from './button'
import { JOURNEY_COPY } from '@/content/journey'
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/85 backdrop-blur-sm" />
        <Dialog.Content className="dialog-content" dir="rtl">
          <Dialog.Title className="text-2xl font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Description className="my-5 text-muted">
            {description}
          </Dialog.Description>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              {JOURNEY_COPY.confirm}
            </Button>
            <Dialog.Close asChild>
              <Button variant="outline">{JOURNEY_COPY.cancel}</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
