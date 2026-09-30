import TileGallery from '@/components/TileGallery';
import { getTiles, getCategoryResult } from '@/lib/tiles';

export const revalidate = 60;

export const metadata = {
  title: '16x16 Tiles',
  description: 'Browse our premium 16x16 tiles collection.',
};

export default async function Tiles16x16Page() {
  const [collection, categoryResult] = await Promise.all([
    getTiles({ size: '16x16' }),
    getCategoryResult('16x16'),
  ]);

  return (
    <main id="main-content">
      <TileGallery
        title="16x16 Tiles"
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
