import {
  lazy,
  Suspense,
  useEffect,
  useState,
  Component,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { ATMOSPHERE } from '@/constants/atmosphere'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { AtomGlyph } from './AtomGlyph'
const ReactAtomScene = lazy(() => import('./ReactAtomScene'))
class VisualFallback extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <AtomGlyph /> : this.props.children
  }
}
export function Atmosphere() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const [supported, setSupported] = useState(false)
  useEffect(() => {
    if (!fine || reduced) return
    const frame = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('webgl2')
        const info = context?.getExtension('WEBGL_debug_renderer_info')
        const renderer =
          info && context
            ? String(context.getParameter(info.UNMASKED_RENDERER_WEBGL))
            : ''
        setSupported(
          !!context && !/swiftshader|llvmpipe|software/i.test(renderer),
        )
        context?.getExtension('WEBGL_lose_context')?.loseContext()
      } catch {
        setSupported(false)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [fine, reduced])
  return (
    <div className="world-atmosphere" aria-hidden="true">
      <div className="world-aura" />
      <div className="cosmic-nebulae">
        {ATMOSPHERE.nebulae.map((nebula) => (
          <span
            key={nebula.id}
            className="cosmic-nebula"
            style={
              {
                left: `${nebula.x}%`,
                top: `${nebula.y}%`,
                width: `${nebula.size}vmax`,
                height: `${nebula.size}vmax`,
                '--nebula-color': nebula.color,
                animationDuration: `${nebula.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="cosmic-orbits">
        {ATMOSPHERE.orbits.map((orbit) => (
          <span
            key={orbit.id}
            className="cosmic-orbit"
            style={
              {
                '--orbit-tilt': `${orbit.tilt}deg`,
                width: `${orbit.width}vw`,
                animationDuration: `${orbit.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="atmosphere-atom">
        {fine && !reduced && supported ? (
          <VisualFallback>
            <Suspense fallback={<AtomGlyph />}>
              <ReactAtomScene />
            </Suspense>
          </VisualFallback>
        ) : (
          <AtomGlyph />
        )}
      </div>
      <div className="world-particles">
        {ATMOSPHERE.particles.map((p) => (
          <span
            key={p.id}
            className="world-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
