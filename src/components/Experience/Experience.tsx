"use client";

import { useState, useEffect } from "react";
import { getPortfolioData, DEFAULT_PORTFOLIO_DATA, ProjectDoc } from "@/lib/portfolio-store";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Experience.module.css";
import { motion, Variants } from "framer-motion";

export default function Experience() {
  const [experiences, setExperiences] = useState<ProjectDoc[]>(DEFAULT_PORTFOLIO_DATA.experiences || []);

  useEffect(() => {
    const data = getPortfolioData();
    if (data.experiences && data.experiences.length > 0) {
      setExperiences(data.experiences);
    }
  }, []);

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
            {experiences.map((exp, i) => {
              const galleryImages = (exp.extraImages && exp.extraImages.length > 0) ? exp.extraImages : [exp.image || '/3.png'];
              return (
                <motion.div key={exp.id || i} className={styles.card} variants={itemVariants}>
                  <div className={styles.cardHeader}>
                    <div className={styles.titleArea}>
                      <h3>{exp.title}</h3>
                      <p className={styles.company}>
                        {exp.tag}
                      </p>
                    </div>
                    <div className={styles.metaArea}>
                      <span className={`mono ${styles.date}`}>{exp.period}</span>
                      <span className={`mono ${styles.tag}`}>{exp.category}</span>
                    </div>
                  </div>

                  {/* Photo Showcase */}
                  <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', margin: '14px 0', border: '1px solid #CAD7C5', background: '#E8EFE5' }}>
                    <img 
                      src={galleryImages[0] || exp.image || '/3.png'} 
                      alt={exp.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = '/3.png'; }}
                    />
                  </div>

                  <p style={{ fontSize: 13, color: '#31422E', marginBottom: 12, lineHeight: 1.6 }}>
                    {exp.summary}
                  </p>

                  {exp.results && exp.results.length > 0 && (
                    <ul className={styles.bullets}>
                      {exp.results.map((bullet, j) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {exp.link && (
                    <a 
                      href={exp.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: '#893941', textDecoration: 'none' }}
                    >
                      {exp.linkLabel || 'Lihat Profil Bisnis ↗'}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
