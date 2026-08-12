"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import styles from "./CountUpStat.module.css";

interface CountUpStatProps {
  target: number;
  suffix?: string;
  label: string;
}

export default function CountUpStat({ target, suffix = "", label }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        // Format with locale string (e.g. 2,089)
        const displayValue = Math.floor(latest).toLocaleString("id-ID");
        const span = ref.current.querySelector(".stat-value");
        if (span) {
          span.textContent = displayValue + suffix;
        }
      }
    });
  }, [springValue, suffix]);

  return (
    <div className={styles.statContainer} ref={ref}>
      <h3 className={styles.statHeading}>
        <span className="stat-value">0{suffix}</span>
      </h3>
      <p className={`mono ${styles.statLabel}`}>{label}</p>
    </div>
  );
}
