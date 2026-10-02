import Link from "next/link";
import { DocumentIcon, DownloadIcon, ArrowUpRightIcon } from "@/components/icons";
import { getCatalogueCollections } from "@/lib/catalogues";
import styles from "@/components/SecondaryPages.module.css";
import catalogueStyles from "./Catalogue.module.css";

// Discover public PDFs during the build; deployed requests serve this static page.
export const dynamic = "force-static";

export const metadata = {
  title: "Catalogue",
  description: "Explore and download Sepione Ceramic 300x300 and 400x400 ceramic collection catalogues.",
};

export default async function CataloguePage() {
  const collections = await getCatalogueCollections();

  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Catalogue</span>
        </nav>
        <p className={styles.eyebrow}>Our collections</p>
        <h1 className={styles.title}>Catalogue</h1>
        <p className={styles.lead}>Explore and download our latest ceramic collections.</p>
        <nav aria-label="Catalogue collections" className={styles.sectionLinks}>
          {collections.map(({ collection }) => <a key={collection} href={`#catalogue-${collection}`}>{collection} Collection</a>)}
        </nav>
      </header>

      {collections.map(({ collection, catalogues, unavailable }) => (
        <section key={collection} id={`catalogue-${collection}`} className={styles.section} aria-labelledby={`catalogue-title-${collection}`}>
          <p className={styles.eyebrow}>{collection} Collection</p>
          <h2 id={`catalogue-title-${collection}`} className={styles.sectionTitle}>{collection} Catalogues</h2>
          {catalogues.length ? (
            <ul className={`${styles.cardGrid} ${catalogueStyles.list}`}>
              {catalogues.map((catalogue) => (
                <li key={catalogue.href} className={`${styles.card} ${catalogueStyles.card}`}>
                  <div className={catalogueStyles.cardHeading}>
                    <span className="icon-chip"><DocumentIcon size={24} /></span>
                    <span className={catalogueStyles.collection}>{collection} Collection</span>
                  </div>
                  <h3>{catalogue.name}</h3>
                  <p className={catalogueStyles.fileDetails}>PDF Catalogue <span aria-hidden="true">·</span> {(catalogue.sizeBytes / 1000000).toFixed(1)} MB</p>
                  <div className={catalogueStyles.actions}>
                    <a className={styles.textLink} href={catalogue.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${collection} ${catalogue.name} catalogue PDF (opens in a new tab)`}>View Catalogue <ArrowUpRightIcon size={18} /></a>
                    <a className={`${styles.textLink} ${catalogueStyles.download}`} href={catalogue.href} download={catalogue.filename} aria-label={`Download ${collection} ${catalogue.name} PDF`}>Download PDF <DownloadIcon size={18} /></a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.sectionIntro}>
              {unavailable ? "These catalogues are temporarily unavailable. Please try again later." : "Catalogues for this collection will be available soon."}{" "}
              <Link className={styles.textLink} href="/#contact">Contact our team</Link>
            </p>
          )}
        </section>
      ))}
    </main>
  );
}
