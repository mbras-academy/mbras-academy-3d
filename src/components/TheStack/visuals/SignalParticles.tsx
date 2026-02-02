// MBRAS Academy - The Stack
// Signal Layer Visual: Chaotic Particles
// Concept: Raw data. Noise. Entropy. What systems are built on.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { LayerVisualProps } from '../types'
import { COLORS } from '../types'

const PARTICLE_COUNT = 200

interface ParticleData {
  positions: Float32Array
  velocities: Float32Array
  phases: Float32Array
}

export function SignalParticles({ isActive, intensity }: LayerVisualProps) {
  const meshRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  // Initialize particle data
  const particleData = useMemo<ParticleData>(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      
      // Random positions within bounds
      positions[i3] = (Math.random() - 0.5) * 4      // x: [-2, 2]
      positions[i3 + 1] = (Math.random() - 0.5) * 1  // y: [-0.5, 0.5]
      positions[i3 + 2] = (Math.random() - 0.5) * 2  // z: [-1, 1]

      // Random velocities (chaotic movement)
      const speed = 0.01 + Math.random() * 0.04
      const angle = Math.random() * Math.PI * 2
      const elevation = (Math.random() - 0.5) * Math.PI

      velocities[i3] = Math.cos(angle) * Math.cos(elevation) * speed
      velocities[i3 + 1] = Math.sin(elevation) * speed
      velocities[i3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed

      // Random phase for variation
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, velocities, phases }
  }, [])

  // Geometry with positions
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3))
    return geo
  }, [particleData])

  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || !isActive) return

    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const phase = particleData.phases[i]

      // Update positions with chaotic movement
      positions[i3] += particleData.velocities[i3] * intensity
      positions[i3 + 1] += particleData.velocities[i3 + 1] * intensity
      positions[i3 + 2] += particleData.velocities[i3 + 2] * intensity

      // Add noise-based perturbation
      positions[i3] += Math.sin(time * 2 + phase) * 0.002 * intensity
      positions[i3 + 1] += Math.cos(time * 1.5 + phase) * 0.002 * intensity
      positions[i3 + 2] += Math.sin(time * 1.8 + phase) * 0.002 * intensity

      // Boundary wrapping (toroidal)
      if (positions[i3] > 2) positions[i3] = -2
      if (positions[i3] < -2) positions[i3] = 2
      if (positions[i3 + 1] > 0.5) positions[i3 + 1] = -0.5
      if (positions[i3 + 1] < -0.5) positions[i3 + 1] = 0.5
      if (positions[i3 + 2] > 1) positions[i3 + 2] = -1
      if (positions[i3 + 2] < -1) positions[i3 + 2] = 1

      // Occasionally change direction (chaos)
      if (Math.random() < 0.001) {
        particleData.velocities[i3] *= -1
        particleData.velocities[i3 + 1] *= -1
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true

    // Update material opacity based on intensity
    if (materialRef.current) {
      materialRef.current.opacity = 0.1 + intensity * 0.2
    }
  })

  // Target opacity for smooth transitions
  const targetOpacity = isActive ? 0.3 : 0

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        color={COLORS.titaniumWhite}
        transparent
        opacity={targetOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
