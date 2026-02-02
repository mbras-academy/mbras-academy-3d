// MBRAS Academy - The Stack
// Structure Layer Visual: Wireframe Grid
// Concept: Patterns. Connections. Order. Where meaning begins to form.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { LayerVisualProps } from '../types'
import { COLORS } from '../types'

const GRID_SIZE = 8
const CELL_SIZE = 0.3
const LINE_SEGMENTS = 20

export function StructureGrid({ isActive, intensity }: LayerVisualProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Create grid lines
  const gridGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const halfSize = (GRID_SIZE * CELL_SIZE) / 2

    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      const y = -halfSize + i * CELL_SIZE
      for (let j = 0; j < LINE_SEGMENTS; j++) {
        const x1 = -halfSize + (j / LINE_SEGMENTS) * (halfSize * 2)
        const x2 = -halfSize + ((j + 1) / LINE_SEGMENTS) * (halfSize * 2)
        points.push(new THREE.Vector3(x1, y * 0.3, 0))
        points.push(new THREE.Vector3(x2, y * 0.3, 0))
      }
    }

    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      const x = -halfSize + i * CELL_SIZE
      for (let j = 0; j < LINE_SEGMENTS; j++) {
        const y1 = -halfSize + (j / LINE_SEGMENTS) * (halfSize * 2)
        const y2 = -halfSize + ((j + 1) / LINE_SEGMENTS) * (halfSize * 2)
        points.push(new THREE.Vector3(x, y1 * 0.3, 0))
        points.push(new THREE.Vector3(x, y2 * 0.3, 0))
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [])

  // Connection nodes at intersections
  const nodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const halfSize = (GRID_SIZE * CELL_SIZE) / 2

    for (let i = 0; i <= GRID_SIZE; i++) {
      for (let j = 0; j <= GRID_SIZE; j++) {
        const x = -halfSize + i * CELL_SIZE
        const y = (-halfSize + j * CELL_SIZE) * 0.3
        positions.push(new THREE.Vector3(x, y, 0))
      }
    }

    return positions
  }, [])

  // Animation
  useFrame((state, delta) => {
    if (!groupRef.current || !isActive) return

    timeRef.current += delta

    // Subtle wave effect
    groupRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.05 * intensity
    groupRef.current.rotation.y = Math.cos(timeRef.current * 0.3) * 0.03 * intensity
  })

  const baseOpacity = isActive ? 0.4 : 0

  return (
    <group ref={groupRef}>
      {/* Grid lines */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial
          color={COLORS.titaniumWhite}
          transparent
          opacity={baseOpacity * intensity * 0.5}
          linewidth={1}
        />
      </lineSegments>

      {/* Connection nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.015, 8]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? COLORS.signalCyan : COLORS.titaniumWhite}
            transparent
            opacity={baseOpacity * intensity * (i % 3 === 0 ? 0.8 : 0.3)}
          />
        </mesh>
      ))}

      {/* Central highlight */}
      {isActive && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.5, 0.15]} />
          <meshBasicMaterial
            color={COLORS.signalCyan}
            transparent
            opacity={0.05 * intensity}
          />
        </mesh>
      )}
    </group>
  )
}
