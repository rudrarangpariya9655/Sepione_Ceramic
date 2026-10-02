"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ShieldIcon, LayersIcon, GlobeIcon, AwardIcon, PhoneIcon, MailIcon, MapPinIcon } from "@/components/icons";
import { getThumbnailUrl } from "@/lib/cloudinary-utils";
import { getTileFormat } from "@/lib/collection-formats";
import styles from "./Home.module.css";

const SLIDES = [
  { image: "/images/poolside-terrace.jpeg", alt: "Sepione patterned outdoor tiles around a poolside terrace", label: "Spaces to slow down.", title: <>Beautiful surfaces.<br />Lasting impressions.</>, caption: "Outdoor living, thoughtfully considered." },
  { image: "/images/outdoor-courtyard.jpeg", alt: "A contemporary living space with a grey and white tiled floor", label: "Design in every detail.", title: <>A foundation for<br />inspired spaces.</>, caption: "Distinctive patterns. Everyday possibilities." },
  { image: "/images/patterned-living.jpeg", alt: "Decorative Sepione tiles in a contemporary setting", label: "Made for your world.", title: <>Character underfoot.<br />Quality at heart.</>, caption: "Discover a different perspective on tiles." },
];
const COLLECTIONS = [
  { size: "12x12", dimensions: "300 × 300 mm", title: "Small format. Big possibilities.", image: "/images/outdoor-courtyard.jpeg", text: "Versatile tiles for walkways, parking areas and everyday outdoor spaces." },
  { size: "16x16", dimensions: "400 × 400 mm", title: "More room for expression.", image: "/images/poolside-terrace.jpeg", text: "A larger canvas for terraces, courtyards and commercial spaces." },
];
const FEATURES = [
  { Icon: LayersIcon, title: "Considered design", text: "From quiet textures to expressive patterns, find a surface that feels like you." },
  { Icon: ShieldIcon, title: "Made for everyday life", text: "Outdoor and parking tiles created with practical spaces in mind." },
  { Icon: AwardIcon, title: "10 years of experience", text: "A decade of ceramic knowledge, craftsmanship and customer relationships." },
  { Icon: GlobeIcon, title: "From Morbi to the world", text: "Indian manufacturing expertise with support for distributors and export partners." },
];
function TextLink({ href, children, light = false }) {
  return <Link href={href} className={`${styles.textLink} ${light ? styles.lightLink : ""}`}>{children}<ArrowRightIcon size={19} /></Link>;
}
function ProductPreview({ tile, size }) {
  const [failed, setFailed] = useState(false);
  const imageAvailable = typeof tile.cloudinary_secure_url === "string" && /^https:\/\/res\.cloudinary\.com\//.test(tile.cloudinary_secure_url);
  const name = (tile.filename || "Tile design").replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
  return <Link href={getTileFormat(size).href} className={styles.product}>
    <div className={styles.productImage}>
      {!failed && imageAvailable ? <Image src={getThumbnailUrl(tile.cloudinary_secure_url)} alt={name} fill sizes="(max-width: 600px) 45vw, 23vw" onError={() => setFailed(true)} /> : <span>View collection <ArrowRightIcon size={20} /></span>}
    </div>
    <div className={styles.productName}><h3>{name}</h3><ArrowRightIcon size={18} /></div>
    <p>{getTileFormat(size).dimensions}{tile.category ? ` / ${tile.category.replace(/[_-]+/g, " ")}` : ""}</p>
  </Link>;
}
export default function AnimatedHome({ tiles12x12 = [], tiles16x16 = [], catalogUnavailable = false }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const products = [...(tiles12x12 || []).slice(0, 2).map(tile => ({ tile, size: "12x12" })), ...(tiles16x16 || []).slice(0, 2).map(tile => ({ tile, size: "16x16" }))];
  return <main id="main-content" className={styles.home}>
    <section className={styles.hero} aria-label="Sepione tile inspiration" aria-roledescription="carousel">
      <Image key={current.image} src={current.image} alt={current.alt} fill sizes="100vw" loading="eager" fetchPriority="high" className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>SEPIONE CERAMIC <span /> {current.label}</p>
        <h1>{current.title}</h1>
        <p className={styles.heroDescription}>Thoughtfully crafted parking and outdoor tiles.<br />Made in India. Made for the way you live.</p>
        <Link href="#collections" className={styles.button}>Explore our collections <ArrowRightIcon size={20} /></Link>
      </div>
      <div className={styles.heroBottom}>
        <span className={styles.heroCaption}>{current.caption}</span>
        <div className={styles.slideControls} aria-label="Choose inspiration image">
          {SLIDES.map((item, index) => <button key={item.image} type="button" aria-label={`Show inspiration ${index + 1}: ${item.label}`} aria-pressed={index === slide} className={index === slide ? styles.activeSlide : ""} onClick={() => setSlide(index)}>{String(index + 1).padStart(2, "0")}</button>)}
          <button type="button" className={styles.nextSlide} aria-label="Next inspiration" onClick={() => setSlide(value => (value + 1) % SLIDES.length)}><ArrowRightIcon size={22} /></button>
        </div>
      </div>
    </section>
    <div className={styles.trustStrip}><span>Manufacturers & exporters</span><span>10 years of experience</span><span>Crafted in Morbi, India</span></div>
    <section className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
      <div className={styles.aboutVisual}>
        <Image src="/images/tile-craft.png" alt="Sepione tiles used in a garden patio and outdoor seating area" fill sizes="(max-width: 800px) 90vw, 42vw" />
        <div className={styles.experience}><strong>10</strong><span>Years of<br />experience</span></div>
      </div>
      <div className={styles.aboutCopy}>
        <p className={styles.eyebrow}>A little about us</p>
        <h2 id="about-title">Rooted in craft.<br /><em>Built for life.</em></h2>
        <p>Every great space starts with a strong foundation. At Sepione, we bring together thoughtful design and ceramic expertise to create tiles that belong in everyday life.</p>
        <p>Based in Morbi, Gujarat, we manufacture and export parking and outdoor tiles in 300 × 300 mm and 400 × 400 mm formats. With 10 years of experience, we help turn your ideas into spaces with lasting character.</p>
        <TextLink href="/about">Discover our story</TextLink>
      </div>
    </section>
    <section id="collections" className={`${styles.section} ${styles.collections}`} aria-labelledby="collections-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>The collections</p><h2 id="collections-title">Find your <em>perfect surface.</em></h2></div><p>Two versatile formats.<br />Endless ways to make a space your own.</p></div>
      <div className={styles.collectionGrid}>{COLLECTIONS.map(collection => <Link key={collection.size} href={getTileFormat(collection.size).href} className={styles.collection}>
        <div className={styles.collectionImage}><Image src={collection.image} alt={`${collection.dimensions} tile collection inspiration`} fill sizes="(max-width: 700px) 90vw, 45vw" /><span>{collection.dimensions}</span><div className={styles.collectionArrow}><ArrowRightIcon size={24} /></div></div>
        <div className={styles.collectionDetails}><span>{getTileFormat(collection.size).name} COLLECTION</span><h3>{collection.title}</h3><p>{collection.text}</p></div>
      </Link>)}</div>
      {products.length > 0 && <div className={styles.latest}><div className={styles.latestHeading}><h3>A closer look at our tiles</h3><span>Latest designs</span></div><div className={styles.productGrid}>{products.map(({ tile, size }) => <ProductPreview key={`${size}-${tile.id}`} tile={tile} size={size} />)}</div></div>}
      {catalogUnavailable && <p className={styles.catalogNote}>Our live catalogue is temporarily unavailable. <a href="#contact">Contact our team</a> for the latest designs and availability.</p>}
    </section>
    <section className={styles.why} aria-labelledby="why-title"><div className={styles.section}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>The Sepione difference</p><h2 id="why-title">Good design.<br /><em>Even better foundations.</em></h2></div><p>Care in the details.<br />Confidence in every step.</p></div>
      <div className={styles.featureGrid}>{FEATURES.map(({ Icon, title, text }, index) => <article key={title} className={styles.feature}><div className={styles.featureTop}><Icon size={28} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>
    <section className={`${styles.section} ${styles.applications}`} aria-labelledby="applications-title">
      <div className={styles.applicationCopy}><p className={styles.eyebrow}>Spaces & possibilities</p><h2 id="applications-title">At home.<br />In the open.<br /><em>Everywhere in between.</em></h2><p>Explore surfaces for the places where life happens. Our team can help you choose a tile for your project and its requirements.</p><div className={styles.tags}>{["Parking areas", "Outdoor walkways", "Terraces", "Courtyards", "Commercial spaces", "Landscapes"].map(area => <span key={area}>{area}</span>)}</div><TextLink href="/informations">Explore product information</TextLink></div>
      <div className={styles.applicationImage}><Image src="/images/poolside-terrace.jpeg" alt="Tiled outdoor living area beside a swimming pool" fill sizes="(max-width: 800px) 90vw, 48vw" /><span>Designed to bring spaces together.</span></div>
    </section>
    <section className={styles.export}><div className={styles.exportInner}><GlobeIcon size={42} /><p className={styles.eyebrow}>Local roots. Global outlook.</p><h2>Crafted in India.<br /><em>Ready for the world.</em></h2><p>We work with distributors and project partners across international markets. Let&apos;s talk about your collection, packing and export requirements.</p><TextLink href="#contact" light>Become an export partner</TextLink></div></section>
    <section id="contact" className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-title"><div><p className={styles.eyebrow}>Let&apos;s create something lasting</p><h2 id="contact-title">Your next space<br /><em>starts here.</em></h2><p>Looking for a particular finish, a project quote or an export partner? We&apos;d love to hear from you.</p><a className={styles.button} href="mailto:info@sepionetile.com">Talk to our team <ArrowRightIcon size={20} /></a></div><div className={styles.contactDetails}>
      <div><PhoneIcon size={22} /><div><span>Call us</span><a href="tel:+919099950773">+91 90999 50773</a><a href="tel:+919099950771">+91 90999 50771</a></div></div>
      <div><MailIcon size={22} /><div><span>Write to us</span><a href="mailto:info@sepionetile.com">info@sepionetile.com</a></div></div>
      <div><MapPinIcon size={22} /><div><span>Find us</span><address>Survey no. 595 P/2, Nr. Pavadiyari Canal,<br />Shapar, Jetpar Road, Morbi,<br />Gujarat 363 642, India</address></div></div>
    </div></section>
  </main>;
}
