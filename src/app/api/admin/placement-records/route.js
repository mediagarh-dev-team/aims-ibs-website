/**
 * GET  /api/admin/placement-records  — list with filters (batch, spec)
 * POST /api/admin/placement-records  — create new record (admin only)
 */

import { connectDB } from '@/lib/mongodb';
import PlacementRecord from '@/models/PlacementRecord';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const GET = withAuth(async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page           = Math.max(parseInt(searchParams.get('page')  || '1'), 1);
    const limit          = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const batch          = searchParams.get('batch');
    const specialization = searchParams.get('specialization');
    const search         = searchParams.get('search');

    const filter = { isActive: true };
    if (batch)          filter.batch = batch;
    if (specialization) filter.specialization = specialization;
    if (search)         filter.name = { $regex: search, $options: 'i' };

    const [docs, total] = await Promise.all([
      PlacementRecord.find(filter)
        .sort({ batch: -1, createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PlacementRecord.countDocuments(filter),
    ]);

    return successResponse({
      records: docs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[GET /api/admin/placement-records]', err);
    return errorResponse('Internal server error', 500);
  }
});

export const POST = withAuth(async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const { batch, name, specialization, company } = body;

    if (!batch || !name || !specialization || !company) {
      return errorResponse('batch, name, specialization and company are required', 400);
    }

    const record = await PlacementRecord.create({
      batch,
      name,
      specialization,
      company,
    });

    return successResponse(record, 'Record created', 201);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return errorResponse('Validation failed', 422, errors);
    }
    console.error('[POST /api/admin/placement-records]', err);
    return errorResponse('Internal server error', 500);
  }
});
