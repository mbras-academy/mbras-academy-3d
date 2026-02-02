// MBRAS Academy - The Stack
// Control Layer Visual: Feedback Loops
// Concept: Feedback. Regulation. Systems that govern themselves.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LayerVisualProps } from "../types";
import { COLORS } from "../types";

const NODE_COUNT = 5;
const LOOP_RADIUS = 0.8;
const CYCLE_TIME = 3000; // ms

interface NodeData {
  position: THREE.Vector3;
  connections: number[];
}

export function ControlLoop({ isActive, intensity }: LayerVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);
  const activeNodeRef = useRef(0);

  // Create node positions in a circular arrangement
  const nodes = useMemo<NodeData[]>(() => {
    const result: NodeData[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * LOOP_RADIUS;
      const y = Math.sin(angle) * LOOP_RADIUS * 0.3; // Flattened ellipse

      // Each node connects to the next (circular feedback)
      const connections = [(i + 1) % NODE_COUNT];

      // Add some cross-connections for complexity
      if (i % 2 === 0 && NODE_COUNT > 3) {
        connections.push((i + 2) % NODE_COUNT);
      }

      result.push({
        position: new THREE.Vector3(x, y, 0),
        connections,
      });
    }

    return result;
  }, []);

  // Create bezier curves for connections
  const connectionCurves = useMemo(() => {
    const curves: THREE.QuadraticBezierCurve3[] = [];

    nodes.forEach((node, i) => {
      node.connections.forEach((targetIndex) => {
        const start = node.position;
        const end = nodes[targetIndex].position;

        // Control point for bezier curve (slight arc)
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5);

        // Offset control point perpendicular to line
        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        const perp = new THREE.Vector3(-dir.y, dir.x, 0);
        mid.add(perp.multiplyScalar(0.15));

        curves.push(new THREE.QuadraticBezierCurve3(start, mid, end));
      });
    });

    return curves;
  }, [nodes]);

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    pulseRef.current += delta * 1000; // Convert to ms

    // Cycle through active nodes
    if (pulseRef.current >= CYCLE_TIME) {
      pulseRef.current = 0;
      activeNodeRef.current = (activeNodeRef.current + 1) % NODE_COUNT;
    }

    // Rotate group slightly when active
    if (isActive) {
      groupRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.05 * intensity;
    }
  });

  // Calculate pulse position along connections
  const pulseProgress = pulseRef.current / CYCLE_TIME;

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connectionCurves.map((curve, i) => (
        <ConnectionLine
          key={`conn-${i}`}
          curve={curve}
          isActive={isActive}
          intensity={intensity}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <Node
          key={`node-${i}`}
          position={node.position}
          isActive={isActive}
          isCurrentNode={activeNodeRef.current === i && isActive}
          intensity={intensity}
        />
      ))}

      {/* Pulse traveling along connections */}
      {isActive && (
        <TravelingPulse
          curves={connectionCurves}
          progress={pulseProgress}
          activeNode={activeNodeRef.current}
          intensity={intensity}
        />
      )}
    </group>
  );
}

// Individual node component
function Node({
  position,
  isActive,
  isCurrentNode,
  intensity,
}: {
  position: THREE.Vector3;
  isActive: boolean;
  isCurrentNode: boolean;
  intensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse scale when current node
    if (isCurrentNode) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const baseOpacity = isActive ? 0.6 : 0;
  const nodeColor = isCurrentNode ? COLORS.signalCyan : COLORS.titaniumWhite;

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[0.05, 16]} />
      <meshBasicMaterial
        color={nodeColor}
        transparent
        opacity={baseOpacity * intensity}
      />

      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[0.06, 0.08, 16]} />
        <meshBasicMaterial
          color={COLORS.titaniumWhite}
          transparent
          opacity={baseOpacity * 0.5 * intensity}
        />
      </mesh>
    </mesh>
  );
}

// Connection line component
function ConnectionLine({
  curve,
  isActive,
  intensity,
}: {
  curve: THREE.QuadraticBezierCurve3;
  isActive: boolean;
  intensity: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(() => curve.getPoints(20), [curve]);
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points],
  );
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: COLORS.titaniumWhite,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useFrame(() => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = isActive ? 0.3 * intensity : 0;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />
  );
}

// Traveling pulse along connections
function TravelingPulse({
  curves,
  progress,
  activeNode,
  intensity,
}: {
  curves: THREE.QuadraticBezierCurve3[];
  progress: number;
  activeNode: number;
  intensity: number;
}) {
  // Find curves starting from active node
  const activeCurveIndex = activeNode % curves.length;
  const curve = curves[activeCurveIndex];

  if (!curve) return null;

  const point = curve.getPoint(progress);

  return (
    <mesh position={point}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial
        color={COLORS.signalCyan}
        transparent
        opacity={0.8 * intensity}
      />

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={COLORS.signalCyan}
          transparent
          opacity={0.2 * intensity}
        />
      </mesh>
    </mesh>
  );
}
