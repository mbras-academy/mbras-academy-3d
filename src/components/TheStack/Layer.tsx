// MBRAS Academy - The Stack
// Semantic 3D Objects representing each module

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, RoundedBox } from "@react-three/drei";
import { LayerData, COLORS, LayerId } from "./types";

interface LayerProps {
  data: LayerData;
  isActive: boolean;
  isDimmed: boolean;
  isFocused: boolean;
  reducedMotion: boolean;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
  baseY: number;
  totalLayers: number;
}

const DEVICE_CONFIG: Record<LayerId, { type: string; scale: number }> = {
  signal: { type: "neuralBrain", scale: 0.85 }, // Cérebro Neural
  structure: { type: "leadFunnel", scale: 0.8 }, // Funil de Leads
  control: { type: "gearSystem", scale: 0.8 }, // Engrenagens
  scale: { type: "balanceScale", scale: 0.85 }, // Balança de Precisão
};

export function Layer({
  data,
  isActive,
  isDimmed,
  reducedMotion,
  onHover,
  onClick,
  baseY,
}: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [intensity, setIntensity] = useState(0);
  const currentY = useRef(baseY);
  const currentScale = useRef(1);

  const deviceConfig = DEVICE_CONFIG[data.id];

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetY = isActive ? baseY + 0.2 : baseY;
    const targetScale = isActive ? 1.12 : isDimmed ? 0.92 : 1;
    const lerpFactor = reducedMotion ? 1 : 0.06;

    currentY.current = THREE.MathUtils.lerp(
      currentY.current,
      targetY,
      lerpFactor,
    );
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      lerpFactor,
    );

    groupRef.current.position.y = currentY.current;
    groupRef.current.scale.setScalar(currentScale.current * deviceConfig.scale);

    if (!reducedMotion) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.15 + data.index) * 0.08;
    }

    const newIntensity = isActive ? 1 : isDimmed ? 0.1 : 0.35;
    setIntensity((prev) =>
      THREE.MathUtils.lerp(prev, newIntensity, lerpFactor),
    );
  });

  return (
    <group ref={groupRef} position={[0, baseY, 0]}>
      <group
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
          onHover(true);
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
          onHover(false);
        }}
        onClick={onClick}
      >
        <DeviceMesh
          type={deviceConfig.type}
          isActive={isActive}
          isDimmed={isDimmed}
          intensity={intensity}
        />
      </group>

      <group position={[-2.0, 0, 0]}>
        <Text
          fontSize={0.08}
          color={isActive ? COLORS.gold : COLORS.silver}
          anchorX="right"
          anchorY="middle"
          fillOpacity={isDimmed ? 0.15 : isActive ? 1 : 0.4}
        >
          {data.module}
        </Text>
        <Text
          position={[0, -0.12, 0]}
          fontSize={0.11}
          color={COLORS.titaniumWhite}
          anchorX="right"
          anchorY="middle"
          fillOpacity={isDimmed ? 0.15 : isActive ? 1 : 0.6}
          maxWidth={1.8}
        >
          {data.title}
        </Text>
      </group>
    </group>
  );
}

function DeviceMesh({
  type,
  isActive,
  isDimmed,
  intensity,
}: {
  type: string;
  isActive: boolean;
  isDimmed: boolean;
  intensity: number;
}) {
  const baseOpacity = isDimmed ? 0.3 : 1;

  switch (type) {
    case "neuralBrain":
      return (
        <NeuralBrain
          isActive={isActive}
          intensity={intensity}
          opacity={baseOpacity}
        />
      );
    case "leadFunnel":
      return (
        <LeadFunnel
          isActive={isActive}
          intensity={intensity}
          opacity={baseOpacity}
        />
      );
    case "adBillboard":
      return (
        <AdBillboard
          isActive={isActive}
          intensity={intensity}
          opacity={baseOpacity}
        />
      );
    case "gearSystem":
      return (
        <GearSystem
          isActive={isActive}
          intensity={intensity}
          opacity={baseOpacity}
        />
      );
    case "balanceScale":
      return (
        <BalanceScale
          isActive={isActive}
          intensity={intensity}
          opacity={baseOpacity}
        />
      );
    default:
      return (
        <RoundedBox args={[1, 0.5, 1]} radius={0.05}>
          <meshStandardMaterial color="#1a1a2e" />
        </RoundedBox>
      );
  }
}

// ============================================
// 1. AI HOLOGRAM - Rede Neural 3D Premium
// ============================================
function NeuralBrain({
  isActive,
  intensity,
  opacity,
}: {
  isActive: boolean;
  intensity: number;
  opacity: number;
}) {
  const mainRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const neuralNetRef = useRef<THREE.Group>(null);
  const dataStreamRef = useRef<THREE.Points>(null);
  const pulseRingsRef = useRef<THREE.Group>(null);
  const orbitalRef = useRef<THREE.Group>(null);

  // Generate 3D neural network nodes in spherical layers
  const neuralNetwork = useMemo(() => {
    const nodes: { pos: THREE.Vector3; layer: number; size: number }[] = [];

    // Create nodes in concentric spherical shells
    const shells = [
      { radius: 0.06, count: 4, size: 0.018 },
      { radius: 0.12, count: 8, size: 0.014 },
      { radius: 0.18, count: 14, size: 0.011 },
      { radius: 0.24, count: 20, size: 0.008 },
    ];

    shells.forEach((shell, shellIdx) => {
      for (let i = 0; i < shell.count; i++) {
        // Fibonacci sphere distribution
        const phi = Math.acos(1 - (2 * (i + 0.5)) / shell.count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        nodes.push({
          pos: new THREE.Vector3(
            shell.radius * Math.sin(phi) * Math.cos(theta),
            shell.radius * Math.cos(phi),
            shell.radius * Math.sin(phi) * Math.sin(theta),
          ),
          layer: shellIdx,
          size: shell.size,
        });
      }
    });

    return nodes;
  }, []);

  // Generate dynamic connections
  const connections = useMemo(() => {
    const conns: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      strength: number;
    }[] = [];

    for (let i = 0; i < neuralNetwork.length; i++) {
      for (let j = i + 1; j < neuralNetwork.length; j++) {
        const dist = neuralNetwork[i].pos.distanceTo(neuralNetwork[j].pos);
        // Connect nearby nodes
        if (dist < 0.12 && Math.random() > 0.3) {
          conns.push({
            start: neuralNetwork[i].pos,
            end: neuralNetwork[j].pos,
            strength: 1 - dist / 0.12,
          });
        }
      }
    }

    return conns;
  }, [neuralNetwork]);

  // Data stream particles - double helix DNA style
  const dataStream = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6;
      const radius = 0.32;
      const strand = i % 2;

      positions[i * 3] = Math.cos(t + strand * Math.PI) * radius;
      positions[i * 3 + 1] = (i / count - 0.5) * 0.8;
      positions[i * 3 + 2] = Math.sin(t + strand * Math.PI) * radius;

      // Gold gradient
      const goldIntensity = 0.7 + Math.random() * 0.3;
      colors[i * 3] = 0.83 * goldIntensity;
      colors[i * 3 + 1] = 0.69 * goldIntensity;
      colors[i * 3 + 2] = 0.22 * goldIntensity;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (mainRef.current) {
      mainRef.current.rotation.y = t * 0.1;
    }

    if (coreRef.current) {
      const breathe = Math.sin(t * 2) * 0.08 + 1;
      coreRef.current.scale.setScalar(breathe);
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }

    if (neuralNetRef.current) {
      neuralNetRef.current.rotation.y = -t * 0.15;
      neuralNetRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((ring, i) => {
        const phase = t * 3 - i * 0.8;
        const scale = 1 + Math.sin(phase) * 0.15;
        ring.scale.setScalar(scale);
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat)
          mat.opacity =
            opacity *
            (isActive ? 0.5 - i * 0.1 : 0.1) *
            (0.5 + Math.sin(phase) * 0.5);
      });
    }

    if (orbitalRef.current) {
      orbitalRef.current.rotation.x = t * 0.4;
      orbitalRef.current.rotation.z = t * 0.25;
    }

    if (dataStreamRef.current && isActive) {
      const positions = dataStreamRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        // Animate DNA helix rotation
        const baseT = (i / (positions.length / 3)) * Math.PI * 6;
        const animT = baseT + t * 0.8;
        const strand = i % 2;
        const radius = 0.32 + Math.sin(t * 2 + i * 0.1) * 0.02;

        positions[i * 3] = Math.cos(animT + strand * Math.PI) * radius;
        positions[i * 3 + 2] = Math.sin(animT + strand * Math.PI) * radius;

        // Vertical flow
        positions[i * 3 + 1] += 0.004;
        if (positions[i * 3 + 1] > 0.4) positions[i * 3 + 1] = -0.4;
      }
      dataStreamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Luxurious hexagonal base */}
      <mesh position={[0, -0.42, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.05, 6]} />
        <meshStandardMaterial
          color="#030308"
          metalness={0.98}
          roughness={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Base gold inlay */}
      <mesh position={[0, -0.39, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.008, 16, 6]} />
        <meshStandardMaterial
          color={COLORS.gold}
          metalness={1}
          roughness={0.1}
          emissive={COLORS.gold}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.35, 64]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={opacity * (isActive ? 0.12 : 0.03)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic projection cone */}
      <mesh position={[0, -0.2, 0]}>
        <coneGeometry args={[0.35, 0.4, 32, 1, true]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={opacity * (isActive ? 0.05 : 0.01)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main holographic display */}
      <group ref={mainRef} position={[0, 0.08, 0]}>
        {/* Central AI Core - Multi-layer icosahedron */}
        <group ref={coreRef}>
          {/* Outer glass shell */}
          <mesh>
            <icosahedronGeometry args={[0.1, 1]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0}
              transmission={0.95}
              thickness={0.3}
              transparent
              opacity={opacity * 0.4}
            />
          </mesh>

          {/* Middle energy layer */}
          <mesh>
            <icosahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={opacity * (isActive ? 0.7 : 0.35)}
              wireframe
            />
          </mesh>

          {/* Inner core */}
          <mesh>
            <icosahedronGeometry args={[0.045, 0]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={opacity * (isActive ? 0.95 : 0.5)}
            />
          </mesh>

          {/* Core light */}
          <mesh>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
          </mesh>
        </group>

        {/* 3D Neural Network Sphere */}
        <group ref={neuralNetRef}>
          {/* Neural nodes */}
          {neuralNetwork.map((node, i) => (
            <group key={i} position={node.pos}>
              <mesh>
                <sphereGeometry args={[node.size, 12, 12]} />
                <meshBasicMaterial
                  color={
                    node.layer === 0
                      ? "#ffffff"
                      : node.layer === 1
                        ? COLORS.gold
                        : node.layer === 2
                          ? COLORS.navyLight
                          : "#4a6fa5"
                  }
                  transparent
                  opacity={opacity * (isActive ? 0.9 : 0.4)}
                />
              </mesh>
              {/* Node glow */}
              {node.layer < 2 && (
                <mesh>
                  <sphereGeometry args={[node.size * 1.8, 8, 8]} />
                  <meshBasicMaterial
                    color={COLORS.gold}
                    transparent
                    opacity={opacity * (isActive ? 0.15 : 0.05)}
                  />
                </mesh>
              )}
            </group>
          ))}

          {/* Neural connections */}
          {connections
            .slice(0, isActive ? connections.length : 20)
            .map((conn, i) => (
              <line key={i}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[
                      new Float32Array([
                        conn.start.x,
                        conn.start.y,
                        conn.start.z,
                        conn.end.x,
                        conn.end.y,
                        conn.end.z,
                      ]),
                      3,
                    ]}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={COLORS.gold}
                  transparent
                  opacity={opacity * conn.strength * (isActive ? 0.5 : 0.15)}
                />
              </line>
            ))}
        </group>

        {/* Pulse rings */}
        <group ref={pulseRingsRef}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12 + i * 0.045, 0.003, 8, 64]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? COLORS.gold : COLORS.navyLight}
                transparent
                opacity={opacity * 0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Orbital rings with particles */}
        <group ref={orbitalRef}>
          {[
            { radius: 0.32, tilt: [Math.PI / 4, 0, 0], color: COLORS.gold },
            {
              radius: 0.35,
              tilt: [Math.PI / 3, Math.PI / 3, 0],
              color: COLORS.navyLight,
            },
            {
              radius: 0.38,
              tilt: [Math.PI / 5, Math.PI / 6, Math.PI / 4],
              color: "#ffffff",
            },
          ].map((ring, i) => (
            <group key={i} rotation={ring.tilt as [number, number, number]}>
              <mesh>
                <torusGeometry args={[ring.radius, 0.002, 8, 64]} />
                <meshBasicMaterial
                  color={ring.color}
                  transparent
                  opacity={opacity * (isActive ? 0.6 - i * 0.15 : 0.15)}
                />
              </mesh>
              {/* Orbiting particles */}
              {[0, 1, 2].map((p) => (
                <mesh
                  key={p}
                  position={[
                    Math.cos((p / 3) * Math.PI * 2) * ring.radius,
                    0,
                    Math.sin((p / 3) * Math.PI * 2) * ring.radius,
                  ]}
                >
                  <sphereGeometry args={[0.012, 8, 8]} />
                  <meshBasicMaterial
                    color={ring.color}
                    transparent
                    opacity={opacity * (isActive ? 1 : 0.4)}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* DNA-style data stream */}
        {isActive && (
          <points ref={dataStreamRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[dataStream.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[dataStream.colors, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.01}
              vertexColors
              transparent
              opacity={0.9}
              sizeAttenuation
            />
          </points>
        )}
      </group>

      {/* Hexagonal base accents */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return (
          <group key={i}>
            <mesh
              position={[Math.cos(angle) * 0.4, -0.4, Math.sin(angle) * 0.4]}
            >
              <boxGeometry args={[0.025, 0.025, 0.025]} />
              <meshStandardMaterial
                color={COLORS.gold}
                metalness={1}
                roughness={0.1}
                emissive={COLORS.gold}
                emissiveIntensity={isActive ? 0.5 : 0.15}
                transparent
                opacity={opacity}
              />
            </mesh>
            {/* Connecting lines to center */}
            {isActive && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[
                      new Float32Array([
                        Math.cos(angle) * 0.4,
                        -0.39,
                        Math.sin(angle) * 0.4,
                        Math.cos(angle) * 0.1,
                        -0.39,
                        Math.sin(angle) * 0.1,
                      ]),
                      3,
                    ]}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={COLORS.gold}
                  transparent
                  opacity={opacity * 0.3}
                />
              </line>
            )}
          </group>
        );
      })}

      {/* Premium ambient lighting */}
      {isActive && (
        <>
          <pointLight
            color={COLORS.gold}
            intensity={3}
            distance={2}
            position={[0, 0.15, 0]}
          />
          <pointLight
            color={COLORS.navyLight}
            intensity={1.5}
            distance={1.5}
            position={[0, -0.1, 0]}
          />
          <pointLight
            color="#ffffff"
            intensity={0.8}
            distance={1}
            position={[0, 0.3, 0]}
          />
        </>
      )}
    </group>
  );
}

// ============================================
// 2. LEAD FUNNEL - Funil com partículas
// ============================================
function LeadFunnel({
  isActive,
  intensity,
  opacity,
}: {
  isActive: boolean;
  intensity: number;
  opacity: number;
}) {
  const funnelRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const qualifiedRef = useRef<THREE.Points>(null);

  // Particles falling through funnel
  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.4;
      const y = Math.random() * 0.8;
      positions[i * 3] = Math.cos(angle) * r * (1 - y * 0.7);
      positions[i * 3 + 1] = 0.4 - y * 0.8;
      positions[i * 3 + 2] = Math.sin(angle) * r * (1 - y * 0.7);
      // Color based on position (qualified = cyan, unqualified = dim)
      const qualified = y > 0.6;
      colors[i * 3] = qualified ? 0 : 0.5;
      colors[i * 3 + 1] = qualified ? 0.95 : 0.5;
      colors[i * 3 + 2] = qualified ? 1 : 0.5;
    }
    return { positions, colors };
  }, []);

  // Qualified leads coming out bottom
  const qualifiedParticles = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.08;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = -0.4 - Math.random() * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (funnelRef.current) {
      funnelRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] -= 0.008;
        if (positions[i * 3 + 1] < -0.4) {
          positions[i * 3 + 1] = 0.4;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.4;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 2] = Math.sin(angle) * r;
        }
        // Narrow as they fall
        const y = positions[i * 3 + 1];
        const factor = Math.max(0.1, (y + 0.4) / 0.8);
        positions[i * 3] *= 0.995;
        positions[i * 3 + 2] *= 0.995;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (qualifiedRef.current && isActive) {
      const positions = qualifiedRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] -= 0.01;
        if (positions[i * 3 + 1] < -0.7) {
          positions[i * 3 + 1] = -0.4;
        }
      }
      qualifiedRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={funnelRef}>
      {/* Base */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.06, 32]} />
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Funnel body - glass (wide at top, narrow at bottom) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.1, 0.7, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#0a0a15"
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={0.3}
          transparent
          opacity={opacity * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Funnel rim at top */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#2a2a3e"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Funnel spout (narrow exit at bottom) */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.2, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Filter rings inside funnel (larger at top, smaller at bottom) */}
      {[0.15, 0, -0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35 - i * 0.08, 0.008, 8, 32]} />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={opacity * (isActive ? 0.6 : 0.2)}
          />
        </mesh>
      ))}

      {/* Falling particles (leads) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={opacity * (isActive ? 0.9 : 0.4)}
          sizeAttenuation
        />
      </points>

      {/* Qualified leads dropping */}
      <points ref={qualifiedRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[qualifiedParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={COLORS.gold}
          transparent
          opacity={opacity * (isActive ? 1 : 0.3)}
          sizeAttenuation
        />
      </points>

      {/* Score indicators */}
      {["A", "B", "C"].map((label, i) => (
        <group key={i} position={[0.55, 0.2 - i * 0.25, 0]}>
          <mesh>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial
              color={
                i === 0 ? COLORS.gold : i === 1 ? COLORS.navyLight : "#444455"
              }
              transparent
              opacity={opacity * (isActive ? 0.8 : 0.3)}
            />
          </mesh>
        </group>
      ))}

      {/* Collection container glow */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.25, 32]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={opacity * (isActive ? 0.5 : 0.15)}
        />
      </mesh>

      {isActive && (
        <pointLight
          color={COLORS.gold}
          intensity={1.5}
          distance={2.5}
          position={[0, -0.3, 0]}
        />
      )}
    </group>
  );
}

// ============================================
// 3. LUXURY CRYSTAL - Quiet Luxury Premium Marketing
// ============================================
function AdBillboard({
  isActive,
  intensity,
  opacity,
}: {
  isActive: boolean;
  intensity: number;
  opacity: number;
}) {
  const crystalRef = useRef<THREE.Group>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Floating luxury particles
  const particles = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.4;
      const height = (Math.random() - 0.5) * 0.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (crystalRef.current) {
      // Elegant slow rotation
      crystalRef.current.rotation.y = t * 0.12;
    }

    if (innerGlowRef.current) {
      // Pulsing inner glow
      const pulse = Math.sin(t * 1.5) * 0.15 + 0.85;
      innerGlowRef.current.scale.setScalar(pulse);
    }

    if (ringsRef.current && isActive) {
      ringsRef.current.rotation.y = -t * 0.2;
      ringsRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }

    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        // Gentle spiral movement
        const angle = t * 0.2 + i * 0.5;
        const baseRadius = 0.3 + (i % 10) * 0.04;
        positions[i * 3] = Math.cos(angle + i) * baseRadius;
        positions[i * 3 + 2] = Math.sin(angle + i) * baseRadius;
        positions[i * 3 + 1] += Math.sin(t + i) * 0.001;
        if (positions[i * 3 + 1] > 0.5) positions[i * 3 + 1] = -0.4;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Luxurious marble base */}
      <mesh position={[0, -0.48, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.06, 64]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Gold accent ring on base */}
      <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.15}
          emissive="#d4af37"
          emissiveIntensity={isActive ? 0.3 : 0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Elegant pedestal */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.35, 32]} />
        <meshStandardMaterial
          color="#12121a"
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Gold pedestal accent */}
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.008, 16, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.15}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Crystal holder */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 0.08, 6]} />
        <meshStandardMaterial
          color="#1a1a25"
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Main crystal group */}
      <group ref={crystalRef} position={[0, 0.15, 0]}>
        {/* Inner glow core */}
        <mesh ref={innerGlowRef}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial
            color={COLORS.signalCyan}
            transparent
            opacity={opacity * (isActive ? 0.6 : 0.2)}
          />
        </mesh>

        {/* Primary crystal - diamond cut */}
        <mesh>
          <octahedronGeometry args={[0.22, 0]} />
          <meshPhysicalMaterial
            color="#e8e8f0"
            metalness={0.1}
            roughness={0}
            transmission={0.95}
            thickness={1.5}
            ior={2.4}
            transparent
            opacity={opacity * 0.9}
          />
        </mesh>

        {/* Crystal facet highlights */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.225, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.5}
            transparent
            opacity={opacity * 0.3}
          />
        </mesh>

        {/* Gold crown accent at top */}
        <mesh position={[0, 0.18, 0]}>
          <coneGeometry args={[0.04, 0.06, 4]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.1}
            emissive="#d4af37"
            emissiveIntensity={isActive ? 0.4 : 0.15}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Floating diamond accents */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.28,
              Math.sin(i * 1.5) * 0.05,
              Math.sin((i * Math.PI) / 2) * 0.28,
            ]}
            rotation={[Math.PI / 4, (i * Math.PI) / 2, 0]}
          >
            <octahedronGeometry args={[0.025, 0]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={1}
              roughness={0.1}
              emissive="#d4af37"
              emissiveIntensity={isActive ? 0.5 : 0.2}
              transparent
              opacity={opacity}
            />
          </mesh>
        ))}
      </group>

      {/* Orbiting luxury rings */}
      <group ref={ringsRef} position={[0, 0.15, 0]}>
        <mesh rotation={[Math.PI / 6, 0, 0]}>
          <torusGeometry args={[0.32, 0.006, 8, 64]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.1}
            emissive="#d4af37"
            emissiveIntensity={isActive ? 0.3 : 0.1}
            transparent
            opacity={opacity * (isActive ? 0.9 : 0.4)}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.36, 0.004, 8, 64]} />
          <meshBasicMaterial
            color={COLORS.signalCyan}
            transparent
            opacity={opacity * (isActive ? 0.5 : 0.15)}
          />
        </mesh>
      </group>

      {/* Ambient luxury particles */}
      {isActive && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.015}
            color="#d4af37"
            transparent
            opacity={0.7}
            sizeAttenuation
          />
        </points>
      )}

      {/* Subtle spotlight from above */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.25, 0.4, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity * (isActive ? 0.04 : 0.01)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Base reflection ring */}
      <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 64]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={opacity * (isActive ? 0.08 : 0.02)}
        />
      </mesh>

      {/* Premium lighting */}
      {isActive && (
        <>
          <pointLight
            color="#ffffff"
            intensity={1.5}
            distance={2}
            position={[0, 0.5, 0]}
          />
          <pointLight
            color={COLORS.gold}
            intensity={1}
            distance={2}
            position={[0.3, 0.2, 0.3]}
          />
          <pointLight
            color={COLORS.navyBlue}
            intensity={0.5}
            distance={1.5}
            position={[-0.3, 0.1, -0.3]}
          />
        </>
      )}
    </group>
  );
}

// ============================================
// 4. GEAR SYSTEM - Engrenagens interconectadas
// ============================================
function GearSystem({
  isActive,
  intensity,
  opacity,
}: {
  isActive: boolean;
  intensity: number;
  opacity: number;
}) {
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const gear3Ref = useRef<THREE.Mesh>(null);
  const smallGearRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const speed = isActive ? 1 : 0.3;
    const t = state.clock.elapsedTime * speed;
    if (gear1Ref.current) gear1Ref.current.rotation.z = t * 0.5;
    if (gear2Ref.current) gear2Ref.current.rotation.z = -t * 0.7;
    if (gear3Ref.current) gear3Ref.current.rotation.z = t * 0.5;
    if (smallGearRef.current) smallGearRef.current.rotation.z = -t * 1.2;
  });

  const GearShape = ({
    radius,
    teeth,
    thickness,
    innerRadius = 0.3,
  }: {
    radius: number;
    teeth: number;
    thickness: number;
    innerRadius?: number;
  }) => {
    const shape = useMemo(() => {
      const s = new THREE.Shape();
      const toothDepth = radius * 0.15;
      const toothWidth = (Math.PI * 2) / teeth / 2;

      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
        const midAngle = angle + toothWidth;

        // Tooth base
        s.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        // Tooth tip
        s.lineTo(
          Math.cos(angle + toothWidth * 0.3) * (radius + toothDepth),
          Math.sin(angle + toothWidth * 0.3) * (radius + toothDepth),
        );
        s.lineTo(
          Math.cos(angle + toothWidth * 0.7) * (radius + toothDepth),
          Math.sin(angle + toothWidth * 0.7) * (radius + toothDepth),
        );
        // Back to base
        s.lineTo(Math.cos(midAngle) * radius, Math.sin(midAngle) * radius);
      }
      s.closePath();

      // Center hole
      const hole = new THREE.Path();
      hole.absellipse(
        0,
        0,
        innerRadius * radius,
        innerRadius * radius,
        0,
        Math.PI * 2,
        true,
        0,
      );
      s.holes.push(hole);

      return s;
    }, [radius, teeth, innerRadius]);

    return (
      <mesh>
        <extrudeGeometry
          args={[shape, { depth: thickness, bevelEnabled: false }]}
        />
        <meshStandardMaterial
          color="#2a2a3e"
          metalness={0.9}
          roughness={0.3}
          emissive={COLORS.gold}
          emissiveIntensity={isActive ? 0.1 : 0.02}
          transparent
          opacity={opacity}
        />
      </mesh>
    );
  };

  return (
    <group>
      {/* Base plate */}
      <RoundedBox args={[1.2, 0.08, 0.8]} radius={0.02} position={[0, -0.4, 0]}>
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Main gear (large) */}
      <group
        ref={gear1Ref}
        position={[-0.2, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <GearShape radius={0.3} teeth={16} thickness={0.06} />
        {/* Center hub */}
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* Second gear (medium) */}
      <group
        ref={gear2Ref}
        position={[0.25, 0.15, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <GearShape radius={0.2} teeth={12} thickness={0.06} />
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* Third gear (medium) */}
      <group
        ref={gear3Ref}
        position={[0.25, -0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <GearShape radius={0.18} teeth={10} thickness={0.06} />
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>

      {/* Small gear */}
      <group
        ref={smallGearRef}
        position={[-0.35, 0.28, 0.05]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <GearShape radius={0.1} teeth={8} thickness={0.04} innerRadius={0.4} />
      </group>

      {/* Connecting rods */}
      <mesh position={[-0.2, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial
          color="#15151f"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Energy flow indicators */}
      {isActive && (
        <group>
          {[
            [-0.2, 0],
            [0.25, 0.15],
            [0.25, -0.2],
          ].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.08]}>
              <ringGeometry args={[0.08, 0.1, 16]} />
              <meshBasicMaterial
                color={COLORS.gold}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Automation flow arrows */}
      <group position={[0.5, 0, 0]}>
        {[0.15, 0, -0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.03, 0.08, 3]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={opacity * (isActive ? 0.8 : 0.3)}
            />
          </mesh>
        ))}
      </group>

      {isActive && (
        <pointLight color={COLORS.gold} intensity={1.5} distance={2.5} />
      )}
    </group>
  );
}

// ============================================
// 5. BALANCE SCALE - Balança de precisão
// ============================================
function BalanceScale({
  isActive,
  intensity,
  opacity,
}: {
  isActive: boolean;
  intensity: number;
  opacity: number;
}) {
  const beamRef = useRef<THREE.Group>(null);
  const leftPanRef = useRef<THREE.Group>(null);
  const rightPanRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      // Gentle balance oscillation
      const tilt =
        Math.sin(state.clock.elapsedTime * 0.8) * (isActive ? 0.08 : 0.03);
      beamRef.current.rotation.z = tilt;
    }
    if (leftPanRef.current && rightPanRef.current) {
      const tilt =
        Math.sin(state.clock.elapsedTime * 0.8) * (isActive ? 0.1 : 0.04);
      leftPanRef.current.position.y = -0.1 - tilt;
      rightPanRef.current.position.y = -0.1 + tilt;
    }
    if (needleRef.current) {
      needleRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.8) * (isActive ? 0.15 : 0.05);
    }
  });

  return (
    <group>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.08, 32]} />
        <meshStandardMaterial
          color="#0a0a12"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Center pillar */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Decorative rings on pillar */}
      {[-0.3, -0.1, 0.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.01, 8, 16]} />
          <meshStandardMaterial
            color="#2a2a3e"
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* Fulcrum point */}
      <mesh position={[0, 0.2, 0]}>
        <octahedronGeometry args={[0.05]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
          emissive="#ffd700"
          emissiveIntensity={isActive ? 0.3 : 0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Balance beam */}
      <group ref={beamRef} position={[0, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 0.03, 0.04]} />
          <meshStandardMaterial
            color="#2a2a3e"
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Beam end decorations */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={opacity}
            />
          </mesh>
        ))}

        {/* Chain links (left) */}
        <group position={[-0.4, -0.05, 0]}>
          {[0, -0.05, -0.1].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <torusGeometry args={[0.015, 0.004, 8, 16]} />
              <meshStandardMaterial
                color="#3a3a4e"
                metalness={0.9}
                roughness={0.2}
                transparent
                opacity={opacity}
              />
            </mesh>
          ))}
        </group>

        {/* Chain links (right) */}
        <group position={[0.4, -0.05, 0]}>
          {[0, -0.05, -0.1].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <torusGeometry args={[0.015, 0.004, 8, 16]} />
              <meshStandardMaterial
                color="#3a3a4e"
                metalness={0.9}
                roughness={0.2}
                transparent
                opacity={opacity}
              />
            </mesh>
          ))}
        </group>

        {/* Left pan */}
        <group ref={leftPanRef} position={[-0.4, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.12, 0.03, 32]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.3}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Value indicator on pan */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 6]} />
            <meshBasicMaterial
              color={COLORS.navyLight}
              transparent
              opacity={opacity * (isActive ? 0.7 : 0.3)}
            />
          </mesh>
          {/* "Data" label */}
          <mesh position={[0, -0.08, 0]}>
            <planeGeometry args={[0.1, 0.03]} />
            <meshBasicMaterial
              color={COLORS.navyLight}
              transparent
              opacity={opacity * (isActive ? 0.8 : 0.3)}
            />
          </mesh>
        </group>

        {/* Right pan */}
        <group ref={rightPanRef} position={[0.4, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.12, 0.03, 32]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.3}
              transparent
              opacity={opacity}
            />
          </mesh>
          {/* Value indicator on pan */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={opacity * (isActive ? 0.7 : 0.3)}
            />
          </mesh>
          {/* "Value" label */}
          <mesh position={[0, -0.08, 0]}>
            <planeGeometry args={[0.1, 0.03]} />
            <meshBasicMaterial
              color={COLORS.gold}
              transparent
              opacity={opacity * (isActive ? 0.8 : 0.3)}
            />
          </mesh>
        </group>
      </group>

      {/* Center gauge */}
      <group position={[0, 0.05, 0.1]}>
        <mesh>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial
            color="#0a0a12"
            transparent
            opacity={opacity * 0.9}
          />
        </mesh>
        {/* Gauge markings */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry
            args={[0.05, 0.07, 32, 1, -Math.PI / 3, (Math.PI * 2) / 3]}
          />
          <meshBasicMaterial
            color={COLORS.gold}
            transparent
            opacity={opacity * (isActive ? 0.6 : 0.2)}
          />
        </mesh>
        {/* Needle */}
        <mesh ref={needleRef} position={[0, 0.02, 0.01]}>
          <boxGeometry args={[0.008, 0.06, 0.002]} />
          <meshBasicMaterial color={COLORS.gold} />
        </mesh>
      </group>

      {/* Price tag indicators */}
      {isActive && (
        <group position={[0, 0.5, 0]}>
          <mesh>
            <planeGeometry args={[0.3, 0.1]} />
            <meshBasicMaterial color="#0a0a15" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.15, 0.04]} />
            <meshBasicMaterial color={COLORS.gold} transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {isActive && (
        <>
          <pointLight
            color={COLORS.navyBlue}
            intensity={1}
            distance={2}
            position={[-0.3, 0, 0.3]}
          />
          <pointLight
            color={COLORS.gold}
            intensity={1}
            distance={2}
            position={[0.3, 0, 0.3]}
          />
        </>
      )}
    </group>
  );
}
