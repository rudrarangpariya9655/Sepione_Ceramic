"use client";

import { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div className={`${styles.welcomeScreen} ${!show ? styles.hideWelcome : ""}`}>
      <div className={styles.welcomeBox}>
        <div className={styles.welcomeLogo}>SC</div>
        <div className={styles.welcomeLine}></div>
        <h1>SEPIONS</h1>
        <p>CERAMIC • PREMIUM TILES</p>
      </div>
    </div>
  );
}
