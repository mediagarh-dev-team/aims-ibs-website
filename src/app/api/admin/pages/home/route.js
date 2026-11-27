/**
 * /api/admin/pages/home
 *
 * GET   — fetch current home page content (creates default if none exists)
 * PUT   — replace the whole document (used for Publish)
 * PATCH — update only specific top-level sections (used for Save Section)
 *         Body: { section: "hero", data: { ... } }
 *           OR: { isPublished: true }  (publish toggle)
 *
 * All routes are protected with the JWT withAuth middleware.
 */

import { connectDB } from '@/lib/mongodb';
import HomePage from '@/models/HomePage';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// Top-level section keys the client is allowed to PATCH individually
const ALLOWED_SECTIONS = [
  'hero', 'stats', 'programs', 'ranked',
  'globalCollaborations', 'globalExposure',
  'placements', 'placedStudents', 'whyChoose',
  'lifeAtIBS', 'sparkModel', 'joinCta',
  'isPublished',
];

/* ── GET ─────────────────────────────────────────────────────── */
export const GET = withAuth(async () => {
  try {
    await connectDB();
    let doc = await HomePage.findOne({ _key: 'home' }).lean();
    if (!doc) {
      doc = await HomePage.create({ _key: 'home' });
      doc = doc.toObject();
    }
    return successResponse(doc, 'Home page content fetched');
  } catch (err) {
    console.error('[GET /api/admin/pages/home]', err);
    return errorResponse('Internal server error', 500);
  }
});

/* ── PATCH — save only one section ───────────────────────────── */
export const PATCH = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { section, data } = body;

    // Allow patching isPublished directly
    if (section === 'isPublished' && typeof data === 'boolean') {
      await connectDB();
      const doc = await HomePage.findOneAndUpdate(
        { _key: 'home' },
        { $set: { isPublished: data } },
        { upsert: true, new: true }
      ).lean();
      return successResponse({ isPublished: doc.isPublished }, 'Published state updated');
    }

    if (!section || !ALLOWED_SECTIONS.includes(section)) {
      return errorResponse(`Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}`, 400);
    }

    if (data === undefined) {
      return errorResponse('data is required', 400);
    }

    await connectDB();

    const doc = await HomePage.findOneAndUpdate(
      { _key: 'home' },
      { $set: { [section]: data } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    // Return only the updated section + timestamps so the client
    // doesn't have to refetch the whole document
    return successResponse(
      { [section]: doc[section], updatedAt: doc.updatedAt },
      `Section "${section}" saved`
    );
  } catch (err) {
    console.error('[PATCH /api/admin/pages/home]', err);
    return errorResponse('Internal server error', 500);
  }
});

/* ── PUT — full replace (Publish button) ─────────────────────── */
export const PUT = withAuth(async (req) => {
  try {
    const body = await req.json();
    // eslint-disable-next-line no-unused-vars
    const { _id, _key, __v, createdAt, updatedAt, ...updateData } = body;

    await connectDB();
    const doc = await HomePage.findOneAndUpdate(
      { _key: 'home' },
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return successResponse(doc, 'Home page content saved');
  } catch (err) {
    console.error('[PUT /api/admin/pages/home]', err);
    return errorResponse('Internal server error', 500);
  }
});
