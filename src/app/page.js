import Link from "next/link";
import { getThumbnailUrl } from "@/lib/cloudinary-utils";
import Navbar from "@/components/Navbar";
import { supabaseClient } from '@/lib/supabase/client';

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  // Fetch hero tile (newest global)
  const { data: heroData } = await supabaseClient
    .from('tile_images')
    .select('cloudinary_secure_url')
    .eq('upload_status', 'SUCCESS')
    .order('created_at', { ascending: false })
    .limit(1);
    
  const heroTile = heroData && heroData.length > 0 ? heroData[0].cloudinary_secure_url : null;

  // Fetch top 3 for 12x12
  const { data: tiles12x12 } = await supabaseClient
    .from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, created_at')
    .eq('upload_status', 'SUCCESS')
    .eq('size', '12x12')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch top 3 for 16x16
  const { data: tiles16x16 } = await supabaseClient
    .from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, created_at')
    .eq('upload_status', 'SUCCESS')
    .eq('size', '16x16')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <>
      <Navbar />

      <main className="pt-[140px] pb-section-gap px-6 md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="flex flex-col md:grid md:grid-cols-12 gap-gutter items-center min-h-0 md:min-h-[716px]">
          <div className="col-span-12 md:col-span-7 z-10">
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-8 relative leading-tight">
              <span className="block text-primary-container relative z-10 mix-blend-difference">Earth.</span>
              <span className="block md:pl-12 text-on-surface">Refined.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12 border-l-2 border-primary-container pl-6">
              Avant-garde ceramics crafted for spaces that demand presence. Where raw clay meets monumental scale.
            </p>
            <Link href="/tiles/12x12" className="bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 w-max text-black no-underline">
              Explore Collections
              <span>→</span>
            </Link>
          </div>
          <div className="col-span-12 md:col-span-5 relative mt-12 md:mt-0">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden ambient-shadow relative">
              <div 
                className="bg-cover bg-center w-full h-full absolute inset-0 transition-opacity duration-1000" 
                style={{ 
                  backgroundImage: `url('${heroTile || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25"%3E%3Crect width="100%25" height="100%25" fill="%232d2a26"/%3E%3C/svg%3E'}')`,
                  opacity: 1
                }}
              ></div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-12 -left-12 bg-surface-container p-6 rounded-lg backdrop-blur-md border border-white/5 ambient-shadow w-64 hidden md:block">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Featured Finish</div>
              <div className="font-headline-md text-headline-md text-primary">Rock Style</div>
            </div>
          </div>
        </section>

        {/* 12x12 Collection (Asymmetric Bento) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-4">Standard Format</span>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface">12x12 Collection</h2>
            </div>
            <Link href="/tiles/12x12" className="font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase flex items-center gap-2 hidden md:flex no-underline">
              View All Standard <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-gutter">
            {/* Large Feature Tile */}
            {tiles12x12 && tiles12x12[0] && (
              <div className="col-span-12 md:col-span-8 group cursor-pointer relative">
                <Link href="/tiles/12x12" className="block no-underline">
                  <div className="aspect-[16/9] rounded-[2rem] overflow-hidden relative ambient-shadow mb-6">
                    <div 
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700" 
                      style={{ backgroundImage: `url('${getThumbnailUrl(tiles12x12[0].cloudinary_secure_url)}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 transition-colors duration-500"></div>
                    {/* Tag */}
                    <div className="absolute top-6 left-6 bg-[#525EA7] text-white font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest">Newest Arrival</div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tiles12x12[0].filename}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 uppercase text-xs tracking-widest">{tiles12x12[0].category}</p>
                </Link>
              </div>
            )}
            
            {/* Stacked Secondary Tiles */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-gutter">
              {tiles12x12 && tiles12x12.slice(1, 3).map((tile, i) => (
                <Link key={i} href="/tiles/12x12" className="group cursor-pointer flex-1 block no-underline">
                  <div className="h-48 rounded-[2rem] overflow-hidden relative ambient-shadow mb-4">
                    <div 
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700" 
                      style={{ backgroundImage: `url('${getThumbnailUrl(tile.cloudinary_secure_url)}')` }}
                    ></div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-2xl">{tile.filename}</h3>
                </Link>
              ))}
              {(!tiles12x12 || tiles12x12.length === 0) && (
                <div className="text-on-surface-variant text-sm border border-outline-variant/30 rounded-2xl p-6 text-center">No tiles uploaded yet.</div>
              )}
            </div>
          </div>
        </section>

        {/* 16x16 Collection (Asymmetric Bento) */}
        <section>
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-4">Monumental Scale</span>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface">16x16 Collection</h2>
            </div>
            <Link href="/tiles/16x16" className="font-label-sm text-label-sm text-on-surface hover:text-primary transition-colors uppercase flex items-center gap-2 hidden md:flex no-underline">
              View All Monumental <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-12 gap-gutter">
            {/* Large Feature Tile */}
            {tiles16x16 && tiles16x16[0] && (
              <div className="col-span-12 md:col-span-8 group cursor-pointer relative">
                <Link href="/tiles/16x16" className="block no-underline">
                  <div className="aspect-[16/9] rounded-[2rem] overflow-hidden relative ambient-shadow mb-6">
                    <div 
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700" 
                      style={{ backgroundImage: `url('${getThumbnailUrl(tiles16x16[0].cloudinary_secure_url)}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 transition-colors duration-500"></div>
                    {/* Tag */}
                    <div className="absolute top-6 left-6 bg-[#525EA7] text-white font-label-sm text-label-sm px-4 py-2 rounded-full uppercase tracking-widest">Newest Arrival</div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">{tiles16x16[0].filename}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2 uppercase text-xs tracking-widest">{tiles16x16[0].category}</p>
                </Link>
              </div>
            )}
            
            {/* Stacked Secondary Tiles */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-gutter">
              {tiles16x16 && tiles16x16.slice(1, 3).map((tile, i) => (
                <Link key={i} href="/tiles/16x16" className="group cursor-pointer flex-1 block no-underline">
                  <div className="h-48 rounded-[2rem] overflow-hidden relative ambient-shadow mb-4">
                    <div 
                      className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700" 
                      style={{ backgroundImage: `url('${getThumbnailUrl(tile.cloudinary_secure_url)}')` }}
                    ></div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors text-2xl">{tile.filename}</h3>
                </Link>
              ))}
              {(!tiles16x16 || tiles16x16.length === 0) && (
                <div className="text-on-surface-variant text-sm border border-outline-variant/30 rounded-2xl p-6 text-center">No tiles uploaded yet.</div>
              )}
            </div>
          </div>
        </section>

        {/* Studio Contact Section */}
        <section className="grid grid-cols-12 gap-gutter items-center border-t border-outline-variant/30 pt-20" id="contact">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-headline-lg text-4xl md:text-headline-lg text-on-surface mb-8">Visit the Factory</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">Experience the scale and texture of our collections in person. Private viewings available by appointment.</p>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <span className="text-primary mt-1 font-bold">📍</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Location</div>
                  <div className="font-body-md text-body-md text-on-surface">Pawadiyare Canal,<br/>Morbi, Gujarat, India</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-primary mt-1 font-bold">☏</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Phone</div>
                  <div className="font-body-md text-body-md text-on-surface">+91 90999 50773<br/>+91 90999 50771</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-primary mt-1 font-bold">✉</span>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Email</div>
                  <div className="font-body-md text-body-md text-on-surface">Info@sepionetile.com</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 mt-12 md:mt-0">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden ambient-shadow">
              <div 
                className="bg-cover bg-center w-full h-full" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000')" }}
              ></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
