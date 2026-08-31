"use client";

import Image from "next/image";
import styles from "./TileCard.module.css";

export default function TileCard({ tile, onClick }) {
  return (
    <div className={styles.card} onClick={() => onClick(tile)}>
      <div className={styles.imageWrapper}>
        <Image
          src={tile.image}
          alt={tile.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {/* Glassmorphic overlay that appears on hover */}
      <div className={`${styles.overlay} glass`}>
        <h3 className={styles.title}>{tile.name}</h3>
        <p className={styles.category}>{tile.category}</p>
        <p className={styles.description}>
          Premium quality {tile.category.toLowerCase()} finish for an elegant look. Click to view full details.
        </p>
      </div>
    </div>
  );
}
