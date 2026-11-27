/**
 * POST /api/admin/upload
 *
 * Cloudinary upload for IMAGES only.
 * Videos and PDFs go to /api/admin/upload-local instead.
 *
 * Accepts multipart/form-data:
 *   - file         : the image File blob  (jpg / png / webp / gif / svg)
 *   - folder       : Cloudinary folder (default: "aims-ibs")
 *   - oldPublicId  : public_id of the asset to delete after upload (optional)
 *
 * The original filename (without extension) is used as the Cloudinary
 * public_id so assets are identifiable in the Cloudinary dashboard.
 *
 * Returns: { secure_url, public_id }
 */

import { withAuth } from '@/middleware/withAuth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// Route-segment body-size config — allow up to 20 MB for large images.
export const dynamic = 'force-dynamic';

export const PUT = withAuth(async () => errorResponse('Use POST for uploads', 405));

export const POST = withAuth(async (req) => {
  try {
    // Parse multipart form-data
    let formData;
    try {
      formData = await req.formData();
    } catch {
      return errorResponse(
        'Could not parse form-data. Ensure Content-Type is multipart/form-data.',
        400
      );
    }

    const file = formData.get('file');
    const folder = formData.get('folder') || 'aims-ibs';
    const oldPublicId = formData.get('oldPublicId') || '';

    if (!file || typeof file === 'string') {
      return errorResponse('No file provided', 400);
    }

    // Only images here — redirect videos/pdfs to /api/admin/upload-local
    const mimeType = file.type || '';
    if (!mimeType.startsWith('image/')) {
      return errorResponse(
        'This endpoint only accepts images. Upload videos/PDFs to /api/admin/upload-local.',
        400
      );
    }

    // ── Derive a clean public_id from the original filename ────
    const originalName = file.name || 'upload';
    const baseName = originalName
      .replace(/\.[^.]+$/, '')          // strip extension
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')     // non-alphanumeric → hyphen
      .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens

    // Short timestamp suffix prevents collisions if same file is re-uploaded
    const publicId = `${baseName}-${Date.now().toString(36)}`;

    // ── Convert File → base64 data URI ────────────────────────
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    // ── Delete old Cloudinary asset ────────────────────────────
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId, 'image').catch(() => { });
    }

    // ── Upload to Cloudinary ───────────────────────────────────
    const result = await uploadToCloudinary(dataUri, { folder, resourceType: 'image', publicId });

    return successResponse(result, 'Image uploaded successfully');
  } catch (err) {
    console.error('[POST /api/admin/upload]', err);
    return errorResponse(err.message || 'Upload failed', 500);
  }
});
