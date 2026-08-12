"use client";

import { ABOUT_CONTENT } from "@/lib/content";
import RevealOnScroll from "@/components/shared/RevealOnScroll";
import PhotoFrame from "@/components/shared/PhotoFrame";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        
        <RevealOnScroll className={styles.header}>
          <p className="mono">01 / Tentang</p>
          <h2>Merawat Pertumbuhan</h2>
        </RevealOnScroll>

        <div className={styles.contentGrid}>
          <RevealOnScroll delay={0.1} className={styles.imageCol}>
            <PhotoFrame ratio="3:4" alt="Chikal Nazmi" label="+ Foto kamu di sini" />
          </RevealOnScroll>

          <div className={styles.textCol}>
            {ABOUT_CONTENT.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delay={0.2 + (i * 0.1)}>
                <p className={styles.paragraph}>{p}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
