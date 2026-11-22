import type { RefObject } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SCROLL_PATH } from '@/constants/animation'
export function DrawPath({
  target,
}: {
  target: RefObject<HTMLElement | null>
}) {
  const reduced = useReducedMotion()
  const full = useMotionValue(SCROLL_PATH.output[1])
  const { scrollYProgress } = useScroll({
    target,
    offset: [...SCROLL_PATH.offset],
  })
  const length = useTransform(
    scrollYProgress,
    [...SCROLL_PATH.input],
    [...SCROLL_PATH.output],
  )
  return (
    <svg
      className="draw-path"
      viewBox="0 0 2 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d={SCROLL_PATH.d}
        fill="none"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: reduced ? full : length }}
      />
    </svg>
  )
}
