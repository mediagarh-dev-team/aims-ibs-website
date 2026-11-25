/**
 * apiResponse.js
 *
 * Consistent JSON response shapes for every API route.
 * Using these everywhere means the frontend always knows what to expect.
 */

import { NextResponse } from 'next/server';

/**
 * 200 / 201 success
 * @param {unknown} data
 * @param {string} [message]
 * @param {number} [status]
 */
export function successResponse(data, message = 'Success', status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

/**
 * 4xx / 5xx error
 * @param {string} message
 * @param {number} [status]
 * @param {unknown} [errors]
 */
export function errorResponse(message, status = 400, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}
