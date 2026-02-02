// MBRAS Academy - The Stack
// Hook for detecting reduced motion preference

import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return reducedMotion
}
