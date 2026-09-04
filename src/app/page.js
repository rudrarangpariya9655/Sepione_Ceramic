import { supabaseClient } from '@/lib/supabase/client';
import AnimatedHome from "@/components/AnimatedHome";

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
      <AnimatedHome heroTile={heroTile} tiles12x12={tiles12x12} tiles16x16={tiles16x16} />
    </>
  );
}
