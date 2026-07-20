"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  /** Animation direction. Default: "up" */
  direction?: Direction;
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Duration in seconds. Default: 0.6 */
  duration?: number;
  /** Offset distance in px. Default: 24 */
  offset?: number;
  /** IntersectionObserver threshold. Default: 0.15 */
  threshold?: number;
  /** Additional className */
  className?: string;
  /** HTML tag to render. Default: "div" */
  as?: keyof JSX.IntrinsicElements;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

/**
 * Framer Motion wrapper for consistent reveal animations.
 * Automatically triggers on scroll into view and respects `prefers-reduced-motion`.
 */
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  offset = 24,
  threshold = 0.15,
  className,
  as = "div",
}: FadeInProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ threshold });
  const dir = directionMap[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: (dir.x ?? 0) * offset,
      y: (dir.y ?? 0) * offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // custom luxury ease-out
      },
    },
  };

  // Use `motion.div` as default — the `as` prop is only for semantic hints via className
  const MotionComponent = motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      role={as !== "div" ? undefined : undefined}
    >
      {children}
    </MotionComponent>
  );
}
