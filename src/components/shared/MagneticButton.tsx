"use client";

import { useRef, ReactNode, useState, MouseEvent as ReactMouseEvent } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import styles from "./MagneticButton.module.css";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "ghost";
  onClick?: () => void;
  className?: string;
}

export default function MagneticButton({ 
  children, 
  href, 
  variant = "solid", 
  onClick,
  className = "" 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2); // max ~6px depending on button size
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const buttonClasses = `${styles.magneticBtn} ${styles[variant]} ${className}`;

  const Inner = () => (
    <>
      <span className={styles.label}>{children}</span>
      {/* Background layer for solid variant hover effect could go here */}
    </>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x, y }}
      className={styles.magneticWrapper}
    >
      {href ? (
        <a href={href} className={buttonClasses}>
          <Inner />
        </a>
      ) : (
        <button onClick={onClick} className={buttonClasses}>
          <Inner />
        </button>
      )}
    </motion.div>
  );
}
