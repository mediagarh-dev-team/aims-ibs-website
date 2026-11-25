/**
 * scripts/seed-admin.js
 * Run once: node scripts/seed-admin.js
 * Delete after use.
 */

const path = require('path');
const fs = require('fs');

// ── Load .env.local ───────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const raw = fs.readFileSync(envPath, 'utf8');

// Split on newlines, but DON'T split URIs on & — only split on the
// FIRST = on each line.
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

console.log('URI being used:', process.env.MONGODB_URI?.slice(0, 60) + '...');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('Connecting to MongoDB...');

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'aims-ibs-db',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    family: 4,
    replicaSet: 'atlas-4r1fif-shard-0',
    tls: true,
    authSource: 'admin',
  });

  console.log('Connected!');

  const db = mongoose.connection.db;

  const existing = await db.collection('admins').findOne({
    email: process.env.ADMIN_EMAIL,
  });

  if (existing) {
    console.log('✓ Admin already exists:', process.env.ADMIN_EMAIL);
    await mongoose.disconnect();
    process.exit(0);
  }

  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await db.collection('admins').insertOne({
    name: 'Super Admin',
    email: process.env.ADMIN_EMAIL,
    password: hash,
    role: 'super_admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✓ Admin created:', process.env.ADMIN_EMAIL);
  console.log('  Login email   :', process.env.ADMIN_EMAIL);
  console.log('  Login password:', process.env.ADMIN_PASSWORD);
  console.log('\n⚠  Delete scripts/seed-admin.js after first use!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
