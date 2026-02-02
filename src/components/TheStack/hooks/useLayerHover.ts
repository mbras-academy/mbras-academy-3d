// MBRAS Academy - The Stack
// Hook for managing layer hover/focus state

import { useState, useCallback } from 'react'
import type { LayerId } from '../types'

export interface UseLayerHoverReturn {
  activeLayer: LayerId | null
  hoveredLayer: LayerId | null
  focusedLayer: LayerId | null
  setHoveredLayer: (id: LayerId | null) => void
  setFocusedLayer: (id: LayerId | null) => void
}

export function useLayerHover(): UseLayerHoverReturn {
  const [hoveredLayer, setHoveredLayerState] = useState<LayerId | null>(null)
  const [focusedLayer, setFocusedLayerState] = useState<LayerId | null>(null)

  // Active layer is focused if set, otherwise hovered
  const activeLayer = focusedLayer ?? hoveredLayer

  const setHoveredLayer = useCallback((id: LayerId | null) => {
    setHoveredLayerState(id)
  }, [])

  const setFocusedLayer = useCallback((id: LayerId | null) => {
    setFocusedLayerState(id)
  }, [])

  return {
    activeLayer,
    hoveredLayer,
    focusedLayer,
    setHoveredLayer,
    setFocusedLayer
  }
}
