// MBRAS Academy - The Stack
// Scale Layer Visual: Replicating Cubes
// Concept: Replication. Parallelism. Architecture that multiplies.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LayerVisualProps } from "../types";
import { COLORS } from "../types";

const CUBE_COUNT = 27; // 3x3x3 grid
const CUBE_SIZE = 0.08;
const SPACING = 0.2;

interface CubeData {
  position: THREE.Vector3;
  initialPosition: THREE.Vector3;
  phase: number;
  scale: number;
}

export function ScaleReplication({ isActive, intensity }: LayerVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Create cube data
  const cubes = useMemo<CubeData[]>(() => {
    const result: CubeData[] = [];
    const gridSize = 3;
    const offset = ((gridSize - 1) * SPACING) / 2;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const position = new THREE.Vector3(
            x * SPACING - offset,
            (y * SPACING - offset) * 0.3, // Flatten Y
            z * SPACING - offset,
          );

          result.push({
            position: position.clone(),
            initialPosition: position.clone(),
            phase: Math.random() * Math.PI * 2,
            scale: 0.8 + Math.random() * 0.4,
          });
        }
      }
    }

    return result;
  }, []);

  // Animation
  useFrame((state, delta) => {
    if (!instancedRef.current) return;

    timeRef.current += delta;

    const tempMatrix = new THREE.Matrix4();
    const tempPosition = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();

    cubes.forEach((cube, i) => {
      if (isActive) {
        // Expand outward from center
        const expansionFactor = 1 + intensity * 0.3;
        tempPosition.copy(cube.initialPosition).multiplyScalar(expansionFactor);

        // Add floating motion
        tempPosition.y +=
          Math.sin(timeRef.current + cube.phase) * 0.02 * intensity;
        tempPosition.x +=
          Math.cos(timeRef.current * 0.7 + cube.phase) * 0.01 * intensity;

        // Subtle rotation
        tempQuaternion.setFromEuler(
          new THREE.Euler(
            timeRef.current * 0.3 + cube.phase,
            timeRef.current * 0.2 + cube.phase,
            0,
          ),
        );

        // Scale based on activity
        const pulseScale =
          1 + Math.sin(timeRef.current * 2 + cube.phase) * 0.1 * intensity;
        tempScale.setScalar(cube.scale * pulseScale);
      } else {
        // Collapsed state
        tempPosition.copy(cube.initialPosition).multiplyScalar(0.5);
        tempQuaternion.identity();
        tempScale.setScalar(cube.scale * 0.5);
      }

      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      instancedRef.current!.setMatrixAt(i, tempMatrix);
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;

    // Rotate entire group slowly
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.002 * intensity;
    }
  });

  const baseOpacity = isActive ? 0.6 : 0.1;

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, CUBE_COUNT]}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <meshBasicMaterial
          color={COLORS.titaniumWhite}
          transparent
          opacity={baseOpacity * intensity}
          wireframe
        />
      </instancedMesh>

      {/* Core cube (solid) */}
      <mesh>
        <boxGeometry
          args={[CUBE_SIZE * 1.2, CUBE_SIZE * 1.2, CUBE_SIZE * 1.2]}
        />
        <meshBasicMaterial
          color={COLORS.signalCyan}
          transparent
          opacity={isActive ? 0.3 * intensity : 0}
        />
      </mesh>

      {/* Connecting lines (expansion paths) */}
      {isActive && <ExpansionLines cubes={cubes} intensity={intensity} />}
    </group>
  );
}

// Lines showing expansion from center
function ExpansionLines({
  cubes,
  intensity,
}: {
  cubes: CubeData[];
  intensity: number;
}) {
  const center = new THREE.Vector3(0, 0, 0);

  // Only draw lines to corner cubes
  const cornerIndices = [0, 2, 6, 8, 18, 20, 24, 26];

  const lineObjects = useMemo(() => {
    const result: THREE.Line[] = [];
    cornerIndices.forEach((index) => {
      const cube = cubes[index];
      if (!cube) return;

      const points = [
        center.clone(),
        cube.position.clone().multiplyScalar(1.3),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: COLORS.signalCyan,
        transparent: true,
        opacity: 0.15 * intensity,
      });
      result.push(new THREE.Line(geometry, material));
    });
    return result;
  }, [cubes, intensity]);

  return (
    <group>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}
