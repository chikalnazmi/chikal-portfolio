"use client";

import { motion, Variants } from "framer-motion";
import { HERO_CONTENT } from "@/lib/content";
import MagneticButton from "@/components/shared/MagneticButton";
import CountUpStat from "@/components/shared/CountUpStat";
import PhotoFrame from "@/components/shared/PhotoFrame";
import styles from "./Hero.module.css";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    },
  };

  return (
    <section className={styles.hero} id="top">
      <div className={styles.container}>
        
        <motion.div 
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className={`mono ${styles.eyebrow}`} variants={itemVariants}>
            {HERO_CONTENT.eyebrow}
          </motion.p>
          
          <motion.h1 className={styles.h1} variants={itemVariants}>
            {HERO_CONTENT.h1}
          </motion.h1>
          
          <motion.p className={`subhead ${styles.subhead}`} variants={itemVariants}>
            {HERO_CONTENT.subhead}
          </motion.p>
          
          <motion.p className={styles.description} variants={itemVariants}>
            {HERO_CONTENT.description}
          </motion.p>
          
          <motion.div className={styles.actions} variants={itemVariants}>
            <MagneticButton href="#experience" variant="solid">
              Lihat Perjalanan <span className={styles.arrow}>↗</span>
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Hubungi Saya
            </MagneticButton>
          </motion.div>

          <motion.div className={styles.statsRow} variants={itemVariants}>
            {HERO_CONTENT.stats.map((stat, i) => (
              <CountUpStat 
                key={i}
                target={stat.value} 
                suffix={stat.suffix} 
                label={stat.label} 
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.imageCol}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className={styles.frameWrapper}>
            <PhotoFrame ratio="4:5" alt="Chikal Nazmi Mahira" label="+ Taruh foto kamu di sini" />
            
            {/* Botanical Sprig Animation */}
            <svg 
              className={styles.sprig} 
              width="100" 
              height="150" 
              viewBox="0 0 100 150" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path 
                d="M10,140 C10,100 40,80 80,40 C90,30 85,15 95,10" 
                stroke="var(--olive)" 
                strokeWidth="2" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
              />
              <motion.circle 
                cx="95" 
                cy="10" 
                r="4" 
                fill="var(--rose)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
              />
            </svg>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
