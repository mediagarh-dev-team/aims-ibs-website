/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 * Returns: { token, admin: { id, name, email, role } }
 */

import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    await connectDB();

    // Explicitly select password back (it has select: false on the schema)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!admin || !admin.isActive) {
      return errorResponse('Invalid credentials', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return errorResponse('Invalid credentials', 401);
    }

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return successResponse(
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      'Login successful'
    );
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return errorResponse('Internal server error', 500);
  }
}
