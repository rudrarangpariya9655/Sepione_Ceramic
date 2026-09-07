"use client";

import Link from "next/link";
import { getThumbnailUrl } from "@/lib/cloudinary-utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  ShieldIcon,
  DropletIcon,
  GlobeIcon,
  AwardIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightIcon,
} from "@/components/icons";

const ease = [0.2, 0.8, 0.2, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const FEATURES = [
  { Icon: ShieldIcon, label: "Heavy-Duty Durability", note: "Built for high-traffic loads" },
  { Icon: DropletIcon, label: "Weather & Slip Resistant", note: "Frost proof, > 0.40 slip rating" },
  { Icon: GlobeIcon, label: "Export-Grade Finish", note: "ISO 13006 / EN 14411 Bla" },
  { Icon: AwardIcon, label: "Trusted Since 2015", note: "12 export countries" },
];

const CONTACT = [
  {
    Icon: MapPinIcon,
    label: "Location",
    lines: ["Pawadiyare Canal,", "Morbi, Gujarat, India"],
  },
  {
    Icon: PhoneIcon,
    label: "Phone",
    lines: ["+91 90999 50773", "+91 90999 50771"],
  },
  {
    Icon: MailIcon,
    label: "Email",
    lines: ["Info@sepionetile.com"],
  },
];

/** Primary pill button with an arrow that eases forward on hover. */
function PrimaryButton({ href, children }) {
  return (
    <Link
      href={href}
      className="group bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase px-8 py-4 rounded-full inline-flex items-center gap-3 w-max no-underline ambient-shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:ambient-shadow"
    >
      {children}
      <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
        <ArrowRightIcon size={18} />
      </span>
    </Link>
  );
}

export default function AnimatedHome({ heroTile, tiles12x12, tiles16x16 }) {
  return (
    <main className="pt-[140px] pb-section-gap px-6 md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="flex flex-col md:grid md:grid-cols-12 gap-gutter items-center min-h-0 md:min-h-[716px]">
        <motion.div 
          className="col-span-12 md:col-span-7 z-10"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-primary block mb-6"
          >
            Manufacturer &amp; Exporter Since 2015
          </motion.span>
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-8 relative leading-tight flex flex-col">
            <motion.span
              variants={wordVariants}
              className="block bg-gradient-to-br from-primary to-on-primary-fixed-variant bg-clip-text text-transparent"
            >
              Earth.
            </motion.span>
            <motion.span variants={wordVariants} className="block md:pl-12 text-on-surface">
              Refined.
            </motion.span>
          </h1>
          <motion.p variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12 border-l-2 border-primary-container pl-6">
            Avant-garde ceramics crafted for spaces that demand presence. Where raw clay meets monumental scale. Heavy-duty 300x300mm and 400x400mm outdoor tiles engineered for export, combining unyielding durability with Italian-inspired design.
          </motion.p>
          <motion.div variants={fadeUp}>
            <PrimaryButton href="/tiles/12x12">Explore Collections</PrimaryButton>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="col-span-12 md:col-span-5 relative mt-12 md:mt-0 w-full h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden ambient-shadow relative">
            <motion.div
              className="bg-cover bg-center w-full h-full absolute inset-0"
              style={{
                backgroundImage: `url('${heroTile || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25"%3E%3Crect width="100%25" height="100%25" fill="%232d2a26"/%3E%3C/svg%3E'}')`,
              }}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            />
          </div>
          {/* Floating Element */}
          <motion.div 
            className="absolute -bottom-12 -left-12 bg-surface-container p-6 rounded-lg backdrop-blur-md border border-white/5 ambient-shadow w-64 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Featured Finish</div>
            <div className="font-headline-md text-headline-md text-primary">Rock Style</div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Teaser Section */}
      <motion.section 
        className="py-12 md:py-20 border-t border-outline-variant/30"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        {/* Intro: copy on the left, the numbers panel anchoring the right */}
        <div className="grid md:grid-cols-12 gap-gutter items-center">
          <div className="col-span-12 md:col-span-7">
            <motion.span
              variants={fadeUp}
              className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-4"
            >
              Who We Are
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-6"
            >
              About Sepione Tiles
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10"
            >
              Since 2015, Sepione Tiles has been one of India&apos;s leading manufacturers
              and exporters of heavy-duty 300x300mm and 400x400mm outdoor tiles, blending
              Italian-inspired design with export-grade quality standards. Our
              state-of-the-art manufacturing process emphasizes craftsmanship and rigorous
              testing, ensuring every tile withstands heavy traffic, harsh weather, and the
              test of time.
            </motion.p>

            <motion.div variants={fadeUp}>
              <PrimaryButton href="/about">Explore More</PrimaryButton>
            </motion.div>
          </div>

          <div className="col-span-12 md:col-span-5 mt-12 md:mt-0">
            <motion.div
              variants={scaleIn}
              className="sheen-on-hover bg-surface-container/80 rounded-3xl border border-outline-variant/40 ambient-shadow overflow-hidden"
            >
              <div className="px-7 md:px-8 py-5 border-b border-outline-variant/40">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  By the Numbers
                </span>
              </div>
              <div className="grid grid-cols-2">
                {[
                  { end: 250, suffix: "+", label: "Happy Clients" },
                  { end: 12, suffix: "", label: "Export Countries" },
                  { end: 1000, suffix: "+", label: "Product Designs" },
                  { end: 8, suffix: "", label: "Years Experience" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`p-7 md:p-8 ${i % 2 === 0 ? "border-r border-outline-variant/40" : ""} ${i < 2 ? "border-b border-outline-variant/40" : ""}`}
                  >
                    <div className="font-display-xl text-3xl md:text-4xl text-primary mb-2 tabular-nums">
                      <CountUp
                        end={stat.end}
                        suffix={stat.suffix}
                        duration={2.2}
                        separator=","
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    </div>
                    <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Built to Last: one even band of four, so the eye reads a single row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12 border-t border-outline-variant/30"
        >
          {FEATURES.map(({ Icon, label, note }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="group rounded-2xl border border-outline-variant/40 bg-surface-container-low/70 p-6 lift"
            >
              <span className="icon-chip mb-5">
                <Icon size={22} />
              </span>
              <h3 className="font-label-sm text-label-sm uppercase text-on-surface font-bold leading-snug mb-1.5">
                {label}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-snug">
                {note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 12x12 Collection */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <div className="flex items-end justify-between mb-16">
          <motion.div variants={fadeUp}>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-4">Standard Format</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-4">12x12 Collection</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl">Standard format tiles engineered for versatile outdoor and commercial applications.</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/tiles/12x12" className="group font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase items-center gap-2 hidden md:inline-flex no-underline link-underline">
              View All Standard
              <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                <ArrowRightIcon size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-12 gap-gutter">
          {/* Large Feature Tile */}
          {tiles12x12 && tiles12x12[0] && (
            <motion.div variants={scaleIn} className="col-span-12 md:col-span-8 group cursor-pointer relative">
              <Link href="/tiles/12x12" className="block no-underline">
                <div className="aspect-[16/9] rounded-[2rem] overflow-hidden relative ambient-shadow mb-6 transition-all duration-500 group-hover:ambient-shadow group-hover:scale-[1.02]">
                  <div
                    className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${getThumbnailUrl(tiles12x12[0].cloudinary_secure_url)}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10"></div>
                  {/* Tag */}
                  <div className="absolute top-6 left-6 bg-[#525EA7] text-white font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest">Newest Arrival</div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tiles12x12[0].filename}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 uppercase text-xs tracking-widest">{tiles12x12[0].category}</p>
              </Link>
            </motion.div>
          )}

          {/* Stacked Secondary Tiles */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-gutter">
            {tiles12x12 && tiles12x12.slice(1, 3).map((tile, i) => (
              <motion.div variants={fadeUpSlow} key={i} className="flex-1">
                <Link href="/tiles/12x12" className="group cursor-pointer block no-underline h-full flex flex-col">
                  <div className="h-48 rounded-[2rem] overflow-hidden relative ambient-shadow mb-4 transition-all duration-500 group-hover:scale-[1.03] group-hover:ambient-shadow">
                    <div
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${getThumbnailUrl(tile.cloudinary_secure_url)}')` }}
                    ></div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-2xl">{tile.filename}</h3>
                </Link>
              </motion.div>
            ))}
            {(!tiles12x12 || tiles12x12.length === 0) && (
              <div className="text-on-surface-variant text-sm border border-outline-variant/30 rounded-2xl p-6 text-center">No tiles uploaded yet.</div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 16x16 Collection */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <div className="flex items-end justify-between mb-16">
          <motion.div variants={fadeUp}>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-4">Monumental Scale</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-4">16x16 Collection</h2>
            <p className="font-body-md text-on-surface-variant max-w-xl">Monumental scale tiles designed for bold architectural statements and expansive outdoor spaces.</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/tiles/16x16" className="group font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase items-center gap-2 hidden md:inline-flex no-underline link-underline">
              View All Monumental
              <span className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                <ArrowRightIcon size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-12 gap-gutter">
          {/* Large Feature Tile */}
          {tiles16x16 && tiles16x16[0] && (
            <motion.div variants={scaleIn} className="col-span-12 md:col-span-8 group cursor-pointer relative">
              <Link href="/tiles/16x16" className="block no-underline">
                <div className="aspect-[16/9] rounded-[2rem] overflow-hidden relative ambient-shadow mb-6 transition-all duration-500 group-hover:ambient-shadow group-hover:scale-[1.02]">
                  <div
                    className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${getThumbnailUrl(tiles16x16[0].cloudinary_secure_url)}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10"></div>
                  {/* Tag */}
                  <div className="absolute top-6 left-6 bg-[#525EA7] text-white font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest">Newest Arrival</div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tiles16x16[0].filename}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 uppercase text-xs tracking-widest">{tiles16x16[0].category}</p>
              </Link>
            </motion.div>
          )}

          {/* Stacked Secondary Tiles */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-gutter">
            {tiles16x16 && tiles16x16.slice(1, 3).map((tile, i) => (
              <motion.div variants={fadeUpSlow} key={i} className="flex-1">
                <Link href="/tiles/16x16" className="group cursor-pointer block no-underline h-full flex flex-col">
                  <div className="h-48 rounded-[2rem] overflow-hidden relative ambient-shadow mb-4 transition-all duration-500 group-hover:scale-[1.03] group-hover:ambient-shadow">
                    <div
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${getThumbnailUrl(tile.cloudinary_secure_url)}')` }}
                    ></div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-2xl">{tile.filename}</h3>
                </Link>
              </motion.div>
            ))}
            {(!tiles16x16 || tiles16x16.length === 0) && (
              <div className="text-on-surface-variant text-sm border border-outline-variant/30 rounded-2xl p-6 text-center">No tiles uploaded yet.</div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Studio Contact Section */}
      <motion.section 
        className="grid grid-cols-12 gap-gutter items-center border-t border-outline-variant/30 pt-20" 
        id="contact"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <div className="col-span-12 md:col-span-5">
          <motion.h2 variants={fadeUp} className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-8">Visit the Factory</motion.h2>
          <motion.p variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant mb-12">
            Experience the monumental scale of our facility and witness raw clay transformed into finished, heavy-duty tiles. Private viewings available by appointment.
          </motion.p>
          <motion.div variants={staggerContainer} className="space-y-4">
            {CONTACT.map(({ Icon, label, lines }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="group flex items-start gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-5 lift"
              >
                <span className="icon-chip mt-0.5">
                  <Icon size={22} />
                </span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1 tracking-widest">
                    {label}
                  </div>
                  <div className="font-body-md text-body-md text-on-surface">
                    {lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div 
          className="col-span-12 md:col-span-6 md:col-start-7 mt-12 md:mt-0"
          variants={scaleIn}
        >
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden ambient-shadow relative group">
            <div
              className="bg-cover bg-center w-full h-full transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000')" }}
            ></div>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
