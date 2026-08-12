"use client";

import { SKILLS_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Skills.module.css";
import { motion, Variants } from "framer-motion";

export default function Skills() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className={styles.skills} id="skills">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">07 / Keahlian</p>
          <h2>Keterampilan & Sertifikasi</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {SKILLS_CONTENT.categories.map((category, i) => (
              <motion.div key={i} className={styles.card} variants={itemVariants}>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <div className={styles.chips}>
                  {category.skills.map((skill, j) => (
                    <span key={j} className={styles.chip}>{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.4} className={styles.certSection}>
          <h3 className={styles.categoryTitle}>Sertifikasi</h3>
          <div className={styles.chips}>
            {SKILLS_CONTENT.certifications.map((cert, i) => (
              <span key={i} className={`${styles.chip} ${styles.certChip}`}>{cert}</span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
