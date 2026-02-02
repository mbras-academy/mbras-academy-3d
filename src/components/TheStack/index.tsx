// MBRAS Academy - The Stack
// Premium UX with smooth interactions - Mobile First

"use client";

import { useRef, useEffect, Suspense, useState, useCallback } from "react";
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

// Custom hook for responsive detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const isMobile = useIsMobile();

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
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Mobile swipe navigation
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left" && activeModuleIndex < LAYERS.length - 1) {
        const newIndex = activeModuleIndex + 1;
        setActiveModuleIndex(newIndex);
        setHoveredLayer(LAYERS[newIndex].id);
      } else if (direction === "right" && activeModuleIndex > 0) {
        const newIndex = activeModuleIndex - 1;
        setActiveModuleIndex(newIndex);
        setHoveredLayer(LAYERS[newIndex].id);
      }
    },
    [activeModuleIndex, setHoveredLayer],
  );

  // Touch handling for swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleSwipe("left");
      } else {
        handleSwipe("right");
      }
    }
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

  // Set initial active layer on mobile
  useEffect(() => {
    if (isMobile && LAYERS.length > 0) {
      setHoveredLayer(LAYERS[0].id);
    }
  }, [isMobile, setHoveredLayer]);

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
        touchAction: "pan-y",
      }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
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
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Camera - closer on mobile */}
          <PerspectiveCamera
            makeDefault
            position={[0, 0, isMobile ? 7 : 9]}
            fov={isMobile ? 60 : 50}
            near={0.1}
            far={100}
          />

          {/* Smooth orbit controls - adjusted for mobile */}
          <OrbitControls
            enablePan={false}
            enableZoom={!isMobile}
            enableRotate={true}
            minDistance={isMobile ? 5 : 6}
            maxDistance={isMobile ? 10 : 15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
            dampingFactor={0.05}
            enableDamping={true}
            rotateSpeed={isMobile ? 0.3 : 0.5}
            zoomSpeed={0.5}
            touches={{
              ONE: 1, // ROTATE
              TWO: 2, // DOLLY_PAN
            }}
          />

          {/* Ambient lighting */}
          <ambientLight intensity={isMobile ? 0.2 : 0.15} />
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

          {/* Background stars - fewer on mobile */}
          <Stars
            radius={50}
            depth={50}
            count={isMobile ? 500 : 1000}
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

          {/* Post-processing effects - lighter on mobile */}
          <EffectComposer enabled={!isMobile || isLoaded}>
            <Bloom
              intensity={isMobile ? 0.8 : 1.2}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={isMobile ? [0, 0] : [0.0005, 0.0005]}
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
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
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

        {/* Info Panel - different layout for mobile */}
        {!isMobile && (
          <InfoPanel activeLayer={activeLayerData} position="right" />
        )}

        {/* Header */}
        <header
          className="main-header"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: isMobile ? "1rem 1.25rem" : "2rem 3rem",
            pointerEvents: "none",
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.8s ease-out 0.3s",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo & Title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: isMobile ? "1.35rem" : "2rem",
              fontWeight: 400,
              letterSpacing: "0.01em",
              color: COLORS.titaniumWhite,
              margin: 0,
            }}
          >
            <span style={{ color: COLORS.gold, fontStyle: "italic" }}>
              MBRAS
            </span>{" "}
            <span style={{ fontWeight: 300 }}>Academy</span>
          </h1>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "transparent",
                border: `1px solid ${COLORS.gold}40`,
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "0.7rem",
                  color: COLORS.gold,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Módulos
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.gold}
                strokeWidth="2"
                style={{
                  transform: mobileMenuOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s ease",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
        </header>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav
            className="desktop-nav"
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
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color:
                      activeLayer === layer.id ? COLORS.gold : COLORS.silver,
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
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
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
        )}

        {/* Mobile navigation menu (slide down) */}
        {isMobile && (
          <nav
            className="mobile-nav"
            style={{
              position: "absolute",
              top: "60px",
              left: 0,
              right: 0,
              backgroundColor: "rgba(5, 5, 8, 0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${COLORS.gold}30`,
              maxHeight: mobileMenuOpen ? "400px" : "0",
              overflow: "hidden",
              transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 50,
            }}
          >
            <div style={{ padding: "0.5rem 0" }}>
              {LAYERS.map((layer, index) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    setHoveredLayer(layer.id);
                    setActiveModuleIndex(index);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background:
                      activeLayer === layer.id
                        ? `linear-gradient(90deg, ${COLORS.gold}15, transparent)`
                        : "transparent",
                    border: "none",
                    borderLeft:
                      activeLayer === layer.id
                        ? `3px solid ${COLORS.gold}`
                        : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 500,
                      color: COLORS.gold,
                      opacity: activeLayer === layer.id ? 1 : 0.6,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      minWidth: "70px",
                    }}
                  >
                    {layer.module}
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "0.95rem",
                      color: COLORS.titaniumWhite,
                      opacity: activeLayer === layer.id ? 1 : 0.7,
                      fontWeight: activeLayer === layer.id ? 500 : 400,
                    }}
                  >
                    {layer.title}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Mobile bottom panel with current module info */}
        {isMobile && activeLayerData && (
          <div
            className="mobile-info-panel"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(5, 5, 8, 0.98) 70%, transparent)",
              padding: "4rem 1.25rem 1.5rem",
              zIndex: 20,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.5s",
            }}
          >
            {/* Swipe indicator */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {LAYERS.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === activeModuleIndex ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor:
                      index === activeModuleIndex
                        ? COLORS.gold
                        : `${COLORS.gold}40`,
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Module badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: COLORS.gold,
                  transform: "rotate(45deg)",
                }}
              />
              <span
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: COLORS.gold,
                  textTransform: "uppercase",
                }}
              >
                {activeLayerData.module}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: COLORS.titaniumWhite,
                margin: "0 0 0.5rem",
                lineHeight: 1.2,
              }}
            >
              {activeLayerData.title}
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.9rem",
                fontStyle: "italic",
                color: COLORS.gold,
                opacity: 0.9,
                margin: "0 0 1rem",
              }}
            >
              {activeLayerData.subtitle}
            </p>

            {/* Topics preview (first 2) */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {activeLayerData.topics.slice(0, 3).map((topic, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "0.7rem",
                    color: COLORS.platinum,
                    opacity: 0.7,
                    padding: "0.35rem 0.65rem",
                    border: `1px solid ${COLORS.gold}30`,
                    borderRadius: "2px",
                  }}
                >
                  {topic}
                </span>
              ))}
              {activeLayerData.topics.length > 3 && (
                <span
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: "0.7rem",
                    color: COLORS.gold,
                    opacity: 0.7,
                    padding: "0.35rem 0.65rem",
                  }}
                >
                  +{activeLayerData.topics.length - 3} mais
                </span>
              )}
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: COLORS.gold,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: COLORS.absoluteBlack,
                  textTransform: "uppercase",
                }}
              >
                Explorar Módulo
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.absoluteBlack}
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Swipe hint */}
            <p
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "0.65rem",
                color: COLORS.silver,
                opacity: 0.5,
                textAlign: "center",
                marginTop: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              Deslize para navegar entre módulos
            </p>
          </div>
        )}

        {/* Desktop footer */}
        {!isMobile && (
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
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
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
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "0.7rem",
                color: COLORS.gold,
                opacity: 0.5,
              }}
            >
              2025
            </span>
          </footer>
        )}
      </div>
    </section>
  );
}

// Loading fallback - returns null for clean loading
function LoadingFallback() {
  return null;
}

// Global styles with mobile improvements
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  * {
    -webkit-tap-highlight-color: transparent;
  }

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

  @media (max-width: 767px) {
    .loading-spinner {
      width: 40px;
      height: 40px;
    }
  }

  .hint-container {
    pointer-events: none;
  }

  .desktop-nav button:hover span {
    opacity: 1 !important;
  }

  .desktop-nav button:hover {
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.08), transparent) !important;
    border-left-color: ${COLORS.gold} !important;
  }

  .mobile-nav button:active {
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.2), transparent) !important;
  }

  .mobile-info-panel {
    will-change: transform;
  }

  /* Prevent overscroll bounce on iOS */
  .the-stack-section {
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
  }

  /* Better touch targets on mobile */
  @media (max-width: 767px) {
    button {
      min-height: 44px;
    }
  }

  /* Smooth scrolling for mobile menu */
  .mobile-nav {
    -webkit-overflow-scrolling: touch;
  }
`;

export default TheStack;
