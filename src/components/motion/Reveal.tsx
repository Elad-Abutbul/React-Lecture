import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { ANIMATION } from '@/constants/animation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const animate = !reduced && typeof IntersectionObserver !== 'undefined'
  return (
    <motion.div
      initial={animate ? ANIMATION.reveal.initial : false}
      whileInView={animate ? ANIMATION.reveal.visible : undefined}
      viewport={ANIMATION.reveal.viewport}
      transition={ANIMATION.reveal.transition}
    >
      {children}
    </motion.div>
  )
}
