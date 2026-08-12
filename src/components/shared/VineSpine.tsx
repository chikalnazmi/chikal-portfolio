"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import styles from "./VineSpine.module.css";

interface SectionMarker {
  id: string;
  top: number;
}

export default function VineSpine() {
  const [markers, setMarkers] = useState<SectionMarker[]>([]);
  const [docHeight, setDocHeight] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const calculatePositions = () => {
      const sectionIds = [
        "about",
        "experience",
        "achievements",
        "creator",
        "creativity",
        "projects",
        "skills",
        "contact"
      ];
      
      const newMarkers: SectionMarker[] = [];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          // relative to document
          const rect = el.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          newMarkers.push({
            id,
            top: rect.top + scrollTop
          });
        }
      });
      
      setMarkers(newMarkers);
      setDocHeight(document.body.scrollHeight);
    };

    calculatePositions();
    
    // Recalculate on resize or when content might change
    window.addEventListener("resize", calculatePositions);
    
    // A small delay to ensure all images/fonts are loaded and layout is settled
    const timeout = setTimeout(calculatePositions, 1000);
    
    return () => {
      window.removeEventListener("resize", calculatePositions);
      clearTimeout(timeout);
    };
  }, []);

  if (docHeight === 0) return null;

  return (
    <div className={styles.vineContainer}>
      {/* The main vine stem */}
      <svg
        className={styles.vineSvg}
        width="20"
        height={docHeight}
        viewBox={`0 0 20 ${docHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          x1="10"
          y1="0"
          x2="10"
          y2={docHeight}
          stroke="var(--sage)"
          strokeWidth="2"
          strokeLinecap="round"
          style={prefersReducedMotion ? {} : { 
            pathLength: scaleY 
          }}
        />
      </svg>

      {/* The flower buds at each section */}
      {markers.map((marker) => (
        <BudMarker key={marker.id} top={marker.top} />
      ))}
    </div>
  );
}

function BudMarker({ top }: { top: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div 
      className={styles.budWrapper}
      style={{ top: `${top}px` }}
    >
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5, margin: "-100px" }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
        className={styles.bud}
      >
        <div className={styles.petal} />
        <div className={styles.center} />
      </motion.div>
    </div>
  );
}
