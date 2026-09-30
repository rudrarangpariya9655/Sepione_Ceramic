import Link from "next/link";
import { GemIcon, LayersIcon, KilnIcon, PackageIcon, ArrowRightIcon } from "@/components/icons";
import styles from "./SecondaryPages.module.css";

const VALUES = [
  {
    Icon: GemIcon,
    title: "Quality in every detail",
    body: "Careful attention to materials, finishes, and consistency throughout our manufacturing process.",
  },
  {
    Icon: LayersIcon,
    title: "Designed for the outdoors",
    body: "A focused collection of heavy-duty tiles for parking areas, walkways, and outdoor spaces.",
  },
  {
    Icon: KilnIcon,
    title: "A decade of craftsmanship",
    body: "10 years of experience bringing ceramic knowledge and contemporary design together.",
  },
  {
    Icon: PackageIcon,
    title: "Local roots. Global outlook.",
    body: "Manufactured in Morbi, Gujarat, with support for distributors and projects across international markets.",
  },
];

export default function AnimatedAbout() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">About us</span>
        </nav>
        <p className={styles.eyebrow}>Made in Morbi. Made to last.</p>
        <h1 className={styles.title}>A decade of experience.<br />A lasting impression.</h1>
        <p className={styles.lead}>
          We are Sepione Ceramic. We bring thoughtful design and 10 years of tile-making experience to the spaces you use every day.
        </p>
      </header>

      <section className={styles.story} aria-labelledby="our-story">
        <div className={styles.experience}>
          <span className={styles.experienceNumber}>10</span>
          <span className={styles.eyebrow}>Years of experience</span>
          <span className={styles.experienceNote}>Crafted with care in Gujarat, India</span>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Our story</p>
          <h2 id="our-story">Built on craft.<br />Inspired by possibility.</h2>
          <p>
            Established in 2015, Sepione Ceramic manufactures and exports heavy-duty outdoor tiles from Morbi, India. Our 300 × 300 mm and 400 × 400 mm collections bring together versatile patterns, considered finishes, and practical formats.
          </p>
          <p>
            From a welcoming entrance to a busy outdoor space, we help customers find a tile that feels right for their project. Our team supports product selection, packing enquiries, and export requirements from the first conversation.
          </p>
          <Link href="/tiles/12x12" className={styles.textLink}>Explore our tiles <ArrowRightIcon size={18} /></Link>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="our-values">
        <p className={styles.eyebrow}>What we stand for</p>
        <h2 id="our-values" className={styles.sectionTitle}>Good spaces begin with good foundations.</h2>
        <div className={styles.cardGrid}>
          {VALUES.map(({ Icon, title, body }) => (
            <article key={title} className={styles.card}>
              <span className="icon-chip"><Icon size={24} /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.callout} aria-labelledby="about-enquiry">
        <div>
          <p className={styles.eyebrow}>Let’s build something lasting</p>
          <h2 id="about-enquiry">Your next project starts here.</h2>
          <p>Tell us about your space, preferred design, and quantity. We’ll help with the next steps.</p>
        </div>
        <Link className={styles.button} href="/#contact">Talk to our team <ArrowRightIcon size={18} /></Link>
      </section>
    </main>
  );
}
