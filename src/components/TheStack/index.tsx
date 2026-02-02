// MBRAS Academy - The Stack
// Premium UX with smooth interactions

"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  OrbitControls,
  Stars,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Stack } from "./Stack";
import { InfoPanel, infoPanelStyles } from "./InfoPanel";
import { useLayerHover, useScrollProgress, useReducedMotion } from "./hooks";
import { LAYERS, COLORS, LayerId } from "./types";

export * from "./types";
export { useLayerHover, useScrollProgress, useReducedMotion } from "./hooks";

interface TheStackProps {
  onLayerSelect?: (layerId: LayerId) => void;
  enableScroll?: boolean;
  className?: string;
  sectionHeight?: string;
}

export function TheStack({
  onLayerSelect,
  enableScroll = false,
  className = "",
  sectionHeight = "100vh",
}: TheStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    activeLayer,
    hoveredLayer,
    focusedLayer,
    setHoveredLayer,
    setFocusedLayer,
  } = useLayerHover();

  const { progress, containerRef: scrollRef } = useScrollProgress();

  const activeLayerData = activeLayer
    ? (LAYERS.find((l) => l.id === activeLayer) ?? null)
    : null;

  const handleLayerClick = (layerId: LayerId) => {
    setFocusedLayer(layerId);
    onLayerSelect?.(layerId);
  };

  // Show loaded state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const styleId = "the-stack-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = infoPanelStyles + globalStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section
      ref={enableScroll ? scrollRef : containerRef}
      className={`the-stack-section ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: sectionHeight,
        backgroundColor: COLORS.absoluteBlack,
        overflow: "hidden",
      }}
    >
      {/* Main container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        }}
      >
        {/* Three.js Canvas */}
        <Canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[0, 0, 9]}
            fov={50}
            near={0.1}
            far={100}
          />

          {/* Smooth orbit controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={6}
            maxDistance={15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
            dampingFactor={0.03}
            enableDamping={true}
            rotateSpeed={0.5}
            zoomSpeed={0.5}
          />

          {/* Ambient lighting */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[10, 10, 5]} intensity={0.4} />
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.1}
            color="#4a9eff"
          />
          <pointLight
            position={[0, 5, 5]}
            intensity={0.3}
            color={COLORS.signalCyan}
          />

          {/* Background stars */}
          <Stars
            radius={50}
            depth={50}
            count={1000}
            factor={2}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Environment */}
          <Suspense fallback={null}>
            <Environment preset="night" />
          </Suspense>

          {/* The Stack */}
          <Suspense fallback={<LoadingFallback />}>
            <Stack
              activeLayer={activeLayer}
              hoveredLayer={hoveredLayer}
              focusedLayer={focusedLayer}
              onLayerHover={setHoveredLayer}
              onLayerClick={handleLayerClick}
              scrollProgress={enableScroll ? progress : 0}
            />
          </Suspense>

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0005]}
            />
          </EffectComposer>

          <Preload all />
        </Canvas>

        {/* Loading overlay */}
        <div
          className="loading-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: COLORS.absoluteBlack,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isLoaded ? 0 : 1,
            pointerEvents: isLoaded ? "none" : "auto",
            transition: "opacity 0.8s ease-out",
            zIndex: 100,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div className="loading-spinner" />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.85rem",
                color: COLORS.gold,
                marginTop: "1.25rem",
                opacity: 0.7,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Preparando experiência
            </p>
          </div>
        </div>

        {/* Info Panel */}
        <InfoPanel activeLayer={activeLayerData} position="right" />

        {/* Header */}
        <header
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "2rem 3rem",
            pointerEvents: "none",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.8s ease-out 0.3s",
            zIndex: 10,
          }}
        >
          {/* Logo & Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "2rem",
              fontWeight: 400,
              letterSpacing: "0.01em",
              color: COLORS.titaniumWhite,
              margin: 0,
            }}
          >
            <span
              style={{
                color: COLORS.gold,
                fontStyle: "italic",
              }}
            >
              MBRAS
            </span>{" "}
            <span style={{ fontWeight: 300 }}>Academy</span>
          </h1>
        </header>

        {/* Module navigation pills */}
        <nav
          style={{
            position: "absolute",
            left: "3rem",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.5s",
          }}
        >
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setHoveredLayer(layer.id)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              style={{
                background:
                  activeLayer === layer.id
                    ? `linear-gradient(90deg, ${COLORS.gold}12, transparent)`
                    : "transparent",
                border: "none",
                borderLeft:
                  activeLayer === layer.id
                    ? `2px solid ${COLORS.gold}`
                    : "2px solid transparent",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  color: activeLayer === layer.id ? COLORS.gold : COLORS.silver,
                  opacity: activeLayer === layer.id ? 1 : 0.7,
                  letterSpacing: "0.18em",
                  display: "block",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                }}
              >
                {layer.module}
              </span>
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "1.15rem",
                  color: COLORS.titaniumWhite,
                  opacity: activeLayer === layer.id ? 1 : 0.75,
                  fontWeight: activeLayer === layer.id ? 500 : 400,
                  display: "block",
                  marginTop: "6px",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {layer.title}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom info */}
        <footer
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.6s",
          }}
        >
          <span
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: "0.7rem",
              color: COLORS.platinum,
              opacity: 0.4,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            MBRAS × IBVI
          </span>
          <span
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: "0.7rem",
              color: COLORS.gold,
              opacity: 0.5,
            }}
          >
            2025
          </span>
        </footer>
      </div>
    </section>
  );
}

// Loading fallback - returns null for clean loading
function LoadingFallback() {
  return null;
}

// Global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-top-color: ${COLORS.gold};
    border-radius: 0;
    animation: spin 1.5s linear infinite;
    transform: rotate(45deg);
  }

  .hint-container {
    pointer-events: none;
  }

  nav button:hover span {
    opacity: 1 !important;
  }

  nav button:hover {
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.08), transparent) !important;
    border-left-color: ${COLORS.gold} !important;
  }
`;

export default TheStack;
