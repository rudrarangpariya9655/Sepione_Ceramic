"use client";

import Link from "next/link";
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

export default function AnimatedInformations() {
  return (
    <main className="pt-[140px] pb-section-gap px-6 md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap overflow-x-hidden">
      <motion.section 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp}>
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-2">
            Product Informations
          </h1>
          <div className="font-body-md text-on-surface-variant flex gap-2 uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary">Informations</span>
          </div>
        </motion.div>
        
        {/* PACKING DETAILS SECTION */}
        <motion.div variants={staggerContainer} className="space-y-6 mt-16">
          <motion.h2 variants={fadeUp} className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Packing Details
          </motion.h2>
          <motion.div variants={fadeUp} className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/30 text-primary font-body-md uppercase tracking-wider text-sm">
                    <th className="p-4 whitespace-nowrap">Size (mm)</th>
                    <th className="p-4 whitespace-nowrap">Thickness (mm)</th>
                    <th className="p-4 whitespace-nowrap">Pcs Per Box</th>
                    <th className="p-4 whitespace-nowrap">Box Weight</th>
                    <th className="p-4 whitespace-nowrap">Coverage (Sq. Ft.)</th>
                    <th className="p-4 whitespace-nowrap">Coverage (Sq. Mtr)</th>
                    <th className="p-4 whitespace-nowrap">Box Per Pallet</th>
                    <th className="p-4 whitespace-nowrap">Pallet Weight</th>
                    <th className="p-4 whitespace-nowrap">Pallet Per Container</th>
                    <th className="p-4 whitespace-nowrap">Box Per Container</th>
                    <th className="p-4 whitespace-nowrap">Sq. Mtr Per Container</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-on-surface-variant">
                  {/* // TODO: Replace placeholder packing specs with real Sepione values */}
                  <tr className="border-b border-outline-variant/20 hover:bg-surface-container-highest transition-colors">
                    <td className="p-4 font-semibold text-on-surface">300x300 (12x12)</td>
                    <td className="p-4">12</td>
                    <td className="p-4">5</td>
                    <td className="p-4">19 KG</td>
                    <td className="p-4">8.6</td>
                    <td className="p-4">0.8</td>
                    <td className="p-4">72</td>
                    <td className="p-4">1386 KG</td>
                    <td className="p-4">20</td>
                    <td className="p-4">1440</td>
                    <td className="p-4">1152</td>
                  </tr>
                  <tr className="hover:bg-surface-container-highest transition-colors bg-surface-container/50">
                    <td className="p-4 font-semibold text-on-surface">400x400 (16x16)</td>
                    <td className="p-4">12</td>
                    <td className="p-4">5</td>
                    <td className="p-4">19 KG</td>
                    <td className="p-4">8.6</td>
                    <td className="p-4">0.8</td>
                    <td className="p-4">72</td>
                    <td className="p-4">1386 KG</td>
                    <td className="p-4">20</td>
                    <td className="p-4">1440</td>
                    <td className="p-4">1152</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* TECHNICAL DETAILS SECTION */}
        <motion.div 
          className="space-y-6 mt-16 pt-12 border-t border-outline-variant/30"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.h2 variants={fadeUp} className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Technical Details
          </motion.h2>
          <motion.div variants={fadeUp} className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/30 text-primary font-body-md uppercase tracking-wider text-sm">
                    <th className="p-4 whitespace-nowrap">Characteristic</th>
                    <th className="p-4 whitespace-nowrap">Standard (ISO-13006/EN14411 Group Bla)</th>
                    <th className="p-4 whitespace-nowrap">Mean Value (Sepione Vitrified Tiles)</th>
                    <th className="p-4 whitespace-nowrap">Test Method</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-on-surface-variant">
                  {/* // TODO: Confirm/replace technical spec values with Sepione's actual lab-tested figures */}
                  {[
                    ["Deviation in length/width", "± 0.6%", "± 0.1%", "ISO-10545-2"],
                    ["Deviation in thickness", "± 5.0%", "± 4.0%", "ISO-10545-2"],
                    ["Straightness of sides", "± 0.5%", "± 0.1%", "ISO-10545-2"],
                    ["Rectangularity", "± 0.6%", "± 0.1%", "ISO-10545-2"],
                    ["Surface flatness", "± 0.5%", "± 0.2%", "ISO-10545-2"],
                    ["Color differences", "Unaltered", "No change", "ISO-10545-16"],
                    ["Glossiness", "As per mfg", "Min 90%", "Glossmeter"],
                    ["Surface quality", "Min 95%", "Min 95%", "ISO-10545-2"],
                    ["Water absorption", "≤ 0.5%", "< 0.05%", "ISO-10545-3"],
                    ["Apparent density", "> 2.0 g/cc", "> 2.20 g/cc", "DIN 51082"],
                    ["Flexural modulus of rupture", "≥ 35 N/mm²", "≥ 40 N/mm²", "ISO-10545-4"],
                    ["Flexural breaking strength", "≥ 1300 N", "≥ 2000 N", "ISO-10545-4"],
                    ["Impact resistance", "As per mfg", "Min 0.55", "ISO-10545-5"],
                    ["Deep abrasion resistance", "Max 175 mm³", "Max 132 mm³", "ISO-10545-6"],
                    ["Moh's hardness", "Min 6", "8", "EN 101"],
                    ["Frost resistance", "Frost proof", "Frost proof", "ISO-10545-12"],
                    ["Thermal shock resistance", "No damage", "No damage", "ISO-10545-9"],
                    ["Moisture expansion", "Nil", "Nil", "ISO-10545-10"],
                    ["Thermal expansion", "Max 9.0 x 10⁻⁶", "Max 6.0 x 10⁻⁶", "ISO-10545-8"],
                    ["Chemical resistance", "No damage", "No damage", "ISO-10545-13"],
                    ["Stain resistance", "Resistance", "Resistance", "ISO-10545-14"],
                    ["Slip resistance", "As per mfg", "> 0.40", "ISO-10545-17"]
                  ].map((row, idx) => (
                    <tr key={idx} className={`border-b border-outline-variant/20 hover:bg-surface-container-highest transition-colors ${idx % 2 === 1 ? 'bg-surface-container/50' : ''}`}>
                      <td className="p-4 font-semibold text-on-surface">{row[0]}</td>
                      <td className="p-4">{row[1]}</td>
                      <td className="p-4">{row[2]}</td>
                      <td className="p-4">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
