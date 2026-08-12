"use client";

import { ORG_LEADERSHIP_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import CountUpStat from "@/components/shared/CountUpStat";
import styles from "./OrgLeadership.module.css";
import { motion, Variants } from "framer-motion";

export default function OrgLeadership() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className={styles.org}>
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <h3>Kepemimpinan Organisasi</h3>
          <p>HMTI Polinema</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {ORG_LEADERSHIP_CONTENT.map((org, i) => (
              <motion.div key={i} className={styles.card} variants={itemVariants}>
                <div className={styles.statWrapper}>
                  <CountUpStat 
                    target={org.stat} 
                    suffix={org.statSuffix} 
                    label={org.statLabel} 
                  />
                </div>
                <div className={styles.roleWrapper}>
                  <h4>{org.role}</h4>
                  <p className={`mono ${styles.date}`}>{org.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
