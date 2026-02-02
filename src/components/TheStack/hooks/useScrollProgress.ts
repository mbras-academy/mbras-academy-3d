// MBRAS Academy - The Stack
// Hook for tracking scroll progress within a section

import { useState, useEffect, useRef, RefObject } from "react";

export interface UseScrollProgressReturn {
  progress: number;
  isInView: boolean;
  containerRef: RefObject<HTMLElement | null>;
}

export function useScrollProgress(): UseScrollProgressReturn {
  const containerRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the section has been scrolled
      const sectionHeight = rect.height - windowHeight;
      const scrolled = -rect.top;

      // Progress from 0 to 1 (handle division by zero when section equals viewport)
      const newProgress =
        sectionHeight <= 0
          ? 0
          : Math.max(0, Math.min(1, scrolled / sectionHeight));
      setProgress(newProgress);

      // Check if section is in view
      const inView = rect.top < windowHeight && rect.bottom > 0;
      setIsInView(inView);
    };

    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return {
    progress,
    isInView,
    containerRef,
  };
}
