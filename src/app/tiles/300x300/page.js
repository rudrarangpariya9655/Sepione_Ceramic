import TileGallery from '@/components/TileGallery';
import { getTiles, getCategoryResult } from '@/lib/tiles';

export const revalidate = 60;

export const metadata = {
  title: '300x300 Tiles',
  description: 'Browse our premium 300 × 300 mm tiles collection.',
};

export default async function Tiles300x300Page() {
  const [collection, categoryResult] = await Promise.all([
    getTiles({ size: '12x12' }),
    getCategoryResult('12x12'),
  ]);

  return (
    <main id="main-content">
      <TileGallery
        title="300x300 Tiles"
        size="12x12"
        initialTiles={collection.tiles}
        initialTotalCount={collection.totalCount}
        initialError={collection.error}
        availableCategories={categoryResult.categories}
        initialCategoryError={categoryResult.error}
      />
    </main>
  );
}
