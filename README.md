# MBRAS Academy 3D

Interactive 3D visualization platform for MBRAS Academy - a training program for luxury real estate professionals.

## Live Demo

- **Production:** https://academy3d.mbras.com.br
- **Vercel:** https://mbras-academy-3d.vercel.app

## Overview

MBRAS Academy 3D is an immersive web experience showcasing the academy's curriculum through interactive 3D objects. Each module is represented by a semantic 3D visualization that users can explore through rotation, zoom, and navigation.

### Modules

| Module | Title | 3D Object | Description |
|--------|-------|-----------|-------------|
| Módulo 1 | Fundamentos de IA | Neural Hologram | Spherical neural network with animated connections |
| Módulo 2 | Qualificação de Leads | Lead Funnel | Glass funnel with particle flow simulation |
| Módulo 3 | Automações e CRM | Gear System | Interlocking gears with energy indicators |
| Módulo 4 | Precificação Inteligente | Balance Scale | Precision scale with animated oscillation |

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **3D Engine:** React Three Fiber (@react-three/fiber)
- **3D Helpers:** @react-three/drei (OrbitControls, Stars, Environment, Text)
- **Post-processing:** @react-three/postprocessing (Bloom, ChromaticAberration)
- **Styling:** CSS-in-JS with inline styles
- **Fonts:** Playfair Display (Google Fonts)
- **Deployment:** Vercel

## Features

### Desktop Experience
- Full-screen 3D canvas with orbit controls
- Left sidebar navigation with module pills
- Right info panel with module details and topics
- Post-processing effects (Bloom, Chromatic Aberration)
- Smooth hover/click interactions
- Stars background with environment lighting

### Mobile Experience
- Touch swipe navigation between modules
- Bottom info panel with module details
- Slide-down menu for module selection
- Swipe progress indicator dots
- Optimized rendering (lower DPR, fewer particles)
- Touch-friendly button sizes (44px minimum)
- iOS overscroll prevention

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page mounting TheStack
│   └── globals.css         # Global styles
│
└── components/
    └── TheStack/
        ├── index.tsx       # Main component (Canvas, UI, mobile/desktop)
        ├── Stack.tsx       # 3D stack container with layer positioning
        ├── Layer.tsx       # Individual layer with 3D objects
        ├── InfoPanel.tsx   # Module details panel (desktop)
        ├── LayerVisual.tsx # Visual selector (deprecated)
        ├── hooks.ts        # Custom hooks (useLayerHover, useScrollProgress)
        ├── types.ts        # TypeScript types, COLORS, LAYERS data
        └── visuals/        # Additional visual components
```

## Color Palette

```typescript
const COLORS = {
  absoluteBlack: "#000000",
  onyx: "#0a0a0f",
  richBlack: "#050508",
  navyBlue: "#1a3a5c",
  navyLight: "#2a4a6c",
  navyDark: "#0f2a4c",
  gold: "#d4af37",
  goldLight: "#e8c547",
  goldDark: "#b89830",
  titaniumWhite: "#f4f4f4",
  platinum: "#e8e8e8",
  silver: "#a8a8a8",
};
```

## 3D Objects Detail

### 1. Neural Hologram (AI Foundations)
- Multi-layer icosahedron core (glass + wireframe + solid)
- 46 neural nodes distributed via Fibonacci sphere algorithm
- Dynamic connections between nearby nodes
- DNA-style double helix particle stream
- Pulsing rings with animated opacity
- Triple orbital rings with orbiting particles
- Hexagonal luxury base with gold accents

### 2. Lead Funnel (Lead Qualification)
- Glass funnel with transmission material
- Particle system simulating leads falling
- Filter rings inside funnel
- Qualified leads dropping from spout
- Score indicators (A, B, C grades)
- Collection container with glow effect

### 3. Gear System (Automations & CRM)
- Multiple interlocking gears with rotation
- Procedural gear shape generation
- Connecting rods between gears
- Energy flow indicators when active
- Automation flow arrows

### 4. Balance Scale (Intelligent Pricing)
- Animated beam oscillation
- Dual pans with value indicators
- Chain link connections
- Center gauge with needle
- Price tag display when active

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/mbras-academy/mbras-academy-3d.git
cd mbras-academy-3d
npm install
```

### Running Locally
```bash
npm run dev
```
Open http://localhost:3000

### Building
```bash
npm run build
```

### Deployment
```bash
npx vercel --prod
```

## Configuration

### Stack Configuration (types.ts)
```typescript
export const STACK_CONFIG = {
  gapDefault: 1.8,
  gapExpanded: 2.2,
  gapCompressed: 1.4,
  rotationSpeed: 0.1,
  hoverScale: 1.1,
  activeScale: 1.15,
};
```

### Layer Data Structure
```typescript
interface LayerData {
  id: LayerId;
  index: number;
  module: string;      // e.g., "Módulo 1"
  title: string;       // e.g., "Fundamentos de IA"
  subtitle: string;    // Brief description
  description: string; // Full description
  topics: string[];    // List of topics covered
}
```

## Performance Optimizations

### Mobile
- DPR capped at 1.5 (vs 2 on desktop)
- 500 stars (vs 1000 on desktop)
- Chromatic aberration disabled
- Low-power GPU preference
- Zoom disabled
- Simplified post-processing

### General
- AdaptiveDpr for dynamic resolution
- AdaptiveEvents for event optimization
- Suspense boundaries for lazy loading
- Preload all assets
- Memoized geometry calculations

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Credits

- **Design & Development:** MBRAS × IBVI
- **3D Visualization:** Custom React Three Fiber components
- **Typography:** Playfair Display by Claus Eggers Sørensen

## License

Private - MBRAS Academy 2025

---

**Repository:** https://github.com/mbras-academy/mbras-academy-3d
