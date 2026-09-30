import 'server-only';
import { revalidatePath } from 'next/cache';

export function revalidateCatalog() {
  revalidatePath('/');
  revalidatePath('/tiles/12x12');
  revalidatePath('/tiles/16x16');
}
