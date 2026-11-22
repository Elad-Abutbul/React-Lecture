import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
              opacity={0.8}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[ATMOSPHERE.atom.core, 24, 24]} />
          <meshBasicMaterial color={WORLD.colors.cyan} />
        </mesh>
      </group>
    </Float>
  )
}
export default function ReactAtomScene() {
  return (
    <Canvas
      camera={ATMOSPHERE.camera}
      dpr={ATMOSPHERE.dpr}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
    >
      <AtomMesh />
      <Stars {...ATMOSPHERE.stars} saturation={0} fade />
    </Canvas>
  )
}
