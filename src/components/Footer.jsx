import styles from "./Footer.module.css";
import Link from "next/link";
import { MailIcon, PhoneIcon, MapPinIcon, ArrowRightIcon } from "@/components/icons";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/informations", label: "Product information" },
  { href: "/tiles/12x12", label: "300 × 300 mm tiles" },
  { href: "/tiles/16x16", label: "400 × 400 mm tiles" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.brandName} aria-label="Sepione Ceramic home">Sepione<span>Ceramic</span></Link>
          <p className={styles.brandDesc}>
            Thoughtfully crafted tiles for homes, parking, and the outdoors. With 10 years of experience, we bring lasting quality and considered design to every space.
          </p>
          <p className={styles.brandOrigin}>Manufactured in Morbi, India</p>
        </div>

        <section id="footer-contact" className={styles.contactSection} aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title" className={styles.sectionTitle}>Get in touch</h2>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <MailIcon size={18} />
              <div><span className={styles.contactLabel}>Email</span><a href="mailto:info@sepionetile.com">info@sepionetile.com</a></div>
            </li>
            <li className={styles.contactItem}>
              <PhoneIcon size={18} />
              <div>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+919099950773">+91 90999 50773</a><br />
                <a href="tel:+919099950771">+91 90999 50771</a>
              </div>
            </li>
            <li className={styles.contactItem}>
              <MapPinIcon size={18} />
              <div>
                <span className={styles.contactLabel}>Visit us</span>
                <address>Survey no. 595 P/2, Nr. Pavadiyari Canal,<br />Shapar, Jetpar Road, Morbi,<br />Gujarat 363 642, India</address>
              </div>
            </li>
          </ul>
        </section>

        <nav className={styles.linksSection} aria-labelledby="footer-links-title">
          <h2 id="footer-links-title" className={styles.sectionTitle}>Explore</h2>
          <ul className={styles.linksList}>
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.quickLink}>
                  <span className={styles.quickLinkArrow} aria-hidden="true"><ArrowRightIcon size={14} /></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Sepione Ceramic. All rights reserved.</p>
        <span>Crafted for everyday living.</span>
      </div>
    </footer>
  );
}
