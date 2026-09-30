import { getTiles } from '@/lib/tiles';
import AnimatedHome from '@/components/AnimatedHome';

export const revalidate = 60;

export default async function Home() {
  const [collection12, collection16] = await Promise.all([
    getTiles({ size: '12x12', limit: 3 }),
    getTiles({ size: '16x16', limit: 3 }),
  ]);

  return (
    <AnimatedHome
      tiles12x12={collection12.tiles}
      tiles16x16={collection16.tiles}
      catalogUnavailable={Boolean(collection12.error || collection16.error)}
    />
  );
}
