import TileGallery from '@/components/TileGallery';
import { getTiles, getCategoryResult } from '@/lib/tiles';

export const revalidate = 60;

export const metadata = {
  title: '400x400 Tiles',
  description: 'Browse our premium 400 × 400 mm tiles collection.',
};

export default async function Tiles400x400Page() {
  const [collection, categoryResult] = await Promise.all([
    getTiles({ size: '16x16' }),
    getCategoryResult('16x16'),
  ]);

  return (
    <main id="main-content">
      <TileGallery
        title="400x400 Tiles"
        size="16x16"
        initialTiles={collection.tiles}
        initialTotalCount={collection.totalCount}
        initialError={collection.error}
        availableCategories={categoryResult.categories}
        initialCategoryError={categoryResult.error}
      />
    </main>
  );
}
