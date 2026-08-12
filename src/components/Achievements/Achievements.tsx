"use client";

import { ACHIEVEMENTS_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Achievements.module.css";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function Achievements() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className={styles.achievements} id="achievements">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">03 / Penghargaan</p>
          <h2>Pencapaian & Kompetisi</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {ACHIEVEMENTS_CONTENT.map((achievement, i) => (
              <motion.div 
                key={i} 
                className={styles.card} 
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { y: -6, rotate: -1 }}
              >
                <span className={`mono ${styles.year}`}>{achievement.year}</span>
                <h3 className={styles.title}>{achievement.title}</h3>
                <p className={styles.event}>{achievement.event}</p>
                {achievement.description && (
                  <p className={styles.description}>{achievement.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
