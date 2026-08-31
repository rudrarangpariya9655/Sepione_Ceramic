"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = Date.now();
    const duration = 2000; // 2 seconds fill up
    
    const tick = () => {
      let elapsed = Date.now() - start;
      let p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    // Give it time to fill (2s), pause (0.5s), then fade out (0.6s)
    const timer = setTimeout(() => {
      setShow(false);
    }, 3200); 
    
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={styles.welcomeScreen}>
      <div className={styles.loadingContainer}>
        <h1 className={styles.liquidText} data-text="Sepione">Sepione</h1>
        <p className={styles.loadingProgress}>loading... {progress}%</p>
      </div>
    </div>
  );
}
