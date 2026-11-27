/**
 * PageSeo.js — Mongoose model for per-page SEO metadata
 *
 * Each document maps a unique `slug` (e.g. "home", "about-us", "faq")
 * to its full SEO configuration.  The getSeoData helper looks up by slug
 * and falls back gracefully when no document exists.
 */

import mongoose, { Schema, models } from 'mongoose';

const PageSeoSchema = new Schema(
  {
    // URL slug — primary lookup key (e.g. "home", "accreditations-affiliations")
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    // Human-readable page name shown in admin
    pageName: {
      type: String,
      required: [true, 'Page name is required'],
      trim: true,
    },

    // ── Core SEO ──────────────────────────────────────────────
    title: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    keywords: {
      type: String, // comma-separated
      trim: true,
      default: '',
    },

    // ── OG / Twitter image ────────────────────────────────────
    ogImage: {
      url: { type: String, default: '' },      // Cloudinary secure_url or static path
      publicId: { type: String, default: '' }, // Cloudinary public_id
      alt: { type: String, default: '' },
    },

    // ── Canonical ─────────────────────────────────────────────
    canonicalPath: {
      type: String,
      default: '/',
      trim: true,
    },

    // ── Robots ────────────────────────────────────────────────
    index: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.PageSeo || mongoose.model('PageSeo', PageSeoSchema);
