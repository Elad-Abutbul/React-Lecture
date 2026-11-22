import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WORLD } from '@/constants/world'
import { interpolateWorld, worldCameraTarget } from '@/lib/world-camera'
import { useReducedMotion } from './useReducedMotion'
import { useWorldStore } from '@/store/world-store'
gsap.registerPlugin(ScrollTrigger)
export function useWorldCamera({
  stage,
  space,
  route,
  width,
  height,
  onScene,
  onReveal,
}: {
  stage: RefObject<HTMLDivElement | null>
  space: RefObject<HTMLDivElement | null>
  route: readonly string[]
  width: number
  height: number
  onScene: (id: string) => void
  onReveal: (value: boolean) => void
}) {
  const reduced = useReducedMotion()
  const revision = useWorldStore((s) => s.revision)
  const camera = useRef({ ...WORLD.origin, zoom: 1 })
  useLayoutEffect(() => {
    if (!stage.current || !space.current) return
    const element = stage.current
    let active = ''
    let revealed: boolean | null = null
    let traveling = false
    function apply() {
      const c = camera.current
      gsap.set(element, {
        x: width / 2 - c.x * c.zoom,
        y: height / 2 - c.y * c.zoom,
        scale: c.zoom,
        force3D: true,
      })
      element.setAttribute('data-camera-x', String(c.x))
      element.setAttribute('data-camera-y', String(c.y))
      element.setAttribute('data-camera-zoom', String(c.zoom))
    }
    function scene(id: string, reveal = false) {
      if (active !== id) {
        active = id
        onScene(id)
      }
      if (revealed !== reveal) {
        revealed = reveal
        onReveal(reveal)
      }
    }
    const quickX = gsap.quickTo(camera.current, 'x', {
      duration: reduced ? 0 : WORLD.camera.smooth,
      onUpdate: apply,
    })
    const quickY = gsap.quickTo(camera.current, 'y', {
      duration: reduced ? 0 : WORLD.camera.smooth,
      onUpdate: apply,
    })
    const quickZoom = gsap.quickTo(camera.current, 'zoom', {
      duration: reduced ? 0 : WORLD.camera.smooth,
      onUpdate: apply,
    })
    function update() {
      if (traveling) return
      const index = Math.max(0, window.scrollY / WORLD.scrollStep)
      const last = route.length - 1
      const id = route[Math.min(last, Math.round(index))]
      const reveal = index > last + WORLD.revealAt
      const target = reveal
        ? worldCameraTarget(route[last], true, width, height)
        : interpolateWorld(route, index)
      scene(id, reveal)
      if (reduced) {
        Object.assign(camera.current, target)
        apply()
      } else {
        quickX(target.x)
        quickY(target.y)
        quickZoom(target.zoom)
      }
      element.style.setProperty(
        '--world-progress',
        String(Math.min(1, (index + 1) / route.length)),
      )
    }
    const request = useWorldStore.getState()
    const index = Math.max(0, route.indexOf(request.requestedId))
    traveling = true
    window.scrollTo({ top: index * WORLD.scrollStep, behavior: 'instant' })
    const target = worldCameraTarget(
      route[index],
      request.reveal,
      width,
      height,
    )
    scene(route[index], request.reveal)
    const tween = gsap.to(camera.current, {
      ...target,
      duration: reduced ? 0 : WORLD.camera.duration,
      ease: WORLD.camera.ease,
      onUpdate: apply,
      onComplete: () => {
        traveling = false
      },
    })
    apply()
    const trigger = ScrollTrigger.create({
      trigger: space.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: update,
    })
    ScrollTrigger.refresh()
    return () => {
      trigger.kill()
      tween.kill()
      quickX.tween.kill()
      quickY.tween.kill()
      quickZoom.tween.kill()
    }
  }, [route, width, height, revision, reduced, stage, space, onScene, onReveal])
}
