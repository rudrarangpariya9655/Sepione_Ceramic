"use client";

import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AnimatedAbout() {
  return (
    <main className="pt-[140px] pb-section-gap px-6 md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap overflow-x-hidden">
      <motion.section 
        className="max-w-4xl mx-auto space-y-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.h1 variants={fadeUp} className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-8">
          About Sepione Tiles
        </motion.h1>
        
        <motion.div variants={fadeUp} className="font-body-lg text-body-lg text-on-surface-variant space-y-6 border-l-2 border-primary-container pl-6">
          <p>
            Established in 2015, Sepione Tiles is one of India's prominent 
            manufacturers and exporters of 300x300mm and 400x400mm heavy-duty outdoor 
            tiles, and a flourishing center for Italian-inspired design.
          </p>
          <p>
            We offer a wide range of tiles, from classic to contemporary, 
            backed by state-of-the-art manufacturing facilities and technology that 
            ensure every tile meets rigorous quality and durability standards. Our 
            products are trusted across African, Gulf, Middle Eastern, and South Asian 
            markets, matching international quality benchmarks.
          </p>
        </motion.div>

        {/* New Vision/Mission/Values Block */}
        <motion.div 
          className="space-y-16 mt-16 pt-12 border-t border-outline-variant/30"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Our Vision</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              We envision becoming a globally recognized name in heavy-duty ceramic tile manufacturing. By bridging Italian-inspired design sensibility with Indian manufacturing scale, we are continuously expanding our presence across Africa, the Gulf, the Middle East, and South Asia, setting a benchmark for export-grade quality from India.
            </p>
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Our Mission</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Our mission is to manufacture durable, weather-resistant, heavy-duty outdoor tiles (300x300mm and 400x400mm) that perform reliably in the most demanding outdoor, commercial, and parking environments. We maintain consistent quality control across every batch, building long-term trust with distributors and clients through reliable exports and a vast variety of over 1000 product designs.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 ambient-shadow">
                <h3 className="font-headline-md text-xl text-primary mb-3">Quality Without Compromise</h3>
                <p className="font-body-md text-on-surface-variant">A relentless commitment to export-grade manufacturing standards on every tile produced.</p>
              </div>
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 ambient-shadow">
                <h3 className="font-headline-md text-xl text-primary mb-3">Durability by Design</h3>
                <p className="font-body-md text-on-surface-variant">Engineering tiles specifically for heavy outdoor use, including parking areas, walkways, and high-traffic commercial spaces.</p>
              </div>
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 ambient-shadow">
                <h3 className="font-headline-md text-xl text-primary mb-3">Craftsmanship Rooted in Heritage</h3>
                <p className="font-body-md text-on-surface-variant">Since 2015, we have been blending traditional ceramic knowledge with modern manufacturing precision.</p>
              </div>
              <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/30 ambient-shadow">
                <h3 className="font-headline-md text-xl text-primary mb-3">Global Trust, Local Roots</h3>
                <p className="font-body-md text-on-surface-variant">Proudly manufactured in Morbi, Gujarat, and trusted across more than 12 export countries.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-outline-variant/30 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div variants={fadeUp}>
            <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">250+</div>
            <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Happy Clients</div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">12</div>
            <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Export Countries</div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">1000+</div>
            <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Product Designs</div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">8</div>
            <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Years of Experience</div>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
