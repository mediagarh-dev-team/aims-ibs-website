/**
 * mongodb.js
 *
 * Singleton Mongoose connection for Next.js.
 *
 * Next.js hot-reloads modules in development, which would create a new
 * connection on every reload. We cache the promise on the global object so
 * the same connection is reused across reloads.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define MONGODB_URI in your .env.local file'
  );
}

/** @type {{ conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null }} */
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

/**
 * Returns a cached Mongoose connection, creating one if none exists.
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      dbName: 'aims-ibs-db',
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      replicaSet: 'atlas-4r1fif-shard-0',
      tls: true,
      authSource: 'admin',
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset so the next call retries
    throw err;
  }

  return cached.conn;
}
