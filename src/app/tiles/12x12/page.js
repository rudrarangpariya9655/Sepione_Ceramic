import TileGallery from '@/components/TileGallery';
import { getTiles, getCategoryResult } from '@/lib/tiles';

export const revalidate = 60;

export const metadata = {
  title: '12x12 Tiles',
  description: 'Browse our premium 12x12 tiles collection.',
};

export default async function Tiles12x12Page() {
  const [collection, categoryResult] = await Promise.all([
    getTiles({ size: '12x12' }),
    getCategoryResult('12x12'),
  ]);

  return (
    <main id="main-content">
      <TileGallery
        title="12x12 Tiles"
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
