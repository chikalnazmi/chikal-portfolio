"use client";

import { EXPERIENCE_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Experience.module.css";
import { motion, Variants } from "framer-motion";

export default function Experience() {
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
    <section className={styles.experience} id="experience">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">02 / Perjalanan</p>
          <h2>Rekam Jejak Profesional</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {EXPERIENCE_CONTENT.map((exp, i) => (
              <motion.div key={i} className={styles.card} variants={itemVariants}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleArea}>
                    <h3>{exp.role}</h3>
                    <p className={styles.company}>
                      {exp.company}
                      {exp.location && <span> · {exp.location}</span>}
                    </p>
                  </div>
                  <div className={styles.metaArea}>
                    <span className={`mono ${styles.date}`}>{exp.date}</span>
                    <span className={`mono ${styles.tag}`}>{exp.tag}</span>
                  </div>
                </div>

                {exp.highlightStat && (
                  <div className={styles.highlight}>
                    {exp.featured && <span className={styles.badge}>Featured</span>}
                    {exp.highlightStat}
                  </div>
                )}

                <ul className={styles.bullets}>
                  {exp.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
