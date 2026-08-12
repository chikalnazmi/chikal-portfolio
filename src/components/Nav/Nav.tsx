"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/content";
import styles from "./Nav.module.css";

export default function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple intersection check for active nav link
      let current = "";
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={styles.container}>
        <a href="#" className={styles.brand}>Chikal Nazmi Mahira</a>
        
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a 
              key={link.href} 
              href={link.href}
              className={`${styles.link} ${activeSection === link.href.substring(1) ? styles.active : ""}`}
            >
              {link.label}
              {link.label === "Kontak" && (
                <motion.span 
                  className={styles.arrow}
                  whileHover={{ x: 2, y: -2 }}
                >
                  ↗
                </motion.span>
              )}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
