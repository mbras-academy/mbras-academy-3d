// MBRAS Academy - The Stack
// Main Stack Component (Three.js Group)

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Layer } from "./Layer";
import { LAYERS, STACK_CONFIG, LayerId } from "./types";
import { useReducedMotion } from "./hooks";

interface StackProps {
  activeLayer: LayerId | null;
  hoveredLayer: LayerId | null;
  focusedLayer: LayerId | null;
  onLayerHover: (id: LayerId | null) => void;
  onLayerClick: (id: LayerId) => void;
  scrollProgress?: number;
}

export function Stack({
  activeLayer,
  hoveredLayer,
  focusedLayer,
  onLayerHover,
  onLayerClick,
  scrollProgress = 0,
}: StackProps) {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();

  // Calculate base Y positions for each layer
  // Inverted so that index 0 (Módulo 1) is at the TOP and index 4 (Módulo 6) is at the BOTTOM
  const totalHeight = (LAYERS.length - 1) * STACK_CONFIG.gapDefault;
  const startY = totalHeight / 2; // Start from top instead of bottom

  // Idle rotation animation
  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Only rotate when no layer is active
    if (!activeLayer) {
      groupRef.current.rotation.y += STACK_CONFIG.rotationSpeed;
    }

    // Subtle breathing effect
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    groupRef.current.position.y = breathe;
  });

  // Calculate rotation based on scroll (0-15deg range as per spec)
  const scrollRotationY = THREE.MathUtils.lerp(0, Math.PI / 12, scrollProgress);

  return (
    <group ref={groupRef} rotation={[0, scrollRotationY, 0]}>
      {LAYERS.map((layer, index) => {
        // Subtract instead of add to go from top to bottom
        const baseY = startY - index * STACK_CONFIG.gapDefault;
        const isActive = activeLayer === layer.id;
        const isDimmed = activeLayer !== null && activeLayer !== layer.id;
        const isFocused = focusedLayer === layer.id;

        return (
          <Layer
            key={layer.id}
            data={layer}
            isActive={isActive}
            isDimmed={isDimmed}
            isFocused={isFocused}
            reducedMotion={reducedMotion}
            onHover={(hovering) => onLayerHover(hovering ? layer.id : null)}
            onClick={() => onLayerClick(layer.id)}
            baseY={baseY}
            totalLayers={LAYERS.length}
          />
        );
      })}

      {/* Ambient particles (always present but subtle) */}
      <AmbientParticles active={!activeLayer} reducedMotion={reducedMotion} />
    </group>
  );
}

// Subtle ambient particles in the background
function AmbientParticles({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 50;

  // Create random positions
  const positions = useRef(new Float32Array(count * 3));

  // Initialize positions
  if (positions.current[0] === 0 && positions.current[1] === 0) {
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 6;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
  }

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;

    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Subtle floating motion
      posArray[i3 + 1] += Math.sin(time + i) * 0.0005;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useRef<THREE.BufferGeometry>(null);

  // Set up geometry once
  if (geometry.current === null) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.current, 3),
    );
    geometry.current = geo;
  }

  return (
    <points ref={pointsRef} geometry={geometry.current}>
      <pointsMaterial
        size={0.01}
        color="#F4F4F4"
        transparent
        opacity={active ? 0.15 : 0.05}
        sizeAttenuation
      />
    </points>
  );
}
