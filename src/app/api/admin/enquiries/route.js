/**
 * GET  /api/admin/enquiries          — paginated list with filters
 * POST /api/admin/enquiries          — public endpoint: submit new enquiry
 */

import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { withAuth } from '@/middleware/withAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { NextResponse } from 'next/server';

// ── GET (admin protected) ───────────────────────────────────────────────────
export const GET = withAuth(async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page     = Math.max(parseInt(searchParams.get('page')  || '1'), 1);
    const limit    = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const status   = searchParams.get('status');   // filter by status
    const search   = searchParams.get('search');   // search by name/email

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [docs, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    return successResponse({
      enquiries: docs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/enquiries]', err);
    return errorResponse('Internal server error', 500);
  }
});

// ── POST (public — anyone can submit an enquiry) ────────────────────────────
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return errorResponse('Name, email and message are required', 400);
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return successResponse(
      { id: enquiry._id },
      'Enquiry submitted successfully',
      201
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return errorResponse('Validation failed', 422, errors);
    }
    console.error('[POST /api/admin/enquiries]', err);
    return errorResponse('Internal server error', 500);
  }
}
