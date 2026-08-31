import TileGallery from "@/components/TileGallery";
import { supabaseClient } from "@/lib/supabase/client";

export const revalidate = 60; // Cache for 60 seconds

export const metadata = {
  title: "12x12 Tiles | Sepione Ceramic",
  description: "Browse our premium 12x12 tiles collection.",
};

export default async function Tiles12x12Page() {
  // Fetch first page of tiles
  const { data: initialTiles, count: initialTotalCount } = await supabaseClient
    .from('tile_images')
    .select('id, size, category, filename, cloudinary_secure_url, created_at', { count: 'exact' })
    .eq('upload_status', 'SUCCESS')
    .eq('size', '12x12')
    .order('created_at', { ascending: false })
    .range(0, 23);

  // Fetch unique categories for this size
  const { data: categoryData } = await supabaseClient
    .from('tile_images')
    .select('category')
    .eq('size', '12x12')
    .eq('upload_status', 'SUCCESS');
    
  const availableCategories = categoryData ? [...new Set(categoryData.map(c => c.category))] : [];

  return (
    <main>
      <TileGallery 
        title="12x12 Tiles" 
        size="12x12" 
        initialTiles={initialTiles || []} 
        initialTotalCount={initialTotalCount || 0}
        availableCategories={availableCategories}
      />
    </main>
  );
}
