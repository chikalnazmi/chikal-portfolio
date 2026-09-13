"use client";

import { useState, useEffect } from "react";
import { getPortfolioData, DEFAULT_PORTFOLIO_DATA, AwardItem } from "@/lib/portfolio-store";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import styles from "./Achievements.module.css";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function Achievements() {
  const prefersReducedMotion = useReducedMotion();
  const [awardsList, setAwardsList] = useState<AwardItem[]>(DEFAULT_PORTFOLIO_DATA.awards);

  useEffect(() => {
    const data = getPortfolioData();
    if (data.awards && data.awards.length > 0) {
      setAwardsList(data.awards);
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
    <section className={styles.achievements} id="achievements">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">03 / Penghargaan</p>
          <h2>Pencapaian & Kompetisi ({awardsList.length})</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {awardsList.map((achievement, i) => (
              <motion.div 
                key={achievement.id || i} 
                className={styles.card} 
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { y: -6, rotate: -1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 16 }}>
                  <span className={`mono ${styles.year}`}>{achievement.year}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#FCE7F3', color: '#9D174D' }}>
                    {achievement.rank}
                  </span>
                </div>

                {/* Award Certificate & Event Photo Showcase */}
                {(achievement.certImg || achievement.eventImg) && (
                  <div style={{ display: 'grid', gridTemplateColumns: achievement.eventImg ? '1fr 1fr' : '1fr', gap: 8, width: '100%', marginBottom: 16 }}>
                    {achievement.certImg && (
                      <div style={{ height: 110, borderRadius: 10, overflow: 'hidden', border: '1px solid #CAD7C5', background: '#E8EFE5' }}>
                        <img 
                          src={achievement.certImg} 
                          alt="Sertifikat" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => { e.currentTarget.src = '/1.png'; }}
                        />
                      </div>
                    )}
                    {achievement.eventImg && (
                      <div style={{ height: 110, borderRadius: 10, overflow: 'hidden', border: '1px solid #CAD7C5', background: '#E8EFE5' }}>
                        <img 
                          src={achievement.eventImg} 
                          alt="Dokumentasi Acara" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => { e.currentTarget.src = '/2.png'; }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <h3 className={styles.title}>{achievement.title}</h3>
                <p className={styles.event}>{achievement.organizer} {achievement.scope && `• ${achievement.scope}`}</p>
                {achievement.desc && (
                  <p className={styles.description}>{achievement.desc}</p>
                )}

                {achievement.link && (
                  <a 
                    href={achievement.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: '#893941', textDecoration: 'none' }}
                  >
                    {achievement.linkLabel || 'Lihat Bukti Sertifikat / Tautan ↗'}
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
