export const metadata = {
  title: "About | Sepione Ceramic",
  description: "About Sepione Tiles, one of India's prominent manufacturers and exporters of heavy-duty outdoor tiles.",
};

export default function AboutPage() {
  return (
    <>
      <main className="pt-[140px] pb-section-gap px-6 md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap overflow-x-hidden">
        <section className="max-w-4xl mx-auto space-y-8">
          <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-8">
            About Sepione Tiles
          </h1>
          
          <div className="font-body-lg text-body-lg text-on-surface-variant space-y-6 border-l-2 border-primary-container pl-6">
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
          </div>

          <div className="space-y-12 mt-16 pt-12 border-t border-outline-variant/30">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Our Vision</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                To set the Sepione name globally as a high-class standard through vanguard innovation — 
                using the most relevant technology and materials to make our products among the most demanded worldwide.
              </p>
            </div>
            
            <div>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Our Mission</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                To bring contemporary design, colour, and quality to our customers, stay ahead of market trends, 
                and grow our export presence into new international markets.
              </p>
            </div>

            <div>
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Our Values</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Effectiveness, innovation, and creativity — recognized nationally and internationally for quality, 
                leadership, and professionalism.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-outline-variant/30 text-center">
            <div>
              <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">250+</div>
              <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Happy Clients</div>
            </div>
            <div>
              <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">12</div>
              <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Export Countries</div>
            </div>
            <div>
              <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">1000+</div>
              <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Product Designs</div>
            </div>
            <div>
              <div className="font-display-xl text-3xl md:text-5xl text-primary mb-2">8</div>
              <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Years of Experience</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
