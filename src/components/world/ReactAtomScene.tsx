import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import type { Group } from 'three'
import { ATMOSPHERE } from '@/constants/atmosphere'
import { WORLD } from '@/constants/world'
function AtomMesh() {
  const group = useRef<Group>(null)
  useFrame((_, delta) => {
    if (group.current)
      group.current.rotation.y += delta * ATMOSPHERE.atom.rotation
  })
  return (
    <Float
      speed={ATMOSPHERE.atom.floatSpeed}
      floatIntensity={ATMOSPHERE.atom.floatIntensity}
    >
      <group ref={group}>
        {ATMOSPHERE.atom.angles.map((angle) => (
          <mesh key={angle} rotation={[0, 0, angle]} scale={[1, 0.38, 1]}>
            <torusGeometry
              args={[
                ATMOSPHERE.atom.ringRadius,
                ATMOSPHERE.atom.tube,
                ATMOSPHERE.atom.radial,
                ATMOSPHERE.atom.tubular,
              ]}
            />
            <meshBasicMaterial
              color={WORLD.colors.cyan}
              transparent
              opacity={ATMOSPHERE.atom.opacity}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry
            args={[
              ATMOSPHERE.atom.core,
              ATMOSPHERE.atom.segments,
              ATMOSPHERE.atom.segments,
            ]}
          />
          <meshBasicMaterial color={WORLD.colors.cyan} />
        </mesh>
      </group>
    </Float>
  )
}
function FrameBudget() {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') invalidate()
    }, ATMOSPHERE.frameMs)
    return () => window.clearInterval(id)
  }, [invalidate])
  return null
}
export default function ReactAtomScene() {
  return (
    <Canvas
      frameloop="demand"
      camera={ATMOSPHERE.camera}
      dpr={ATMOSPHERE.dpr}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
    >
      <FrameBudget />
      <AtomMesh />
      <Stars {...ATMOSPHERE.stars} saturation={0} fade />
    </Canvas>
  )
}
