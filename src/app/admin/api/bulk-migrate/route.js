import { NextResponse, after } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/supabase/server';
import cloudinary from '@/lib/cloudinary';
import { authorizeAdmin } from '@/lib/admin-auth';
import { revalidateCatalog } from '@/lib/revalidate-catalog';
import { migrationConfiguration } from '@/lib/migration-config';
import { migrateTileFile } from '@/lib/migrate-tile';
import { identityLookupError, normalizeSourcePath } from '@/lib/tile-identity';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Global state to track migration progress in the local Next.js server
let migrationState = {
  isRunning: false,
  totalFiles: 0,
  uploadedCount: 0,
  skippedCount: 0,
  failedCount: 0,
  currentFile: null,
  failedFiles: [], // { file: string, reason: string }
  isComplete: false,
};

async function walkDirectory(dir, fileList = []) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        await walkDirectory(fullPath, fileList);
      } else if (file.isFile()) {
        // Only include images
        if (file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
          fileList.push(fullPath);
        }
      }
    }
  } catch (err) {
    throw new Error('A tile directory could not be read.', { cause: err });
  }
  return fileList;
}

export async function GET(request) {
  const denied = authorizeAdmin(request.headers.get('Authorization'), { database: false });
  if (denied) return denied;
  return NextResponse.json({ ...migrationState, configuration: migrationConfiguration(process.env.TILES_LOCAL_PATH) });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const denied = authorizeAdmin(body?.secret, { uploads: true });
    if (denied) return denied;

    if (migrationState.isRunning) {
      return NextResponse.json({ success: false, error: "Migration is already running." }, { status: 409 });
    }

    const basePath = process.env.TILES_LOCAL_PATH;
    const configuration = migrationConfiguration(basePath);
    if (!configuration.ready) return NextResponse.json({ success: false, error: configuration.error }, { status: 503 });
    const { error: schemaError } = await supabaseServer.from('tile_images').select('logical_identity').limit(1);
    if (schemaError) return NextResponse.json({ success: false, error: identityLookupError(schemaError).message }, { status: 503 });
    if (migrationState.isRunning) return NextResponse.json({ success: false, error: 'Migration is already running.' }, { status: 409 });

    // Claim the job before awaiting network calls so simultaneous requests
    // cannot launch duplicate uploads.
    migrationState.isRunning = true;
    migrationState.isComplete = false;
    migrationState.currentFile = 'Checking image storage...';
    try {
      await cloudinary.api.ping();
    } catch {
      migrationState.isRunning = false;
      return NextResponse.json({ 
        success: false, 
        error: 'Image storage could not be reached. Please try again.'
      }, { status: 502 });
    }

    // Start background task
    after(() => runMigration(basePath));

    return NextResponse.json({ success: true, message: "Migration started." });

  } catch {
    return NextResponse.json({ success: false, error: "Bad request." }, { status: 400 });
  }
}

async function runMigration(basePath) {
  // Reset State
  migrationState = {
    isRunning: true,
    totalFiles: 0,
    uploadedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    currentFile: "Scanning folders...",
    failedFiles: [],
    isComplete: false,
  };

  try {
    // Load provenance once, handling legacy Windows separators and case.
    const imported = new Map();
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabaseServer.from('tile_images')
        .select('id, local_path, upload_status').order('id').range(offset, offset + 999)
        .abortSignal(AbortSignal.timeout(8000));
      if (error) throw new Error('Could not read existing imports.');
      for (const tile of data) imported.set(normalizeSourcePath(tile.local_path), tile);
      if (data.length < 1000) break;
    }

    const sizes = ['12x12', '16x16'];
    let allFiles = [];

    for (const size of sizes) {
      // These are operator-configured external files, not deployment assets.
      const sizePath = path.join(/* turbopackIgnore: true */ basePath, size);
      if (fs.existsSync(/* turbopackIgnore: true */ sizePath)) {
        await walkDirectory(sizePath, allFiles);
      }
    }

    migrationState.totalFiles = allFiles.length;

    // Process sequentially to respect rate limits and DB connections
    for (const filePath of allFiles) {
      migrationState.currentFile = path.relative(basePath, filePath);
      
      try {
        const relativePath = path.relative(basePath, filePath);
        const outcome = await migrateTileFile({ filePath, relativePath,
          existing: imported.get(normalizeSourcePath(relativePath)), client: supabaseServer, storage: cloudinary });
        if (outcome === 'skipped') migrationState.skippedCount++;
        else migrationState.uploadedCount++;
      } catch (error) {
        migrationState.failedCount++;
        migrationState.failedFiles.push({ file: path.relative(basePath, filePath),
          reason: error.message || 'This tile could not be migrated.',
          ...(error.cleanup ? { cleanup: error.cleanup } : {}),
          ...(error.assetId ? { assetId: error.assetId } : {}),
        });
      }
    }

  } catch {
    migrationState.error = 'Migration stopped because source files or catalogue records could not be read.';
  } finally {
    migrationState.isRunning = false;
    migrationState.isComplete = true;
    migrationState.currentFile = migrationState.error ? 'Stopped.' : 'Finished.';
    if (migrationState.uploadedCount > 0) revalidateCatalog();
  }
}
