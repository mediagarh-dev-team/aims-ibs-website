/**
 * GET    /api/admin/enquiries/[id]   — single enquiry
 * PATCH  /api/admin/enquiries/[id]   — update status / notes
 * DELETE /api/admin/enquiries/[id]   — delete
 *
 * All protected.
 */

import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const GET = withAuth(async (req, { params }) => {
  try {
    await connectDB();
    const enquiry = await Enquiry.findById(params.id).lean();
    if (!enquiry) return errorResponse('Enquiry not found', 404);
    return successResponse(enquiry);
  } catch (err) {
    console.error('[GET /api/admin/enquiries/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});

export const PATCH = withAuth(async (req, { params }) => {
  try {
    await connectDB();

    const body = await req.json();
    const allowed = ['status', 'notes'];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) return errorResponse('Enquiry not found', 404);
    return successResponse(enquiry, 'Enquiry updated');
  } catch (err) {
    console.error('[PATCH /api/admin/enquiries/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});

export const DELETE = withAuth(async (req, { params }) => {
  try {
    await connectDB();
    const enquiry = await Enquiry.findByIdAndDelete(params.id);
    if (!enquiry) return errorResponse('Enquiry not found', 404);
    return successResponse(null, 'Enquiry deleted');
  } catch (err) {
    console.error('[DELETE /api/admin/enquiries/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});
