/**
 * GET /api/admin/dashboard
 *
 * Returns aggregate stats for the admin dashboard.
 * Protected — requires Bearer token.
 */

import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import PlacementRecord from '@/models/PlacementRecord';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export const GET = withAuth(async (req) => {
  try {
    await connectDB();

    const [
      totalEnquiries,
      newEnquiries,
      totalPlacements,
      enquiriesByStatus,
      placementsByBatch,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      PlacementRecord.countDocuments({ isActive: true }),

      // Group enquiries by status
      Enquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Group placements by batch
      PlacementRecord.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]),
    ]);

    return successResponse({
      totalEnquiries,
      newEnquiries,
      totalPlacements,
      enquiriesByStatus,
      placementsByBatch,
    });
  } catch (err) {
    console.error('[GET /api/admin/dashboard]', err);
    return errorResponse('Internal server error', 500);
  }
});
