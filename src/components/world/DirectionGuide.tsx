import {
  BRANCH_DIRECTIONS,
  DIRECTION_META,
  GESTURE_COPY,
  type BranchDirection,
} from '@/constants/gestures'
import type { JourneyNode } from '@/types/journey'
export function DirectionGuide({ node }: { node: JourneyNode }) {
  const directions = BRANCH_DIRECTIONS[node.id]
  if (!directions) return null
  return (
    <aside className="direction-guide" aria-label={GESTURE_COPY.available}>
      {(['left', 'right'] as BranchDirection[]).map((direction) => {
        const option = directions[direction]
        const choice = node.choices.find((c) => c.id === option.choiceId)
        return (
          <div
            key={direction}
            className={`direction-path direction-${direction}`}
          >
            <span className="direction-arrow" dir="ltr" aria-hidden="true">
              {DIRECTION_META[direction].arrow}
            </span>
            <div>
              <strong>{option.label}</strong>
              <p>{choice?.label}</p>
              <span className="direction-key">
                <kbd>{DIRECTION_META[direction].key}</kbd>
                {DIRECTION_META[direction].label}
              </span>
            </div>
          </div>
        )
      })}
      <p className="direction-instructions">
        {GESTURE_COPY.instructions}
        <span>{GESTURE_COPY.guard}</span>
      </p>
    </aside>
  )
}
