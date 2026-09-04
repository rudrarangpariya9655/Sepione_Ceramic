"use client";

import styles from "./Footer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.brandSection}>
          <h2 className={styles.brandName}>Sepione Ceramic</h2>
          <p className={styles.brandDesc}>
            Crafting premium heavy-duty tiles for your homes, parking, and outdoors.
            With 8 years of export excellence, we deliver quality that lasts and designs that inspire.
          </p>
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Email:</strong> <a href="mailto:Info@sepionetile.com">info@sepionetile.com</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+919099950773">+91 90999 50773</a>, <a href="tel:+919099950771">+91 90999 50771</a>
            </li>
            <li>
              <strong>Address:</strong><br />
              Survey no. 595 P/2,<br />
              Nr. Pavadiyari Canal, At. Shapar,<br />
              Jetpar Road, Morbi, <br />
              (Gujarat) 363 642. India<br />
            </li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linksList}>
            <li>
              <Link 
                href="/" 
                onClick={(e) => { 
                  if (typeof window !== "undefined" && window.location.pathname === "/") { 
                    window.scrollTo({ top: 0, behavior: "smooth" }); 
                  } 
                }}
              >
                Home
              </Link>
            </li>
            <li><Link href="/tiles/12x12">12x12 Tiles</Link></li>
            <li><Link href="/tiles/16x16">16x16 Tiles</Link></li>
          </ul>
        </div>
      </motion.div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Sepione Ceramic. All rights reserved.</p>
      </div>
    </footer>
  );
}
