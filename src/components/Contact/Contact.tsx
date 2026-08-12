"use client";

import RevealOnScroll from "@/components/shared/RevealOnScroll";
import MagneticButton from "@/components/shared/MagneticButton";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>
        <RevealOnScroll className={styles.header}>
          <p className="mono">08 / Kontak</p>
          <h2>Mari Tumbuh Bareng</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className={styles.content}>
          <p className={styles.lede}>
            Terbuka untuk peluang Business Development, Management Trainee, dan Marketing.
          </p>
          
          <div className={styles.actions}>
            <MagneticButton href="mailto:chikalnazmi05@gmail.com" variant="solid">
              Email Saya
            </MagneticButton>
            <MagneticButton href="https://www.linkedin.com/in/chikal-nazmi-mahira/" variant="ghost">
              LinkedIn
            </MagneticButton>
            <MagneticButton href="https://instagram.com/chikalnazmi" variant="ghost">
              Instagram
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
