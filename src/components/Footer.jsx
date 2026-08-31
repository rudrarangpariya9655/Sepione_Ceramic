import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <h2 className={styles.brandName}>Sepione Ceramic</h2>
          <p className={styles.brandDesc}>
            Crafting premium tiles for your homes, parking, and outdoors. 
            Quality that lasts, designs that inspire.
          </p>
        </div>
        
        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Email:</strong> <a href="mailto:sepion@gmail.com">sepion@gmail.com</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+919099950773">+91 90999 50773</a>, <a href="tel:+919099950771">+91 90999 50771</a>
            </li>
            <li>
              <strong>Address:</strong><br/>
              Pawadiyare Canal,<br/>
              Morbi, Gujarat, India
            </li>
          </ul>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linksList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tiles/12x12">12x12 Tiles</Link></li>
            <li><Link href="/tiles/16x16">16x16 Tiles</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Sepione Ceramic. All rights reserved.</p>
      </div>
    </footer>
  );
}
