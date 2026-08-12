"use client";

import Link from "next/link";
import { PROJECTS_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Projects.module.css";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function Projects() {
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
    <section className={styles.projects} id="projects">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">06 / Karya</p>
          <h2>Proyek Teknis</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {PROJECTS_CONTENT.map((project, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link href={`/projects/${project.slug}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={`mono ${styles.role}`}>{project.role}</span>
                    <span className={styles.arrow}>↗</span>
                  </div>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.description}>{project.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
