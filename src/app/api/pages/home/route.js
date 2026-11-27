/**
 * GET /api/pages/home
 *
 * Public endpoint (no auth) — returns published home page content.
 * Returns 404 when the page is not yet published.
 *
 * Cache via Next.js route segment config (1 hour ISR).
 */

import { connectDB } from '@/lib/mongodb';
import HomePage from '@/models/HomePage';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const doc = await HomePage.findOne(
      { _key: 'home', isPublished: true },
      { _key: 0, __v: 0 }
    ).lean();

    if (!doc) {
      return successResponse(null, 'Home page not published yet');
    }

    return successResponse(doc, 'Home page content fetched');
  } catch (err) {
    console.error('[GET /api/pages/home]', err);
    return errorResponse('Internal server error', 500);
  }
}
