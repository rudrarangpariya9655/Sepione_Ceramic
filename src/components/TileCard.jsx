"use client";

import { useState } from "react";
import Image from "next/image";
import { getTileFormat } from "@/lib/collection-formats";
import styles from "./TileCard.module.css";

export default function TileCard({ tile, onClick }) {
  const [failedImage, setFailedImage] = useState(null);
  const imageAvailable = typeof tile.image === "string" && /^(\/(?!\/)|https:\/\/res\.cloudinary\.com\/)/.test(tile.image) && failedImage !== tile.image;

  return (
    <button type="button" className={styles.card} onClick={() => onClick?.(tile)} aria-label={`View ${tile.name}, ${tile.category || "tile design"}`} aria-haspopup="dialog">
      <span className={styles.imageWrapper}>
        {imageAvailable ? (
          <Image
            src={tile.image}
            alt={`${tile.name} tile pattern`}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1024px) 45vw, 23vw"
            onError={() => setFailedImage(tile.image)}
          />
        ) : <span className={styles.imageFallback}>Preview unavailable</span>}
        {tile.size && <span className={styles.size}>{getTileFormat(tile.size)?.dimensions || "—"}</span>}
        <span className={styles.viewLabel} aria-hidden="true">View design ↗</span>
      </span>
      <span className={styles.info}>
        <span className={styles.title}>{tile.name}</span>
        <span className={styles.category}>{tile.category || "Tile collection"}</span>
      </span>
    </button>
  );
}
