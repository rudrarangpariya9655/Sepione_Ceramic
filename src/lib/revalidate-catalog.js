import 'server-only';
import { revalidatePath } from 'next/cache';

export function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/tiles/300x300');
  revalidatePath('/tiles/400x400');
}
