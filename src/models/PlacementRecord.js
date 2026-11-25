/**
 * PlacementRecord.js — Mongoose model for placement records
 */

import mongoose, { Schema, models } from 'mongoose';

const PlacementRecordSchema = new Schema(
  {
    batch: {
      type: String,
      required: [true, 'Batch year is required'],
      trim: true,
      // e.g. "2023-24", "2022-23", "2021-22"
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: ['Finance', 'Marketing', 'HR', 'SCM', 'HCM', 'BA'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
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

// Compound index — fast lookup by batch + specialization
PlacementRecordSchema.index({ batch: 1, specialization: 1 });

export default models.PlacementRecord ||
  mongoose.model('PlacementRecord', PlacementRecordSchema);
