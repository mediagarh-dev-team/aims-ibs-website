/**
 * Enquiry.js — Mongoose model for student / general enquiries
 */

import mongoose, { Schema, models } from 'mongoose';

const EnquirySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    source: {
      type: String,
      enum: ['website', 'landing_page', 'other'],
      default: 'website',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'spam'],
      default: 'new',
    },
    notes: {
      type: String, // admin internal notes
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast filtering by status and date
EnquirySchema.index({ status: 1, createdAt: -1 });

export default models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
