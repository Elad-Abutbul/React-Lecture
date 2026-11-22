import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ATMOSPHERE } from '@/constants/atmosphere'
import { AtomGlyph } from './AtomGlyph'
export function ReactCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const x = useMotionValue(0),
    y = useMotionValue(0),
    opacity = useMotionValue(0)
  const smoothX = useSpring(x, ATMOSPHERE.cursor.spring),
    smoothY = useSpring(y, ATMOSPHERE.cursor.spring)
  const trailX = useSpring(x, ATMOSPHERE.cursor.trailSpring),
    trailY = useSpring(y, ATMOSPHERE.cursor.trailSpring)
  useEffect(() => {
    if (!fine || reduced) return
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX + ATMOSPHERE.cursor.offset)
      y.set(event.clientY + ATMOSPHERE.cursor.offset)
      opacity.set(1)
    }
    const leave = () => opacity.set(0)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [fine, reduced, x, y, opacity])
  if (!fine || reduced) return null
  return (
    <>
      <motion.div
        className="react-cursor"
        aria-hidden="true"
        style={{ x: smoothX, y: smoothY, opacity }}
      >
        <AtomGlyph />
      </motion.div>
      <motion.div
        className="react-cursor-trail"
        aria-hidden="true"
        style={{ x: trailX, y: trailY, opacity }}
      />
    </>
  )
}
