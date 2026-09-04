"use client";

import Link from "next/link";
import { getThumbnailUrl } from "@/lib/cloudinary-utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

export default function AnimatedHome({ heroTile, tiles12x12, tiles16x16 }) {
  const earthRefined = ["Earth.", "Refined."];

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
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-8 relative leading-tight flex flex-col">
            <motion.span variants={wordVariants} className="block text-primary-container relative z-10 mix-blend-difference">
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
            <Link href="/tiles/12x12" className="bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 w-max text-black no-underline">
              Explore Collections
              <span>→</span>
            </Link>
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
        <div className="grid md:grid-cols-12 gap-gutter items-center">
          <div className="col-span-12 md:col-span-7">
            <motion.h2 variants={fadeUp} className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-6">
              About Sepione Tiles
            </motion.h2>
            <motion.p variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant mb-6 border-l-2 border-primary-container pl-6">
              Since 2015, Sepione Tiles has been one of India's leading manufacturers and exporters of heavy-duty 300x300mm and 400x400mm outdoor tiles, blending Italian-inspired design with export-grade quality standards. 
              Our state-of-the-art manufacturing process emphasizes craftsmanship and rigorous testing, ensuring every tile withstands heavy traffic, harsh weather, and the test of time. Trusted across Africa, the Gulf, the Middle East, and South Asia, our outdoor and parking solutions are built for monumental scale and enduring presence.
            </motion.p>
            
            {/* Built to Last Feature Block */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4 mb-8">
               <motion.div variants={fadeUp} className="flex items-center gap-3">
                 <span className="text-xl">🛡️</span>
                 <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Heavy-Duty Durability</span>
               </motion.div>
               <motion.div variants={fadeUp} className="flex items-center gap-3">
                 <span className="text-xl">☀️</span>
                 <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Weather & Slip Resistant</span>
               </motion.div>
               <motion.div variants={fadeUp} className="flex items-center gap-3">
                 <span className="text-xl">🌍</span>
                 <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Export-Grade Finish</span>
               </motion.div>
               <motion.div variants={fadeUp} className="flex items-center gap-3">
                 <span className="text-xl">🏆</span>
                 <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Trusted Since 2015</span>
               </motion.div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/about" className="bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 w-max text-black no-underline">
                Explore More
                <span>→</span>
              </Link>
            </motion.div>
          </div>
          <div className="col-span-12 md:col-span-5 mt-12 md:mt-0">
            <motion.div variants={scaleIn} className="grid grid-cols-2 gap-8 text-center md:text-left bg-surface-container p-8 rounded-3xl border border-outline-variant/30 ambient-shadow">
              <div>
                <div className="font-display-xl text-3xl md:text-4xl text-primary mb-2">
                  <CountUp end={250} suffix="+" enableScrollSpy scrollSpyOnce />
                </div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Happy Clients</div>
              </div>
              <div>
                <div className="font-display-xl text-3xl md:text-4xl text-primary mb-2">
                  <CountUp end={12} enableScrollSpy scrollSpyOnce />
                </div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Export Countries</div>
              </div>
              <div>
                <div className="font-display-xl text-3xl md:text-4xl text-primary mb-2">
                  <CountUp end={1000} suffix="+" enableScrollSpy scrollSpyOnce />
                </div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Product Designs</div>
              </div>
              <div>
                <div className="font-display-xl text-3xl md:text-4xl text-primary mb-2">
                  <CountUp end={8} enableScrollSpy scrollSpyOnce />
                </div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Years Experience</div>
              </div>
            </motion.div>
          </div>
        </div>
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
            <Link href="/tiles/12x12" className="font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase flex items-center gap-2 hidden md:flex no-underline">
              View All Standard <span>→</span>
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
            <Link href="/tiles/16x16" className="font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase flex items-center gap-2 hidden md:flex no-underline">
              View All Monumental <span>→</span>
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
          <motion.div variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUp} className="flex items-start gap-4">
              <span className="text-primary mt-1 font-bold">📍</span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Location</div>
                <div className="font-body-md text-body-md text-on-surface">Pawadiyare Canal,<br />Morbi, Gujarat, India</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-start gap-4">
              <span className="text-primary mt-1 font-bold">☏</span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Phone</div>
                <div className="font-body-md text-body-md text-on-surface">+91 90999 50773<br />+91 90999 50771</div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-start gap-4">
              <span className="text-primary mt-1 font-bold">✉</span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Email</div>
                <div className="font-body-md text-body-md text-on-surface">Info@sepionetile.com</div>
              </div>
            </motion.div>
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
