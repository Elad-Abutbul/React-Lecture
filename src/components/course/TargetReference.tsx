import { Dialog } from 'radix-ui'
import { COURSE_CONFIG as C } from '@/constants/course'
import type { WorkshopStep } from '@/types/course'
export function TargetReference({
  highlight,
}: {
  highlight: WorkshopStep['highlight']
}) {
  const area = C.highlights[highlight]
  return (
    <figure className="course-target">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={C.labels.enlarge}
            className="relative block w-full overflow-hidden rounded-xl border border-react/30"
          >
            <img
              src={C.image}
              alt={C.imageAlt}
              width={1672}
              height={941}
              loading="lazy"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 border-2 border-violet-500 bg-violet-400/10"
              style={{ top: `${area.top}%`, height: `${area.height}%` }}
            />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/95" />
          <Dialog.Content dir="rtl" className="course-image-dialog">
            <Dialog.Title>{C.labels.target}</Dialog.Title>
            <Dialog.Description className="sr-only">
              {C.imageAlt}
            </Dialog.Description>
            <img src={C.image} alt={C.imageAlt} width={1672} height={941} />
            <Dialog.Close className="mt-3 rounded-lg border border-react/40 px-4 py-3">
              {C.labels.close}
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <figcaption>{C.labels.target}</figcaption>
    </figure>
  )
}
