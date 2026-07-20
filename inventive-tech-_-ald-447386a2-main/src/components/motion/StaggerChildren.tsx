"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface StaggerChildrenProps {
  children: ReactNode;
  /** Delay between each child animation in seconds. Default: 0.08 */
  staggerDelay?: number;
  /** Duration for each child animation in seconds. Default: 0.5 */
  duration?: number;
  /** IntersectionObserver threshold. Default: 0.1 */
  threshold?: number;
  /** Additional className */
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

/**
 * Framer Motion stagger container for animating lists/grids of children.
 * Each direct child should use `StaggerItem` for the fade-up effect.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  duration = 0.5,
  threshold = 0.1,
  className,
}: StaggerChildrenProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      custom={staggerDelay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  /** Additional className */
  className?: string;
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Individual stagger child — use inside a `StaggerChildren` container.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
