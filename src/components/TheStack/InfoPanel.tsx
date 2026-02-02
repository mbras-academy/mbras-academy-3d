// MBRAS Academy - The Stack
// Premium Info Panel Component - Luxury Edition

import { LayerData, COLORS } from "./types";

interface InfoPanelProps {
  activeLayer: LayerData | null;
  position?: "left" | "right";
}

export function InfoPanel({ activeLayer, position = "right" }: InfoPanelProps) {
  const isVisible = activeLayer !== null;

  return (
    <div
      className="info-panel"
      style={{
        position: "absolute",
        top: "50%",
        right: position === "right" ? "3rem" : "auto",
        left: position === "left" ? "3rem" : "auto",
        transform: `translateY(-50%) translateX(${isVisible ? "0" : "30px"})`,
        width: "380px",
        padding: "0",
        backgroundColor: "rgba(8, 8, 12, 0.95)",
        backdropFilter: "blur(24px)",
        borderRadius: "0",
        border: `1px solid rgba(212, 175, 55, ${isVisible ? 0.25 : 0})`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        overflow: "hidden",
        boxShadow: isVisible
          ? `0 25px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.05)`
          : "none",
      }}
    >
      {activeLayer && (
        <>
          {/* Top gold accent bar */}
          <div
            style={{
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          {/* Content */}
          <div style={{ padding: "2.25rem" }}>
            {/* Module badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: COLORS.gold,
                  transform: "rotate(45deg)",
                }}
              />
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  color: COLORS.gold,
                  textTransform: "uppercase",
                }}
              >
                {activeLayer.module}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                fontSize: "2rem",
                fontWeight: 400,
                color: COLORS.titaniumWhite,
                margin: "0 0 1rem",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}
            >
              {activeLayer.title}
            </h3>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
                fontSize: "1.05rem",
                fontWeight: 400,
                fontStyle: "italic",
                color: COLORS.gold,
                opacity: 0.9,
                margin: "0 0 1.5rem",
                lineHeight: 1.5,
              }}
            >
              {activeLayer.subtitle}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: "0.95rem",
                fontWeight: 400,
                color: COLORS.platinum,
                opacity: 0.7,
                margin: "0 0 1.75rem",
                lineHeight: 1.7,
              }}
            >
              {activeLayer.description}
            </p>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: `linear-gradient(90deg, ${COLORS.gold}50, ${COLORS.gold}10)`,
                margin: "0 0 1.75rem",
              }}
            />

            {/* Topics */}
            <div style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: COLORS.gold,
                  opacity: 0.7,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1.25rem",
                }}
              >
                Tópicos
              </span>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {activeLayer.topics.map((topic, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 400,
                      color: COLORS.platinum,
                      opacity: 0.85,
                      padding: "0.65rem 0",
                      paddingLeft: "1.5rem",
                      position: "relative",
                      lineHeight: 1.5,
                      borderLeft: `1px solid ${COLORS.gold}30`,
                      transition: "all 0.2s ease",
                    }}
                    className="topic-item"
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: "50%",
                        transform: "translateY(-50%) rotate(45deg)",
                        width: "7px",
                        height: "7px",
                        backgroundColor: COLORS.gold,
                        opacity: 0.8,
                      }}
                    />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: "100%",
                padding: "1.1rem 1.5rem",
                backgroundColor: "transparent",
                border: `1px solid ${COLORS.gold}50`,
                borderRadius: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s ease",
              }}
              className="cta-button"
            >
              <span
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: COLORS.gold,
                  textTransform: "uppercase",
                }}
              >
                Explorar Módulo
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={COLORS.gold}
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bottom gold accent */}
          <div
            style={{
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}20, transparent)`,
            }}
          />
        </>
      )}
    </div>
  );
}

// Styles
export const infoPanelStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  @keyframes gradient-flow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .info-panel {
    will-change: opacity, transform;
  }

  .topic-item:hover {
    opacity: 1 !important;
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.05), transparent);
    border-left-color: ${COLORS.gold} !important;
  }

  .cta-button:hover {
    background-color: rgba(212, 175, 55, 0.08) !important;
    border-color: ${COLORS.gold} !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.15);
  }

  .cta-button:active {
    transform: translateY(0);
  }
`;
