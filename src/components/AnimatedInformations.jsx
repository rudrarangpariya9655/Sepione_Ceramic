import Link from "next/link";
import { ArrowRightIcon, LayersIcon, PackageIcon } from "@/components/icons";
import { COLLECTION_FORMATS } from "@/lib/collection-formats";
import styles from "./SecondaryPages.module.css";

const TECHNICAL_DETAILS = [
  { title: "Dimensions & finish", body: "Ask for the actual dimensions, thickness, finish, and dimensional tolerances of your selected tile." },
  { title: "Strength & application", body: "Confirm the selected product’s suitability for your intended traffic, installation, and outdoor conditions." },
  { title: "Surface performance", body: "Request available slip resistance, water absorption, abrasion, and stain resistance test information for the specific product." },
  { title: "Batch & installation", body: "Confirm shade and batch availability, joint spacing, substrate preparation, and installation guidance before placing your order." },
];

export default function AnimatedInformations() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Product information</span>
        </nav>
        <p className={styles.eyebrow}>Plan with confidence</p>
        <h1 className={styles.title}>Every detail.<br />Before you decide.</h1>
        <p className={styles.lead}>Explore our tile formats and find out what to confirm for your project, packing, and delivery requirements.</p>
        <nav aria-label="Product information sections" className={styles.sectionLinks}>
          <a href="#formats">Tile formats</a>
          <a href="#packing">Packing details</a>
          <a href="#technical">Technical details</a>
        </nav>
      </header>

      <section id="formats" className={styles.section} aria-labelledby="formats-title">
        <p className={styles.eyebrow}>Find your format</p>
        <h2 id="formats-title" className={styles.sectionTitle}>Two sizes. Room for possibility.</h2>
        <div className={styles.tableScroll} role="region" aria-label="Collection coverage and packing specifications table" tabIndex={0}>
          <table className={styles.table}>
            <caption>Coverage per tile and per box for each metric collection.</caption>
            <thead>
              <tr><th scope="col">Collection</th><th scope="col">Area / Tile (m²)</th><th scope="col">Area / Box (m²)</th><th scope="col">Per Box Weight</th><th scope="col">Thickness</th></tr>
            </thead>
            <tbody>
              {COLLECTION_FORMATS.map((format) => {
                const squareMetres = (format.width * format.height) / 1000000;
                return (
                  <tr key={format.href}>
                    <th scope="row"><Link className={styles.textLink} href={format.href}>{format.name}<ArrowRightIcon size={16} /></Link></th>
                    <td>{squareMetres.toFixed(2)}</td>
                    <td>{format.areaPerBox.toFixed(2)}</td>
                    <td>{format.weightPerBoxKg} kg approx.</td>
                    <td>{format.thicknessMm} mm approx.</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>Collection names identify the metric format. Area per tile is calculated from the dimensions; area per box is 0.72 m² for 300x300 and 0.80 m² for 400x400. Coverage excludes joints, cuts, and wastage.</p>
      </section>

      <section id="packing" className={styles.section} aria-labelledby="packing-title">
        <p className={styles.eyebrow}>From our factory to your project</p>
        <h2 id="packing-title" className={styles.sectionTitle}>Packing that fits your order.</h2>
        <div className={styles.twoColumns}>
          <article className={styles.card}>
            <span className="icon-chip"><PackageIcon size={24} /></span>
            <h3>Box & pallet details</h3>
            <p>Pieces per box, box weight, boxes per pallet, and pallet weight need confirmation for your selected product. Request the packing details with your quotation.</p>
          </article>
          <article className={styles.card}>
            <span className="icon-chip"><LayersIcon size={24} /></span>
            <h3>Container & delivery planning</h3>
            <p>Share your required quantity and destination so our team can confirm the loading plan, total coverage, and delivery arrangements for your order.</p>
          </article>
        </div>
      </section>

      <section id="technical" className={styles.section} aria-labelledby="technical-title">
        <p className={styles.eyebrow}>Know your tile</p>
        <h2 id="technical-title" className={styles.sectionTitle}>The right details for the right space.</h2>
        <p className={styles.sectionIntro}>Technical specifications and test results are product specific. Contact our team for available documentation for your chosen design and intended use.</p>
        <div className={styles.cardGrid}>
          {TECHNICAL_DETAILS.map((item, index) => (
            <article key={item.title} className={styles.card}>
              <span className={styles.cardNumber}>0{index + 1}</span>
              <h3>{item.title}</h3><p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.callout} aria-labelledby="information-enquiry">
        <div><p className={styles.eyebrow}>We’re here to help</p><h2 id="information-enquiry">Need details for a specific tile?</h2><p>Send us the design, size, quantity, and delivery destination.</p></div>
        <Link className={styles.button} href="/#contact">Request product details <ArrowRightIcon size={18} /></Link>
      </section>
    </main>
  );
}
