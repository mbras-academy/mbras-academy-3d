# Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    TheStack Component                     │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │                   React Three Fiber                  ││   │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  ││   │
│  │  │  │ Layer 1 │ │ Layer 2 │ │ Layer 3 │ │ Layer 4 │  ││   │
│  │  │  │ Neural  │ │ Funnel  │ │ Gears   │ │ Scale   │  ││   │
│  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘  ││   │
│  │  │                                                      ││   │
│  │  │  ┌──────────────────────────────────────────────┐  ││   │
│  │  │  │ Post-processing: Bloom + ChromaticAberration │  ││   │
│  │  │  └──────────────────────────────────────────────┘  ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │   Header    │  │  Nav Pills  │  │   Info Panel    │ │   │
│  │  │  (Desktop)  │  │  (Desktop)  │  │   (Desktop)     │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐│   │
│  │  │              Mobile Bottom Panel                     ││   │
│  │  │  (Swipe indicators, module info, CTA)               ││   │
│  │  └─────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
TheStack (index.tsx)
├── Canvas (React Three Fiber)
│   ├── PerspectiveCamera
│   ├── OrbitControls
│   ├── Lighting
│   │   ├── ambientLight
│   │   ├── directionalLight (x2)
│   │   └── pointLight
│   ├── Stars (background)
│   ├── Environment (night preset)
│   ├── Stack
│   │   └── Layer (x4)
│   │       ├── DeviceMesh
│   │       │   ├── NeuralBrain
│   │       │   ├── LeadFunnel
│   │       │   ├── GearSystem
│   │       │   └── BalanceScale
│   │       └── Text (module label)
│   └── EffectComposer
│       ├── Bloom
│       └── ChromaticAberration
├── Loading Overlay
├── Header
├── Desktop Navigation (nav pills)
├── Mobile Navigation (dropdown)
├── InfoPanel (desktop)
├── Mobile Bottom Panel
└── Footer (desktop)
```

## State Management

### useLayerHover Hook
```typescript
const {
  activeLayer,      // Currently active layer (hovered or focused)
  hoveredLayer,     // Layer being hovered
  focusedLayer,     // Layer that was clicked
  setHoveredLayer,  // Set hover state
  setFocusedLayer,  // Set focus state
} = useLayerHover();
```

### Mobile State
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [activeModuleIndex, setActiveModuleIndex] = useState(0);
const isMobile = useIsMobile(); // Custom hook for responsive detection
```

## 3D Object Specifications

### NeuralBrain (Módulo 1)

**Structure:**
- Hexagonal base (6-sided cylinder)
- Multi-layer icosahedron core
- Neural network sphere (46 nodes in 4 shells)
- Orbital rings (3 rings at different tilts)
- Particle stream (DNA helix pattern)

**Animation:**
- Main rotation: 0.1 rad/s
- Core breathing: sin(t*2) * 0.08 + 1
- Neural network counter-rotation: -0.15 rad/s
- Pulse rings: scale oscillation with phase offset
- Orbital rings: multi-axis rotation

**Node Distribution (Fibonacci Sphere):**
```typescript
const phi = Math.acos(1 - (2 * (i + 0.5)) / shell.count);
const theta = Math.PI * (1 + Math.sqrt(5)) * i;
```

### LeadFunnel (Módulo 2)

**Structure:**
- Base platform (cylinder)
- Glass funnel body (cylinder with transmission material)
- Funnel rim (torus)
- Funnel spout
- Filter rings (3 torus geometries)
- Particle systems (falling leads, qualified leads)

**Animation:**
- Funnel rotation: 0.1 rad/s
- Particles falling: y -= 0.008 per frame
- Particles narrowing as they fall
- Qualified particles: y -= 0.01 per frame

### GearSystem (Módulo 3)

**Structure:**
- Base plate (rounded box)
- 4 gears with procedural tooth generation
- Center hubs for each gear
- Connecting rods
- Energy flow indicators

**Gear Generation:**
```typescript
const GearShape = ({ radius, teeth, thickness, innerRadius }) => {
  // Creates Shape with teeth and center hole
  const toothDepth = radius * 0.15;
  const toothWidth = (Math.PI * 2) / teeth / 2;
  // ... tooth generation loop
};
```

**Animation:**
- Gear 1: rotation.z = t * 0.5
- Gear 2: rotation.z = -t * 0.7
- Gear 3: rotation.z = t * 0.5
- Small gear: rotation.z = -t * 1.2

### BalanceScale (Módulo 4)

**Structure:**
- Base (cylinder)
- Center pillar with decorative rings
- Fulcrum point (octahedron)
- Balance beam (box)
- Chain links (torus geometries)
- Left/right pans with indicators
- Center gauge with needle

**Animation:**
- Beam tilt: sin(t * 0.8) * 0.08
- Pan oscillation: synced with beam tilt
- Needle rotation: sin(t * 0.8) * 0.15

## Mobile Touch Implementation

### Swipe Detection
```typescript
const touchStartX = useRef(0);
const touchEndX = useRef(0);

const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = touchStartX.current - touchEndX.current;
  const threshold = 50;
  
  if (Math.abs(diff) > threshold) {
    handleSwipe(diff > 0 ? 'left' : 'right');
  }
};
```

### Performance Optimizations
```typescript
// Mobile-specific Canvas settings
gl={{
  antialias: !isMobile,
  powerPreference: isMobile ? "low-power" : "high-performance",
}}
dpr={isMobile ? [1, 1.5] : [1, 2]}

// Reduced particle count
<Stars count={isMobile ? 500 : 1000} />

// Disabled effects
offset={isMobile ? [0, 0] : [0.0005, 0.0005]}
```

## Styling System

### CSS-in-JS Pattern
All styles are inline using React's style prop with TypeScript type safety:

```typescript
style={{
  position: "absolute",
  backgroundColor: COLORS.absoluteBlack,
  // ...
}}
```

### Global Styles
Injected via useEffect with style tag:
```typescript
useEffect(() => {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}, []);
```

### Responsive Breakpoint
```typescript
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    // ...
  }, []);
  return isMobile;
};
```

## Materials Reference

### Glass/Transmission
```typescript
<meshPhysicalMaterial
  transmission={0.9}
  thickness={0.3}
  roughness={0}
  metalness={0.1}
/>
```

### Metallic Gold
```typescript
<meshStandardMaterial
  color={COLORS.gold}
  metalness={1}
  roughness={0.1}
  emissive={COLORS.gold}
  emissiveIntensity={0.4}
/>
```

### Emissive Glow
```typescript
<meshBasicMaterial
  color={COLORS.gold}
  transparent
  opacity={0.6}
/>
```

## Post-Processing Pipeline

```
Scene Render
    │
    ▼
┌─────────────────┐
│     Bloom       │ intensity: 1.2 (0.8 mobile)
│                 │ luminanceThreshold: 0.2
│                 │ luminanceSmoothing: 0.9
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Chromatic     │ offset: [0.0005, 0.0005]
│   Aberration    │ (disabled on mobile: [0, 0])
└────────┬────────┘
         │
         ▼
    Final Output
```

## Build & Deploy

### Build Command
```bash
npm run build
# Uses Next.js with Turbopack
```

### Vercel Configuration
- Framework: Next.js (auto-detected)
- Build Command: `next build`
- Output Directory: `.next`
- Node.js Version: 18.x

### Domain Configuration
- Primary: academy3d.mbras.com.br
- Vercel: mbras-academy-3d.vercel.app

DNS (Cloudflare):
```
Type: CNAME
Name: academy3d
Target: cname.vercel-dns.com
Proxy: DNS only (grey cloud)
```

## Known Limitations

1. **WebGL Required** - No fallback for browsers without WebGL
2. **Memory Usage** - 3D scenes can be memory-intensive on older devices
3. **iOS Safari** - Some transmission materials may render differently
4. **Reduced Motion** - System preference detected but minimal adjustments

## Future Improvements

1. Add loading progress indicator
2. Implement module detail pages
3. Add sound effects for interactions
4. Create AR mode for mobile
5. Add analytics tracking
6. Implement i18n for multiple languages
