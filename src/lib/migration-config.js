import fs from 'node:fs';
import path from 'node:path';

export function migrationConfiguration(value, filesystem = fs) {
  if (!value?.trim()) return { ready: false, error: 'Bulk migration is unavailable. Set TILES_LOCAL_PATH to your tile source directory on this server.' };
  if (!path.isAbsolute(value)) return { ready: false, error: 'TILES_LOCAL_PATH must be an absolute directory path on this server.' };
  try {
    if (!filesystem.statSync(value).isDirectory()) return { ready: false, error: 'TILES_LOCAL_PATH must point to a directory, not a file.' };
    filesystem.accessSync(value, fs.constants.R_OK);
    return { ready: true, error: null };
  } catch (error) {
    return { ready: false, error: error.code === 'ENOENT'
      ? 'The configured tile source directory does not exist on this server. Update TILES_LOCAL_PATH.'
      : 'The configured tile source directory cannot be read. Check its permissions and TILES_LOCAL_PATH.' };
  }
}
