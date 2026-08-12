"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function RevealOnScroll({ children, delay = 0, className = "" }: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1.2,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
