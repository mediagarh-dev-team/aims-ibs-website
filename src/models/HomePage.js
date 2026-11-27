/**
 * HomePage.js — Mongoose model for home page CMS content
 *
 * All sections of the home page are stored as a single document
 * (there is only ever ONE home page). We use findOneAndUpdate with
 * upsert: true so the first save also creates the document.
 */

import mongoose, { Schema, models } from 'mongoose';

/* ─── Shared sub-schemas ─────────────────────────────────────── */

const ImageFieldSchema = new Schema(
  {
    url: { type: String, default: '' },      // Cloudinary secure_url (or fallback static path)
    publicId: { type: String, default: '' }, // Cloudinary public_id — used to delete old assets
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const LinkSchema = new Schema(
  {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
);

/* ─── Hero section ───────────────────────────────────────────── */

const HeroSchema = new Schema(
  {
    headingLight: { type: String, default: 'Not Your Average' },
    headingBold: { type: String, default: 'Business School in Bangalore' },
    subtext: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Join Today' },
    ctaHref: { type: String, default: '/apply-now' },
    secondaryCtaLabel: { type: String, default: 'Download Handbook' },
    secondaryCtaHref: { type: String, default: '/handbook.pdf' },
    videoUrl: { type: String, default: '' }, // Cloudinary video url or static path
    companiesTitle: { type: String, default: 'Companies hiring from us' },
    // Company logos — stored as Cloudinary URLs
    companyLogos: [ImageFieldSchema],
  },
  { _id: false }
);

/* ─── Stats bar ──────────────────────────────────────────────── */

const StatItemSchema = new Schema(
  {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  { _id: false }
);

/* ─── Programs section ───────────────────────────────────────── */

const SpecialisationSchema = new Schema(
  {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
);

const MetaItemSchema = new Schema(
  {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  { _id: false }
);

const MastersSchema = new Schema(
  {
    image: ImageFieldSchema,
    href: { type: String, default: '' },
    meta: [MetaItemSchema],
    points: [{ type: String }],
    specialisations: [SpecialisationSchema],
  },
  { _id: false }
);

const BachelorProgramSchema = new Schema(
  {
    prefix: { type: String, default: 'Bachelor of' },
    name: { type: String, default: '' },
    image: ImageFieldSchema,
    href: { type: String, default: '' },
    tags: [{ type: String }],
    points: [{ type: String }],
    affiliatedTo: { type: String, default: 'Bangalore University' },
  },
  { _id: false }
);

const ProgramsSectionSchema = new Schema(
  {
    sectionTitle: { type: String, default: 'Explore Programs' },
    masters: MastersSchema,
    bachelors: [BachelorProgramSchema],
  },
  { _id: false }
);

/* ─── Ranked section ─────────────────────────────────────────── */

const RankLogoSchema = new Schema(
  {
    image: ImageFieldSchema,
    w: { type: Number, default: 100 },
    h: { type: Number, default: 50 },
  },
  { _id: false }
);

const RankItemSchema = new Schema(
  {
    label: [{ type: String }], // multi-line label
    rank: { type: String, default: '' },
    logos: [RankLogoSchema],
  },
  { _id: false }
);

const RankedSectionSchema = new Schema(
  {
    headingLight: { type: String, default: 'Ranked Among' },
    headingBold: { type: String, default: 'The Best' },
    bgImage: ImageFieldSchema,
    ranks: [RankItemSchema],
  },
  { _id: false }
);

/* ─── Global Collaborations section ─────────────────────────── */

const PartnerSchema = new Schema(
  {
    name: { type: String, default: '' },
    logo: ImageFieldSchema,
    bg: ImageFieldSchema,
  },
  { _id: false }
);

const GlobalCollabSchema = new Schema(
  {
    headingLight: { type: String, default: 'Global Collaborations &' },
    headingBold: { type: String, default: 'International Exposure' },
    subtext: { type: String, default: '' },
    partners: [PartnerSchema],
  },
  { _id: false }
);

/* ─── Global Exposure section ────────────────────────────────── */

const GlobalExposureSchema = new Schema(
  {
    headingLight: { type: String, default: 'Global Exposure &' },
    headingBold: { type: String, default: 'International Exchange' },
    // 3 columns of photos
    col1: [ImageFieldSchema],
    col2: [ImageFieldSchema],
    col3: [ImageFieldSchema],
  },
  { _id: false }
);

/* ─── Placements section ─────────────────────────────────────── */

const PlacementStatSchema = new Schema(
  {
    value: { type: String, default: '' },
    unit: { type: String, default: '' },
    label: { type: String, default: '' },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

const PlacementVideoSchema = new Schema(
  {
    name: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    poster: ImageFieldSchema,
  },
  { _id: false }
);

const PlacementLogoSchema = new Schema(
  {
    image: ImageFieldSchema,
  },
  { _id: false }
);

const PlacementsSectionSchema = new Schema(
  {
    headingLight: { type: String, default: 'Placements That' },
    headingBold: { type: String, default: 'Careers' },
    bodyText: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Download Placement Report' },
    ctaHref: { type: String, default: '/placement-report.pdf' },
    stats: [PlacementStatSchema],
    videos: [PlacementVideoSchema],
    // Two rows of company logos for the marquee
    companyLogosRow1: [PlacementLogoSchema],
    companyLogosRow2: [PlacementLogoSchema],
  },
  { _id: false }
);

/* ─── Placed students section ────────────────────────────────── */

const PlacedStudentSchema = new Schema(
  {
    name: { type: String, default: '' },
    company: { type: String, default: '' },
    image: ImageFieldSchema,
  },
  { _id: false }
);

const PlacedStudentsSectionSchema = new Schema(
  {
    headingLight: { type: String, default: 'Where Learning' },
    headingBold: { type: String, default: 'Gets You Hired' },
    subtext: { type: String, default: '' },
    students: [PlacedStudentSchema],
  },
  { _id: false }
);

/* ─── Why Choose section ─────────────────────────────────────── */

const WhyChooseSchema = new Schema(
  {
    headingLine1: { type: String, default: '21 Reasons:' },
    headingLine2: { type: String, default: 'Why Choose' },
    headingBold: { type: String, default: 'AIMS IBS' },
    subtext: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    videoPoster: ImageFieldSchema,
  },
  { _id: false }
);

/* ─── Life at IBS section ────────────────────────────────────── */

const LifeAtIBSSchema = new Schema(
  {
    headingLight: { type: String, default: 'Life at' },
    headingBold: { type: String, default: 'AIMS IBS' },
    subtext: { type: String, default: '' },
    photos: [ImageFieldSchema],
  },
  { _id: false }
);

/* ─── SPARK Model section ────────────────────────────────────── */

const SparkPanelSchema = new Schema(
  {
    label: { type: String, default: '' },
    desc: { type: String, default: '' },
    image: ImageFieldSchema,
  },
  { _id: false }
);

const SparkModelSchema = new Schema(
  {
    headingLight: { type: String, default: 'Our Secret Sauce:' },
    headingBold: { type: String, default: 'The SPARK Model' },
    subtext: { type: String, default: '' },
    panels: [SparkPanelSchema],
  },
  { _id: false }
);

/* ─── Join CTA section ───────────────────────────────────────── */

const JoinCtaSchema = new Schema(
  {
    headingLine1: { type: String, default: 'Ready to join the' },
    headingBold: { type: String, default: 'Top Business School' },
    headingLine2: { type: String, default: 'in Bangalore?' },
    ctaLabel: { type: String, default: 'Apply Now' },
    ctaHref: { type: String, default: '/apply-now' },
    bgImage: ImageFieldSchema,
  },
  { _id: false }
);

/* ─── Root schema ────────────────────────────────────────────── */

const HomePageSchema = new Schema(
  {
    // "singleton" identifier — there is only one home page doc
    _key: { type: String, default: 'home', index: true, unique: true },

    isPublished: { type: Boolean, default: false },

    hero: { type: HeroSchema, default: () => ({}) },
    stats: { type: [StatItemSchema], default: () => [] },
    programs: { type: ProgramsSectionSchema, default: () => ({}) },
    ranked: { type: RankedSectionSchema, default: () => ({}) },
    globalCollaborations: { type: GlobalCollabSchema, default: () => ({}) },
    globalExposure: { type: GlobalExposureSchema, default: () => ({}) },
    placements: { type: PlacementsSectionSchema, default: () => ({}) },
    placedStudents: { type: PlacedStudentsSectionSchema, default: () => ({}) },
    whyChoose: { type: WhyChooseSchema, default: () => ({}) },
    lifeAtIBS: { type: LifeAtIBSSchema, default: () => ({}) },
    sparkModel: { type: SparkModelSchema, default: () => ({}) },
    joinCta: { type: JoinCtaSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

export default models.HomePage || mongoose.model('HomePage', HomePageSchema);
