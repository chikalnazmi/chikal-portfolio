"use client";

import { useRef, useEffect, useState } from "react";
import { CREATIVITY_GALLERY_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import PhotoFrame from "@/components/shared/PhotoFrame";
import styles from "./CreativityGallery.module.css";
import { motion, useReducedMotion } from "framer-motion";

export default function CreativityGallery() {
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
    <section className={styles.gallery} id="creativity">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">05 / Kreativitas</p>
          <h2>Galeri Karya</h2>
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
              {CREATIVITY_GALLERY_CONTENT.map((item, i) => (
                <div key={i} className={styles.card}>
                  <PhotoFrame 
                    src={item.src} 
                    alt={item.alt} 
                    ratio="square" 
                    label={`+ Foto karya ${i + 1}`} 
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
