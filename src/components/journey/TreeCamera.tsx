import { useEffect, useRef, useState, type RefObject } from 'react'
import { useReactFlow } from '@xyflow/react'
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import type { JourneyNode } from '@/types/journey'
import { TREE_NAV } from '@/constants/tree'
import { cameraTarget, interpolatePath } from '@/lib/tree-camera'
import { useReducedMotion } from '@/hooks/useReducedMotion'
export function TreeCamera({
  path,
  current,
  exploring,
  track,
  frame,
}: {
  path: readonly JourneyNode[]
  current: string
  exploring: boolean
  track: RefObject<HTMLDivElement | null>
  frame: RefObject<HTMLDivElement | null>
}) {
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const element = frame.current
    if (!element) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect)
        setFrameSize((previous) =>
          previous.width === rect.width && previous.height === rect.height
            ? previous
            : { width: rect.width, height: rect.height },
        )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [frame])
  const flow = useReactFlow()
  const api = useRef(flow)
  const viewportInitialized = flow.viewportInitialized
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const zoom = useMotionValue<number>(TREE_NAV.travelZoom)
  const busy = useRef(false)
  const anchor = useRef({ progress: 0, index: 0 })
  const { scrollYProgress } = useScroll({
    target: track,
    offset: TREE_NAV.offset,
  })
  useEffect(() => {
    if (!viewportInitialized || exploring || !frame.current) return
    const bounds = frame.current.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const target = cameraTarget(current, bounds.width, bounds.height)
    anchor.current = {
      progress: scrollYProgress.get(),
      index: Math.max(
        0,
        path.findIndex((n) => n.id === current),
      ),
    }
    const previous = api.current.getViewport()
    x.set(previous.x)
    y.set(previous.y)
    zoom.set(previous.zoom)
    if (reduced) {
      frame.current.style.setProperty('--tree-zoom', String(target.zoom))
      void api.current.setViewport(target)
      return
    }
    busy.current = true
    const options = { duration: TREE_NAV.duration, ease: TREE_NAV.ease }
    const controls = [
      animate(x, target.x, options),
      animate(y, target.y, options),
      animate(zoom, target.zoom, options),
    ]
    void Promise.all(controls).then(() => {
      busy.current = false
    })
    return () => {
      controls.forEach((c) => c.stop())
      busy.current = false
    }
  }, [
    current,
    frameSize,
    path,
    exploring,
    viewportInitialized,
    reduced,
    frame,
    scrollYProgress,
    x,
    y,
    zoom,
  ])
  useEffect(() => {
    let scheduled = 0
    const update = () => {
      if (scheduled) cancelAnimationFrame(scheduled)
      scheduled = requestAnimationFrame(() => {
        if (!exploring && !reduced) {
          frame.current?.style.setProperty('--tree-zoom', String(zoom.get()))
          void api.current.setViewport({
            x: x.get(),
            y: y.get(),
            zoom: zoom.get(),
          })
        }
      })
    }
    const unsub = [
      x.on('change', update),
      y.on('change', update),
      zoom.on('change', update),
    ]
    return () => {
      unsub.forEach((u) => u())
      cancelAnimationFrame(scheduled)
    }
  }, [x, y, zoom, exploring, reduced, frame])
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (exploring || reduced || busy.current || !frame.current) return
    const index =
      anchor.current.index +
      (progress - anchor.current.progress) * Math.max(1, path.length - 1)
    const point = interpolatePath(
      path.map((n) => n.id),
      index,
    )
    const bounds = frame.current.getBoundingClientRect()
    const scale = zoom.get()
    x.set(
      bounds.width * TREE_NAV.viewportAnchorX -
        (point.x + TREE_NAV.nodeWidth / 2) * scale,
    )
    y.set(
      bounds.height * TREE_NAV.viewportAnchorY -
        (point.y + TREE_NAV.nodeHeight / 2) * scale,
    )
    frame.current.style.setProperty(
      '--tree-progress',
      String(Math.max(0, Math.min(1, (index + 1) / path.length))),
    )
  })
  return null
}
