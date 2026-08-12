import Image from "next/image";
import styles from "./PhotoFrame.module.css";

interface PhotoFrameProps {
  src?: string;
  alt: string;
  ratio?: "3:4" | "4:5" | "square";
  label?: string;
  className?: string;
}

export default function PhotoFrame({ 
  src, 
  alt, 
  ratio = "3:4", 
  label,
  className = "" 
}: PhotoFrameProps) {
  
  const ratioClass = ratio === "4:5" ? styles.ratio45 : ratio === "square" ? styles.ratioSquare : styles.ratio34;

  return (
    <div className={`${styles.frameWrapper} ${className}`}>
      <div className={`${styles.frame} ${ratioClass}`}>
        {src ? (
          <Image 
            src={src} 
            alt={alt}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className={styles.placeholder}>
            {label && <span className="mono">{label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
