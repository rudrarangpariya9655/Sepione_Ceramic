"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { GemIcon, LayersIcon, KilnIcon, PackageIcon } from "@/components/icons";

const ease = [0.2, 0.8, 0.2, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const VALUES = [
  {
    Icon: GemIcon,
    title: "Quality Without Compromise",
    body: "A relentless commitment to export-grade manufacturing standards on every tile produced.",
  },
  {
    Icon: LayersIcon,
    title: "Durability by Design",
    body: "Engineering tiles specifically for heavy outdoor use, including parking areas, walkways, and high-traffic commercial spaces.",
  },
  {
    Icon: KilnIcon,
    title: "Craftsmanship Rooted in Heritage",
    body: "Since 2015, we have been blending traditional ceramic knowledge with modern manufacturing precision.",
  },
  {
    Icon: PackageIcon,
    title: "Global Trust, Local Roots",
    body: "Proudly manufactured in Morbi, Gujarat, and trusted across more than 12 export countries.",
  },
];

const STATS = [
  { end: 250, suffix: "+", label: "Happy Clients" },
  { end: 12, suffix: "", label: "Export Countries" },
  { end: 1000, suffix: "+", label: "Product Designs" },
  { end: 8, suffix: "", label: "Years of Experience" },
];

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
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {VALUES.map(({ Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group bg-surface-container/80 p-8 rounded-3xl border border-outline-variant/40 ambient-shadow-sm lift"
                >
                  <span className="icon-chip mb-5">
                    <Icon size={24} />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface group-hover:text-primary transition-colors duration-300 mb-3">
                    {title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant">{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-outline-variant/30 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2 tabular-nums">
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </main>
  );
}
