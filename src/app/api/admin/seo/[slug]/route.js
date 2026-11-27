/**
 * /api/admin/seo/[slug]
 *
 * GET  — fetch SEO doc for a slug (or empty defaults)
 * PUT  — upsert SEO doc for a slug
 *
 * Both routes require JWT auth.
 */

import { connectDB } from '@/lib/mongodb';
import PageSeo from '@/models/PageSeo';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

/* ── GET ─────────────────────────────────────────────────────── */
export const GET = withAuth(async (_req, { params }, _admin) => {
  try {
    const { slug } = await params;
    if (!slug) return errorResponse('Slug is required', 400);

    await connectDB();

    const doc = await PageSeo.findOne({ slug: slug.toLowerCase() }).lean();
    return successResponse(doc ?? null, doc ? 'SEO data fetched' : 'No SEO data yet');
  } catch (err) {
    console.error('[GET /api/admin/seo/[slug]]', err);
    return errorResponse('Internal server error', 500);
  }
});

/* ── PUT ─────────────────────────────────────────────────────── */
export const PUT = withAuth(async (req, { params }, _admin) => {
  try {
    const { slug } = await params;
    if (!slug) return errorResponse('Slug is required', 400);

    const body = await req.json();

    // Disallow changing slug via body
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, createdAt, updatedAt, slug: _s, ...updateData } = body;

    await connectDB();

    const doc = await PageSeo.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      {
        $set: {
          ...updateData,
          slug: slug.toLowerCase(),
        },
      },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return successResponse(doc, 'SEO data saved');
  } catch (err) {
    console.error('[PUT /api/admin/seo/[slug]]', err);
    if (err.code === 11000) {
      return errorResponse('A page with this slug already exists', 409);
    }
    return errorResponse('Internal server error', 500);
  }
});
