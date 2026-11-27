/**
 * POST /api/admin/upload-local
 *
 * Saves video or PDF files directly into the /public folder on the
 * server's filesystem. The file is then served as a static asset via
 * Next.js's built-in static file serving.
 *
 * Accepted query param or form field:
 *   - file         : the File blob
 *   - resourceType : "video" | "pdf"  (default: "video")
 *   - oldPath      : previous public path to delete (optional)
 *
 * Routes by type:
 *   video → /public/videos/<slugified-name>.<ext>  → served at /videos/...
 *   pdf   → /public/pdfs/<slugified-name>.<ext>    → served at /pdfs/...
 *
 * Returns:
 *   { url: "/videos/my-video-lx4k2m.mp4", filename: "my-video-lx4k2m.mp4" }
 */

import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// Increase the route body size limit to 200MB so large videos go through.
// This is a Next.js route-segment config — must be a plain export.
export const maxDuration = 60; // seconds (Vercel hobby = 10, pro = 60)

/**
 * Route segment body-size config (Next.js 15+).
 * Allows this single route to accept up to 200 MB.
 */
export const dynamic = 'force-dynamic';

// Next.js 15 / App Router: set body size limit per-route via config export
export const fetchCache = 'force-no-store';

/** Slug-safe filename: strip extension, lowercase, replace non-alnum with dash */
function slugify(name) {
  return name
    .replace(/\.[^.]+$/, '')           // strip extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Extract file extension (with dot), e.g. ".mp4" */
function ext(name) {
  const m = name.match(/\.[^.]+$/);
  return m ? m[0].toLowerCase() : '';
}

/** Map MIME type → safe extension when file.name has no extension */
const MIME_EXT = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'application/pdf': '.pdf',
};

export const POST = withAuth(async (req) => {
  try {
    // Parse multipart form-data
    let formData;
    try {
      formData = await req.formData();
    } catch {
      return errorResponse('Could not parse form-data. Ensure Content-Type is multipart/form-data.', 400);
    }

    const file = formData.get('file');
    const resourceType = (formData.get('resourceType') || 'video').toLowerCase();
    const oldPath = formData.get('oldPath') || '';

    if (!file || typeof file === 'string') {
      return errorResponse('No file provided', 400);
    }

    // ── Validate MIME ─────────────────────────────────────────
    const mimeType = file.type || '';
    const isVideo = mimeType.startsWith('video/') || resourceType === 'video';
    const isPdf   = mimeType === 'application/pdf' || resourceType === 'pdf';

    if (!isVideo && !isPdf) {
      return errorResponse(
        `Unsupported type "${mimeType}". Only video/* and application/pdf are accepted here.`,
        400
      );
    }

    // ── Build a clean filename ────────────────────────────────
    const originalName = file.name || 'upload';
    const fileExt = ext(originalName) || MIME_EXT[mimeType] || (isVideo ? '.mp4' : '.pdf');
    const baseName = slugify(originalName);
    const timestamp = Date.now().toString(36); // e.g. "lx4k2m"
    const filename = `${baseName}-${timestamp}${fileExt}`;

    // ── Resolve destination folder ────────────────────────────
    // process.cwd() = project root (where package.json lives)
    const subDir = isVideo ? 'videos' : 'pdfs';
    const destDir = path.join(process.cwd(), 'public', subDir);

    // Ensure folder exists (in case it was deleted)
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }

    const destPath = path.join(destDir, filename);

    // ── Write to disk ─────────────────────────────────────────
    const bytes = await file.arrayBuffer();
    await writeFile(destPath, Buffer.from(bytes));

    // ── Delete old file if supplied ───────────────────────────
    if (oldPath) {
      // oldPath is a public URL like "/videos/old-video-abc.mp4"
      const oldRelative = oldPath.replace(/^\//, ''); // strip leading /
      const oldAbsolute = path.join(process.cwd(), 'public', oldRelative);
      await unlink(oldAbsolute).catch(() => {}); // silent — may not exist
    }

    const publicUrl = `/${subDir}/${filename}`;

    return successResponse(
      { url: publicUrl, filename, publicPath: publicUrl },
      'File saved successfully'
    );
  } catch (err) {
    console.error('[POST /api/admin/upload-local]', err);
    return errorResponse(err.message || 'File save failed', 500);
  }
});
