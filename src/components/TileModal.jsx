"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { getTileFormat } from "@/lib/collection-formats";
import styles from "./TileModal.module.css";

export default function TileModal({ tile, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const [failedImage, setFailedImage] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  if (!tile) return null;

  const imageAvailable = typeof tile.image === "string" && /^(\/(?!\/)|https:\/\/res\.cloudinary\.com\/)/.test(tile.image) && failedImage !== tile.image;
  const dimensions = getTileFormat(tile.size)?.dimensions;
  const message = `Hello Sepione Ceramic, I would like a quote for ${tile.name}${dimensions ? ` (${dimensions})` : ""} from the ${tile.category || "tile"} collection. Please share availability and pricing.`;
  const quoteUrl = `https://wa.me/919099950773?text=${encodeURIComponent(message)}`;

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className={styles.modalContainer}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close tile details">×</button>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {imageAvailable ? <Image src={tile.image} alt={`${tile.name} tile pattern`} fill sizes="(max-width: 767px) 85vw, 550px" style={{ objectFit: "contain" }} onError={() => setFailedImage(tile.image)} /> : <p className={styles.imageFallback}>This preview is unavailable. Our team can share the design with you.</p>}
            </div>
          </div>
          <div className={styles.infoSection}>
            <p className={styles.eyebrow}>A closer look</p>
            <h2 id={titleId} className={styles.title}>{tile.name}</h2>
            <p className={styles.badge}>{tile.category || "Tile collection"}</p>
            <p className={styles.description}>Find the right foundation for your space. Ask our team about this design, available finishes and the best fit for your project.</p>
            <dl className={styles.detailsList}>
              {tile.size && <div className={styles.detailItem}><dt>Size</dt><dd>{dimensions || "—"}</dd></div>}
              <div className={styles.detailItem}><dt>Collection</dt><dd>{tile.category || "Tile collection"}</dd></div>
              <div className={styles.detailItem}><dt>Availability</dt><dd>Enquire with our team</dd></div>
            </dl>
            <a className={styles.quoteButton} href={quoteUrl} target="_blank" rel="noopener noreferrer">Request a quote <span aria-hidden="true">↗</span></a>
            <p className={styles.note}>Continue on WhatsApp with this design’s details.</p>
          </div>
        </div>
      </div>
    </dialog>
  );
}
