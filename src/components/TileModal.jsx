"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./TileModal.module.css";

export default function TileModal({ tile, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!tile) return null;

  return (
    <div className={`${styles.overlay} ${mounted ? styles.active : ""}`} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} ${mounted ? styles.active : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src={tile.image}
                alt={tile.name}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          
          <div className={styles.infoSection}>
            <h2 className={styles.title}>{tile.name}</h2>
            <div className={styles.badge}>{tile.category}</div>
            
            <p className={styles.description}>
              Enhance your space with the exquisite {tile.name}. 
              Part of our premium {tile.category} collection, this tile is designed for durability and elegance, 
              perfect for making a statement in any home or parking area.
            </p>
            
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Finish</span>
                <span className={styles.detailValue}>Premium {tile.category}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Usage</span>
                <span className={styles.detailValue}>Parking & Outdoors</span>
              </div>
            </div>
            
            <button className="btn-primary" style={{marginTop: "2rem"}}>Request Quote</button>
          </div>
        </div>
      </div>
    </div>
  );
}
