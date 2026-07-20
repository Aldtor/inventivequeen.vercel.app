import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  /** IntersectionObserver threshold (0–1). Default: 0.15 */
  threshold?: number;
  /** Only trigger once. Default: true */
  once?: boolean;
  /** Root margin for earlier/later triggering. Default: "0px" */
  rootMargin?: string;
}

/**
 * Replaces the repeated IntersectionObserver pattern across components.
 * Returns a ref to attach to the observed element and an `isInView` boolean.
 * Automatically respects `prefers-reduced-motion` — returns `true` immediately
 * so content is visible without animation.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.15, once = true, rootMargin = "0px" } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Respect reduced motion — skip animation, show content immediately
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isInView };
}
