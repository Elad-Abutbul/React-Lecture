import { AnimatePresence, motion } from 'motion/react'
import { useJourneyStore } from '@/store/journey-store'
import { getActivePath } from '@/lib/journey-engine'
import { DecisionNode } from './DecisionNode'
import { ANIMATION } from '@/constants/animation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
export function MobileJourney() {
  const choices = useJourneyStore((s) => s.choices)
  const reduced = useReducedMotion()
  return (
    <ol className="journey-list">
      <AnimatePresence initial={false}>
        {getActivePath(choices).map((node) => (
          <motion.li
            key={node.id}
            initial={reduced ? false : ANIMATION.branch.initial}
            animate={ANIMATION.branch.animate}
            exit={reduced ? undefined : ANIMATION.branch.exit}
            transition={reduced ? { duration: 0 } : ANIMATION.branch.transition}
          >
            <DecisionNode node={node} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  )
}
