import { timingSafeEqual } from 'node:crypto';

export function checkAdminCredential(candidate, expected) {
  if (typeof expected !== 'string' || expected.length < 32 || /^(replace_|your_|example|changeme)/i.test(expected)) {
    return 'unconfigured';
  }
  if (typeof candidate !== 'string' || Buffer.byteLength(candidate) !== Buffer.byteLength(expected)) return 'unauthorized';
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(expected)) ? 'authorized' : 'unauthorized';
}
