// MBRAS Academy - The Stack
// Intelligence Layer Visual: Vector Field with Flow
// Concept: Gradients. Decisions. Directed information flow.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LayerVisualProps } from "../types";
import { COLORS } from "../types";

const RESOLUTION = 12;
const ARROW_LENGTH = 0.15;
const FIELD_WIDTH = 3;
const FIELD_HEIGHT = 0.6;

// Simplex-like noise function for curl noise effect
function noise2D(x: number, y: number, time: number): number {
  return (
    Math.sin(x * 2 + time) * Math.cos(y * 3 + time * 0.7) * 0.5 +
    Math.sin(x * 5 - time * 0.5) * Math.cos(y * 2 + time) * 0.3 +
    Math.cos(x * 3 + y * 2 + time * 0.3) * 0.2
  );
}

// Calculate curl of noise field (gives rotational flow)
function curlNoise(x: number, y: number, time: number): [number, number] {
  const eps = 0.01;
  const dx =
    (noise2D(x, y + eps, time) - noise2D(x, y - eps, time)) / (2 * eps);
  const dy =
    -(noise2D(x + eps, y, time) - noise2D(x - eps, y, time)) / (2 * eps);
  return [dx, dy];
}

export function IntelligenceField({ isActive, intensity }: LayerVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const arrowsRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Create arrow geometry (cone + line)
  const arrowGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Arrow head (triangle)
    shape.moveTo(0, ARROW_LENGTH * 0.6);
    shape.lineTo(-ARROW_LENGTH * 0.2, 0);
    shape.lineTo(ARROW_LENGTH * 0.2, 0);
    shape.lineTo(0, ARROW_LENGTH * 0.6);

    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
  }, []);

  // Arrow positions
  const arrowCount = RESOLUTION * RESOLUTION;
  const arrowData = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < RESOLUTION; i++) {
      for (let j = 0; j < RESOLUTION; j++) {
        const x = -FIELD_WIDTH / 2 + (i / (RESOLUTION - 1)) * FIELD_WIDTH;
        const y = -FIELD_HEIGHT / 2 + (j / (RESOLUTION - 1)) * FIELD_HEIGHT;

        const pos = new THREE.Vector3(x, y, 0);
        positions.push(pos);

        const matrix = new THREE.Matrix4();
        matrix.setPosition(pos);
        matrices.push(matrix);
      }
    }

    return { matrices, positions };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (!arrowsRef.current || !isActive) return;

    timeRef.current += delta * 0.5 * intensity;

    const tempMatrix = new THREE.Matrix4();
    const tempPosition = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    const tempScale = new THREE.Vector3(1, 1, 1);
    const upVector = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < arrowCount; i++) {
      const pos = arrowData.positions[i];

      // Calculate curl noise for flow direction
      const [flowX, flowY] = curlNoise(pos.x * 0.5, pos.y * 2, timeRef.current);

      // Normalize and calculate rotation
      const magnitude = Math.sqrt(flowX * flowX + flowY * flowY);
      const normalizedX = magnitude > 0 ? flowX / magnitude : 0;
      const normalizedY = magnitude > 0 ? flowY / magnitude : 1;

      // Calculate angle from flow direction
      const angle = Math.atan2(normalizedX, normalizedY);

      // Set position with slight oscillation
      tempPosition.set(
        pos.x + Math.sin(timeRef.current + i * 0.1) * 0.02 * intensity,
        pos.y + Math.cos(timeRef.current + i * 0.1) * 0.02 * intensity,
        0,
      );

      // Create rotation quaternion
      tempQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);

      // Scale based on flow magnitude
      const scale = 0.5 + magnitude * 0.5 * intensity;
      tempScale.set(scale, scale, 1);

      // Compose matrix
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      arrowsRef.current.setMatrixAt(i, tempMatrix);
    }

    arrowsRef.current.instanceMatrix.needsUpdate = true;

    // Update material
    const material = arrowsRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = isActive ? 0.4 + intensity * 0.2 : 0;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={arrowsRef}
        args={[arrowGeometry, undefined, arrowCount]}
      >
        <meshBasicMaterial
          color={COLORS.signalCyan}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Flow lines (subtle background) */}
      {isActive && <FlowLines intensity={intensity} time={timeRef.current} />}
    </group>
  );
}

// Subtle flow lines in background
function FlowLines({ intensity, time }: { intensity: number; time: number }) {
  const lineCount = 8;

  const lines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const y = -0.3 + (i / (lineCount - 1)) * 0.6;
      return { y, phase: Math.random() * Math.PI * 2 };
    });
  }, []);

  const lineObjects = useMemo(() => {
    return lines.map((line) => {
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 20; j++) {
        const x = -1.5 + (j / 20) * 3;
        const [, flowY] = curlNoise(x * 0.5, line.y * 2, time + line.phase);
        points.push(new THREE.Vector3(x, line.y + flowY * 0.1, 0));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: COLORS.titaniumWhite,
        transparent: true,
        opacity: 0.1 * intensity,
      });
      return new THREE.Line(geometry, material);
    });
  }, [lines, time, intensity]);

  return (
    <group>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}
