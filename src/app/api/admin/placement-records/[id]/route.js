/**
 * GET    /api/admin/placement-records/[id]
 * PATCH  /api/admin/placement-records/[id]
 * DELETE /api/admin/placement-records/[id]  (soft delete — sets isActive: false)
 *
 * All protected.
 */

import { connectDB } from '@/lib/mongodb';
import PlacementRecord from '@/models/PlacementRecord';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const GET = withAuth(async (req, { params }) => {
  try {
    await connectDB();
    const record = await PlacementRecord.findById(params.id).lean();
    if (!record) return errorResponse('Record not found', 404);
    return successResponse(record);
  } catch (err) {
    console.error('[GET /api/admin/placement-records/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});

export const PATCH = withAuth(async (req, { params }) => {
  try {
    await connectDB();

    const body = await req.json();
    const allowed = ['batch', 'name', 'specialization', 'company', 'isActive'];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const record = await PlacementRecord.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!record) return errorResponse('Record not found', 404);
    return successResponse(record, 'Record updated');
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return errorResponse('Validation failed', 422, errors);
    }
    console.error('[PATCH /api/admin/placement-records/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});

export const DELETE = withAuth(async (req, { params }) => {
  try {
    await connectDB();

    // Soft delete — preserves data, just hides it
    const record = await PlacementRecord.findByIdAndUpdate(
      params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!record) return errorResponse('Record not found', 404);
    return successResponse(null, 'Record deleted');
  } catch (err) {
    console.error('[DELETE /api/admin/placement-records/:id]', err);
    return errorResponse('Internal server error', 500);
  }
});
