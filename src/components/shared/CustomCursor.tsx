'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
        rotate: isHovering ? 90 : 0
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      {/* Pink Lily/Sakura SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(137, 57, 65, 0.4))' }}
      >
        <path
          d="M50 10C50 10 60 30 70 50C80 30 90 10 90 10C90 10 80 40 50 50C80 60 90 90 90 90C90 90 70 70 50 50C30 70 10 90 10 90C10 90 20 60 50 50C20 40 10 10 10 10C10 10 30 30 50 50C40 30 50 10 50 10Z"
          fill="var(--rose)"
        />
        <circle cx="50" cy="50" r="8" fill="var(--wine)" />
      </svg>
    </motion.div>
  );
}
