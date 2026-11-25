/**
 * POST /api/auth/seed
 *
 * Creates the first super_admin from env vars.
 * ⚠️  Call this ONCE after deploy, then delete this file.
 *
 * Protected by a simple env-based guard so random people can't create admins.
 */

import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(req) {
  try {
    // Reject if someone accidentally left this endpoint open in production
    // without the correct secret header
    const secret = req.headers.get('x-seed-secret');
    if (secret !== process.env.JWT_SECRET) {
      return errorResponse('Forbidden', 403);
    }

    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return errorResponse(
        'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local',
        400
      );
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return errorResponse('Admin already exists', 409);
    }

    const admin = await Admin.create({
      name: 'Super Admin',
      email,
      password,
      role: 'super_admin',
    });

    return successResponse(
      { id: admin._id, email: admin.email },
      'Admin created successfully',
      201
    );
  } catch (err) {
    console.error('[POST /api/auth/seed]', err);
    return errorResponse('Internal server error', 500);
  }
}
