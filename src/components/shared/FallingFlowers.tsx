'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FLOWER_COUNT = 15;

export default function FallingFlowers() {
  const { scrollYProgress } = useScroll();
  // Transform scroll progress to a vertical shift for the flowers
  const yShift = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const [flowers, setFlowers] = useState<Array<{ id: number; left: string; top: string; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random positions on client-side to avoid hydration mismatch
    const generated = Array.from({ length: FLOWER_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 200}%`, // Spread across a tall scrollable area
      size: Math.random() * 30 + 30, // 30px to 60px
      delay: Math.random() * 2,
    }));
    setFlowers(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {flowers.map((f) => (
        <motion.div
          key={f.id}
          className="absolute opacity-60"
          style={{
            left: f.left,
            top: f.top,
            y: yShift,
          }}
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delay: f.delay,
          }}
        >
          <svg
            width={f.size}
            height={f.size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10C50 10 60 30 70 50C80 30 90 10 90 10C90 10 80 40 50 50C80 60 90 90 90 90C90 90 70 70 50 50C30 70 10 90 10 90C10 90 20 60 50 50C20 40 10 10 10 10C10 10 30 30 50 50C40 30 50 10 50 10Z"
              fill="var(--rose)"
            />
            <circle cx="50" cy="50" r="8" fill="var(--wine)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
