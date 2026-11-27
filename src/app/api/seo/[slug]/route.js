/**
 * GET /api/seo/[slug]
 *
 * Public, cacheable endpoint.
 * Returns the SEO document for a given page slug.
 * Returns 200 with an empty data object when the slug has no document
 * (let the frontend fall back to its own defaults).
 */

import { connectDB } from '@/lib/mongodb';
import PageSeo from '@/models/PageSeo';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic'; // allow ISR on the caller side

export async function GET(_req, { params }) {
  try {
    const { slug } = await params;

    if (!slug) return errorResponse('Slug is required', 400);

    await connectDB();

    const doc = await PageSeo.findOne(
      { slug: slug.toLowerCase(), isActive: true },
      { slug: 1, pageName: 1, title: 1, description: 1, keywords: 1, ogImage: 1, canonicalPath: 1, index: 1 }
    ).lean();

    if (!doc) {
      // Return empty — caller will use its own defaults
      return successResponse(null, 'No SEO data found for this page');
    }

    return successResponse(doc, 'SEO data fetched successfully');
  } catch (err) {
    console.error('[GET /api/seo/[slug]]', err);
    return errorResponse('Internal server error', 500);
  }
}
