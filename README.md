# MBRAS Academy - The Stack

> Precision is the curriculum.

## Overview

Este é o componente **The Stack** da MBRAS Academy — uma visualização 3D interativa de 5 camadas que representam a stack cognitiva do programa:

```
Signal → Structure → Intelligence → Control → Scale
```

## Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **3D Engine:** React Three Fiber + Three.js
- **Animação:** Nativo (useFrame) + CSS transitions
- **TypeScript:** Strict mode

## Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Demo page
│
└── components/
    └── TheStack/
        ├── index.tsx       # Container principal + Canvas
        ├── Stack.tsx       # Grupo 3D das camadas
        ├── Layer.tsx       # Camada individual
        ├── LayerVisual.tsx # Seletor de visual por tipo
        ├── InfoPanel.tsx   # Painel de informação (HTML)
        ├── types.ts        # Tipos e constantes
        │
        ├── hooks/
        │   ├── index.ts
        │   ├── useReducedMotion.ts
        │   ├── useLayerHover.ts
        │   └── useScrollProgress.ts
        │
        ├── visuals/
        │   ├── index.ts
        │   ├── SignalParticles.tsx    # Partículas caóticas
        │   ├── StructureGrid.tsx      # Grid wireframe
        │   ├── IntelligenceField.tsx  # Vector field
        │   ├── ControlLoop.tsx        # Feedback loops
        │   └── ScaleReplication.tsx   # Cubos replicantes
        │
        └── fallback/
            └── StackCSS.tsx  # Fallback sem WebGL
```

## Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd mbras-academy

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev
```

## Uso do Componente

```tsx
import { TheStack } from '@/components/TheStack'

export default function Page() {
  const handleLayerSelect = (layerId: LayerId) => {
    console.log('Selected:', layerId)
    // Navigate to deep dive
  }

  return (
    <TheStack
      onLayerSelect={handleLayerSelect}
      enableScroll={true}
      sectionHeight="250vh"
    />
  )
}
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `onLayerSelect` | `(id: LayerId) => void` | - | Callback quando uma camada é clicada |
| `enableScroll` | `boolean` | `true` | Habilita animação baseada em scroll |
| `sectionHeight` | `string` | `'200vh'` | Altura da seção para cálculo de scroll |
| `className` | `string` | `''` | Classes CSS adicionais |

## Camadas

Cada camada possui um visual único:

| Camada | Visual | Conceito |
|--------|--------|----------|
| **Signal** | Partículas caóticas | Dados brutos, entropia |
| **Structure** | Grid wireframe | Padrões, conexões |
| **Intelligence** | Vector field | Gradientes, fluxo |
| **Control** | Feedback loops | Regulação, estabilidade |
| **Scale** | Cubos replicantes | Paralelismo, crescimento |

## Performance

Targets definidos na spec:

- FPS Desktop: 60 (crítico: >45)
- FPS Mobile: 30 (crítico: >24)
- First Paint: <1.5s
- GPU Memory: <150MB

## Acessibilidade

- Suporte a `prefers-reduced-motion`
- Fallback CSS para browsers sem WebGL
- Navegação por teclado (em desenvolvimento)

## Próximos Passos

1. [ ] Integração com GSAP ScrollTrigger
2. [ ] Transição para Deep Dive
3. [ ] Theatre.js para orquestração
4. [ ] Shaders customizados
5. [ ] Testes de performance

---

**MBRAS Academy**  
*Built for those who already know the basics.*
