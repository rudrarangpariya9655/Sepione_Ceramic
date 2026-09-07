"use client";

import styles from "./Footer.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@/components/icons";

const ease = [0.2, 0.8, 0.2, 1];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/informations", label: "Informations" },
  { href: "/tiles/12x12", label: "12x12 Tiles" },
  { href: "/tiles/16x16", label: "16x16 Tiles" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.container}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={fadeUp} className={styles.brandSection}>
          <h2 className={styles.brandName}>Sepione Ceramic</h2>
          <p className={styles.brandDesc}>
            Crafting premium heavy-duty tiles for your homes, parking, and outdoors.
            With 8 years of export excellence, we deliver quality that lasts and
            designs that inspire.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className="icon-chip icon-chip-sm">
                <MailIcon size={18} />
              </span>
              <span>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:Info@sepionetile.com">info@sepionetile.com</a>
              </span>
            </li>
            
            <li className={styles.contactItem}>
              <span className="icon-chip icon-chip-sm">
                <PhoneIcon size={18} />
              </span>
              <span>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+919099950773">+91 90999 50773</a>
                <br />
                <a href="tel:+919099950771">+91 90999 50771</a>
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className="icon-chip icon-chip-sm">
                <MapPinIcon size={18} />
              </span>
              <span>
                <span className={styles.contactLabel}>Address</span>
                Survey no. 595 P/2,
                <br />
                Nr. Pavadiyari Canal, At. Shapar,
                <br />
                Jetpar Road, Morbi,
                <br />
                (Gujarat) 363 642. India
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linksList}>
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={styles.quickLink}
                  onClick={() => {
                    if (
                      link.href === "/" &&
                      typeof window !== "undefined" &&
                      window.location.pathname === "/"
                    ) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                >
                  <span className={styles.quickLinkArrow} aria-hidden="true">
                    <ArrowRightIcon size={14} />
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Sepione Ceramic. All rights reserved.</p>
      </div>
    </footer>
  );
}
