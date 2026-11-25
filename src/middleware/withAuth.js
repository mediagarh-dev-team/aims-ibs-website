/**
 * withAuth.js
 *
 * Higher-order function that wraps any Next.js Route Handler and verifies
 * the JWT before passing control to the handler.
 *
 * Usage:
 *   export const GET = withAuth(async (req, context, admin) => { ... });
 */

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @param {(req: Request, context: unknown, admin: { id: string; email: string; role: string }) => Promise<Response>} handler
 * @returns {(req: Request, context: unknown) => Promise<Response>}
 */
export function withAuth(handler) {
  return async function (req, context) {
    try {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach admin info to request so the handler can use it
      return handler(req, context, decoded);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token expired, please log in again'
          : 'Invalid token';

      return NextResponse.json(
        { success: false, message },
        { status: 401 }
      );
    }
  };
}
