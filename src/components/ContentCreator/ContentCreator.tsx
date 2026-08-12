"use client";

import { useRef, useEffect, useState } from "react";
import { CONTENT_CREATOR_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./ContentCreator.module.css";
import { motion, useReducedMotion } from "framer-motion";

export default function ContentCreator() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className={styles.creator} id="creator">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">04 / Konten</p>
          <h2>Content Creator</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className={styles.carouselContainer}>
          <motion.div 
            ref={carouselRef}
            className={`no-scrollbar ${styles.carousel}`}
            whileTap={prefersReducedMotion ? {} : { cursor: "grabbing" }}
          >
            <motion.div 
              className={styles.innerCarousel}
              drag={prefersReducedMotion ? false : "x"}
              dragConstraints={{ right: 0, left: -width }}
              dragTransition={{ power: 0.2 }}
            >
              {CONTENT_CREATOR_CONTENT.map((item, i) => (
                <motion.a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={i} 
                  className={styles.card}
                  whileHover={prefersReducedMotion ? {} : { y: -4 }}
                >
                  <div className={styles.cardTop}>
                    <span className={`mono ${styles.platform}`}>{item.platform}</span>
                    <span className={styles.arrow}>↗</span>
                  </div>
                  <h3 className={styles.handle}>{item.handle}</h3>
                  <p className={styles.description}>{item.description}</p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
