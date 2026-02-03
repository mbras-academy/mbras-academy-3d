# CLAUDE.md - MBRAS Academy 3D

## Project Overview

This is an interactive 3D visualization platform for MBRAS Academy, a training program for luxury real estate professionals. Built with Next.js and React Three Fiber.

**Live URLs:**
- Production: https://academy3d.mbras.com.br
- Vercel: https://mbras-academy-3d.vercel.app

**Repository:** https://github.com/mbras-academy/mbras-academy-3d

## Quick Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build & Deploy
npm run build        # Build for production
npx vercel --prod    # Deploy to Vercel

# Lint
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (mounts TheStack)
│   └── globals.css         # Global styles
│
└── components/
    └── TheStack/
        ├── index.tsx       # Main component (Canvas, UI, responsive)
        ├── Stack.tsx       # 3D stack container
        ├── Layer.tsx       # 3D objects (NeuralBrain, LeadFunnel, etc.)
        ├── InfoPanel.tsx   # Desktop info panel
        ├── hooks.ts        # useLayerHover, useScrollProgress, useReducedMotion
        └── types.ts        # Types, COLORS, LAYERS data
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/components/TheStack/index.tsx` | Main component with Canvas, all UI, mobile/desktop logic |
| `src/components/TheStack/Layer.tsx` | All 3D objects (NeuralBrain, LeadFunnel, GearSystem, BalanceScale) |
| `src/components/TheStack/types.ts` | COLORS palette, LAYERS data, TypeScript types |
| `src/components/TheStack/InfoPanel.tsx` | Desktop right panel with module details |

## The 4 Modules

| ID | Module | Title | 3D Object |
|----|--------|-------|-----------|
| signal | Módulo 1 | Fundamentos de IA | NeuralBrain (neural hologram) |
| structure | Módulo 2 | Qualificação de Leads | LeadFunnel (glass funnel) |
| control | Módulo 3 | Automações e CRM | GearSystem (interlocking gears) |
| scale | Módulo 4 | Precificação Inteligente | BalanceScale (precision scale) |

## Color Palette (MBRAS Brand)

```typescript
// Primary
gold: "#d4af37"
navyBlue: "#1a3a5c"

// Backgrounds
absoluteBlack: "#000000"
onyx: "#0a0a0f"
richBlack: "#050508"

// Text
titaniumWhite: "#f4f4f4"
platinum: "#e8e8e8"
silver: "#a8a8a8"
```

## Common Tasks

### Adding a New Module

1. Add to `LayerId` type in `types.ts`
2. Add layer data to `LAYERS` array in `types.ts`
3. Add device config in `DEVICE_CONFIG` in `Layer.tsx`
4. Create 3D component function in `Layer.tsx`
5. Add case to `DeviceMesh` switch in `Layer.tsx`

### Modifying 3D Objects

All 3D objects are in `Layer.tsx`:
- `NeuralBrain` - Lines 188-640
- `LeadFunnel` - Lines 645-890
- `GearSystem` - Lines 1250-1420
- `BalanceScale` - Lines 1460-1700

### Changing Colors

Edit `COLORS` object in `types.ts`. All components reference these constants.

### Mobile Adjustments

Mobile detection: `useIsMobile()` hook in `index.tsx`
- Breakpoint: 768px
- Mobile-specific rendering wrapped in `{isMobile && ...}`
- Desktop-specific rendering wrapped in `{!isMobile && ...}`

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **3D:** React Three Fiber, @react-three/drei, @react-three/postprocessing
- **Language:** TypeScript
- **Styling:** CSS-in-JS (inline styles)
- **Fonts:** Playfair Display (Google Fonts)
- **Deploy:** Vercel

## Performance Notes

### Mobile Optimizations
- DPR: 1-1.5 (vs 1-2 desktop)
- Stars: 500 (vs 1000 desktop)
- Chromatic aberration: disabled
- GPU: low-power preference
- Zoom: disabled

### General
- Uses `AdaptiveDpr` for dynamic resolution
- `Suspense` boundaries for lazy loading
- Memoized geometry calculations with `useMemo`

## TypeScript Gotchas

### bufferAttribute
Use `args` prop instead of `count`/`array`/`itemSize`:
```tsx
// ✅ Correct
<bufferAttribute args={[positions, 3]} attach="attributes-position" />

// ❌ Wrong
<bufferAttribute count={100} array={positions} itemSize={3} />
```

### Geometry rotation
Put `rotation` on mesh, not geometry:
```tsx
// ✅ Correct
<mesh rotation={[Math.PI / 2, 0, 0]}>
  <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
</mesh>

// ❌ Wrong
<mesh>
  <cylinderGeometry args={[...]} rotation={[...]} />
</mesh>
```

## Deployment

### Vercel
```bash
npx vercel --prod --yes
```

### Custom Domain (Cloudflare DNS)
```
Type: CNAME
Name: academy3d
Target: cname.vercel-dns.com
Proxy: DNS only (grey cloud)
```

## Documentation

- `README.md` - Project overview and setup
- `docs/TECHNICAL.md` - Architecture and 3D specs
- `docs/CONTENT.md` - Course content details
- `CHANGELOG.md` - Version history and roadmap

## Contact

- **Client:** MBRAS
- **Development:** IBVI
- **Year:** 2025
