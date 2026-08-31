import TileGallery from "@/components/TileGallery";
import { supabaseClient } from "@/lib/supabase/client";

export const revalidate = 60; // Cache for 60 seconds

export const metadata = {
  title: "16x16 Tiles | Sepione Ceramic",
  description: "Browse our premium 16x16 tiles collection.",
};

export default async function Tiles16x16Page() {
  // Fetch first page of tiles
  const { data: initialTiles, count: initialTotalCount } = await supabaseClient
    .from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, created_at', { count: 'exact' })
    .eq('upload_status', 'SUCCESS')
    .eq('size', '16x16')
    .order('created_at', { ascending: false })
    .range(0, 23);

  // Fetch unique categories for this size
  const { data: categoryData } = await supabaseClient
    .from('tile_images')
    .select('category')
    .eq('size', '16x16')
    .eq('upload_status', 'SUCCESS');
    
  const availableCategories = categoryData ? [...new Set(categoryData.map(c => c.category))] : [];

  return (
    <main>
      <TileGallery 
        title="16x16 Tiles" 
        size="16x16" 
        initialTiles={initialTiles || []} 
        initialTotalCount={initialTotalCount || 0}
        availableCategories={availableCategories}
      />
    </main>
  );
}
