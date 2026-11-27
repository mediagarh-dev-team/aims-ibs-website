/**
 * scripts/seed-homepage.js
 *
 * Seeds the HomePage document in MongoDB with ALL default content,
 * using the existing static image paths from /public/images/home/.
 *
 * Run once:
 *   node scripts/seed-homepage.js
 *
 * What it does:
 *   - If a HomePage doc with _key: "home" already exists → skips (safe to re-run)
 *   - Pass --force to overwrite an existing doc:
 *       node scripts/seed-homepage.js --force
 *   - Pass --publish to also mark isPublished: true:
 *       node scripts/seed-homepage.js --publish
 *
 * Image URLs use the static /images/home/... paths.
 * After uploading an image via the admin panel, its Cloudinary URL
 * will replace that path automatically.
 */

const path = require('path');
const fs   = require('fs');

/* ── Load .env.local ──────────────────────────────────────────── */
const envPath = path.join(__dirname, '..', '.env.local');
const raw = fs.readFileSync(envPath, 'utf8');

for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const mongoose = require('mongoose');

/* ── Helper ───────────────────────────────────────────────────── */
// Builds a local image object (url = static path, publicId = '')
function img(relativePath, alt = '') {
  return { url: `/${relativePath}`, publicId: '', alt };
}

/* ═══════════════════════════════════════════════════════════════
   DEFAULT HOME PAGE DATA
   All image URLs point to existing files under /public/images/home/
   ═══════════════════════════════════════════════════════════════ */

const HOME_SEED = {
  _key: 'home',
  isPublished: false,

  /* ── Hero ─────────────────────────────────────────────────── */
  hero: {
    headingLight: 'Not Your Average',
    headingBold:  'Business School in Bangalore',
    subtext:
      'At AIMS IBS, we offer class-apart <strong>UG &amp; PG management education</strong> pathways that have been consistently trusted by ranking organizations &amp; students from pan-India.',
    ctaLabel:          'Join Today',
    ctaHref:           '/apply-now',
    secondaryCtaLabel: 'Download Handbook',
    secondaryCtaHref:  '/pdfs/handbook.pdf',
    videoUrl:          '/images/home/home-banner-video.mp4',
    companiesTitle:    'Companies hiring from us',
    companyLogos: Array.from({ length: 12 }, (_, i) =>
      img(`images/home/company-logo-${i + 1}.webp`, `Hiring partner ${i + 1}`)
    ),
  },

  /* ── Stats bar ────────────────────────────────────────────── */
  stats: [
    { label: 'Overall Recruiters',   value: '4300+' },
    { label: 'Recruiters - Top MNCs', value: '50%'  },
    { label: 'Faculty Team',          value: '225+' },
    { label: 'Industry Experts',      value: '90+'  },
  ],

  /* ── Programs ─────────────────────────────────────────────── */
  programs: {
    sectionTitle: 'Explore Programs',
    masters: {
      image: img('images/home/course-img-1.webp', 'MBA + PGPM at AIMS IBS'),
      href:  '/programs/pg/mba-pgpm',
      meta: [
        { label: 'Duration',      value: '2 Years'                    },
        { label: 'Certification', value: '15 Additional Certifications' },
        { label: 'Domains',       value: '6 Specialisations'           },
      ],
      points: [
        'Dual MBA',
        'Industry-Integrated Curriculum',
        'Placement-Focused Training',
      ],
      specialisations: [
        { label: 'Business Analytics',      href: '/programs/pg/business-analytics'    },
        { label: 'Marketing',               href: '/programs/pg/marketing'              },
        { label: 'Finance',                 href: '/programs/pg/finance'                },
        { label: 'Human Resources',         href: '/programs/pg/human-resources'        },
        { label: 'Logistics & Supply Chain', href: '/programs/pg/logistics-supply-chain' },
        { label: 'Healthcare Management',   href: '/programs/pg/healthcare-management'  },
      ],
    },
    bachelors: [
      {
        prefix:      'Bachelor of',
        name:        'Business Administration (BBA)',
        image:       img('images/home/course-img-2.webp', 'BBA at AIMS IBS'),
        href:        '/programs/ug/bba',
        tags:        ['3 Years', '6 Specialisations', '8 Certifications'],
        points:      ['Personality & Career Readiness', 'UGC Recognised Degree', 'AI & Digital Marketing Enabled'],
        affiliatedTo: 'Bangalore University',
      },
      {
        prefix:      'Bachelor of',
        name:        'Computer Applications (BCA)',
        image:       img('images/home/course-img-3.webp', 'BCA at AIMS IBS'),
        href:        '/programs/ug/bca',
        tags:        ['3 Years', '3 Specialisations', '9 Certifications'],
        points:      ['UGC-Recognised BCA Degree', 'Hands-On Coding & Project-Based Learning', 'Technical Certifications Included'],
        affiliatedTo: 'Bangalore University',
      },
      {
        prefix:      'Bachelor of',
        name:        'Commerce (B.Com)',
        image:       img('images/home/course-img-4.webp', 'B.Com at AIMS IBS'),
        href:        '/programs/ug/bcom',
        tags:        ['3 Years', '5 Specialisations', '7 Certifications'],
        points:      ['UGC-Recognized B.Com Degree', 'End-To-End Placement Support', 'Practical Exposure'],
        affiliatedTo: 'Bangalore University',
      },
    ],
  },

  /* ── Ranked ───────────────────────────────────────────────── */
  ranked: {
    headingLight: 'Ranked Among',
    headingBold:  'The Best',
    bgImage: img('images/home/ranked-bg-img.webp', 'AIMS IBS students'),
    ranks: [
      {
        label: ['Times B-School', 'Ranking 2025'],
        rank:  '50th',
        logos: [{ image: img('images/home/rank-logo-1.webp', 'The Times of India'), w: 140, h: 50 }],
      },
      {
        label: ['IIRF Best', 'B-School 2025'],
        rank:  '46th',
        logos: [{ image: img('images/home/rank-logo-2.webp', 'IIRF'), w: 52, h: 50 }],
      },
      {
        label: ['Times of India & Silicon', 'India B-School Ranking'],
        rank:  '20th',
        logos: [
          { image: img('images/home/rank-logo-3.webp', 'Times B-School'), w: 88, h: 50 },
          { image: img('images/home/rank-logo-4.webp', 'Silicon India'),  w: 88, h: 50 },
        ],
      },
      {
        label: ['Best ROI in', 'India'],
        rank:  '17th',
        logos: [{ image: img('images/home/rank-logo-5.webp', 'Best ROI in India'), w: 130, h: 50 }],
      },
    ],
  },

  /* ── Global Collaborations ────────────────────────────────── */
  globalCollaborations: {
    headingLight: 'Global Collaborations &',
    headingBold:  'International Exposure',
    subtext:
      'Our students receive certifications, internships, sessions, projects, and orientation, exchange & twinning programs from a list of partnerships.',
    partners: [
      { name: 'Harvard Business Publishing Education',           logo: img('images/home/university-img-1.webp', 'Harvard Business Publishing'), bg: img('images/home/card-bg-1.webp') },
      { name: 'IAE Bordeaux',                                    logo: img('images/home/university-img-2.webp', 'IAE Bordeaux'),                bg: img('images/home/card-bg-2.webp') },
      { name: 'SIM University',                                  logo: img('images/home/university-img-3.webp', 'SIM University'),              bg: img('images/home/card-bg-3.webp') },
      { name: 'James Cook University',                           logo: img('images/home/university-img-4.webp', 'James Cook University'),       bg: img('images/home/card-bg-4.webp') },
      { name: 'Singapore Human Resources Institute (SHRI)',      logo: img('images/home/university-img-5.webp', 'SHRI Singapore'),              bg: img('images/home/card-bg-1.webp') },
      { name: 'University of Stirling',                          logo: img('images/home/university-img-6.webp', 'University of Stirling'),      bg: img('images/home/card-bg-2.webp') },
      { name: 'Staffordshire University',                        logo: img('images/home/university-img-7.webp', 'Staffordshire University'),    bg: img('images/home/card-bg-3.webp') },
      { name: 'Putra Business School',                           logo: img('images/home/university-img-8.webp', 'Putra Business School'),       bg: img('images/home/card-bg-4.webp') },
    ],
  },

  /* ── Global Exposure ──────────────────────────────────────── */
  globalExposure: {
    headingLight: 'Global Exposure &',
    headingBold:  'International Exchange',
    col1: [
      img('images/home/global-exposure-img-1.webp', 'Students on international exchange, photo 1'),
      img('images/home/global-exposure-img-2.webp', 'Students on international exchange, photo 2'),
    ],
    col2: [
      img('images/home/global-exposure-img-3.webp', 'Students on international exchange, photo 3'),
    ],
    col3: [
      img('images/home/global-exposure-img-4.webp', 'Students on international exchange, photo 4'),
      img('images/home/global-exposure-img-5.webp', 'Students on international exchange, photo 5'),
    ],
  },

  /* ── Placements ───────────────────────────────────────────── */
  placements: {
    headingLight: 'Placements That',
    headingBold:  'Careers',
    bodyText:
      "AIMS IBS's dedicated placement cell works year-round to ensure students walk into outstanding careers — from aptitude training and mock interviews to live industry exposure.",
    ctaLabel: 'Download Placement Report',
    ctaHref:  '/pdfs/placement-report.pdf',
    stats: [
      { value: '94%',   unit: '',    label: 'Placement Rate',  highlight: false },
      { value: '₹6.8',  unit: 'LPA', label: 'Average Package', highlight: false },
      { value: '₹14.5', unit: 'LPA', label: 'Highest Package', highlight: true  },
      { value: '200+',  unit: '',    label: 'Hiring Partners', highlight: false  },
    ],
    // Placement videos — no videos yet; admin will upload via panel
    // Video poster images are ready
    videos: [
      { name: 'Devaiah K U', videoUrl: '/images/home/placement-1.mp4', poster: img('images/home/video-img-1.webp', 'Devaiah K U placement video') },
      { name: 'Anjali',      videoUrl: '/images/home/placement-2.mp4', poster: img('images/home/video-img-2.webp', 'Anjali placement video')      },
    ],
    companyLogosRow1: Array.from({ length: 6 }, (_, i) =>
      ({ image: img(`images/home/company-logo-${i + 1}.webp`, `Company logo ${i + 1}`) })
    ),
    companyLogosRow2: Array.from({ length: 6 }, (_, i) =>
      ({ image: img(`images/home/company-logo-${i + 7}.webp`, `Company logo ${i + 7}`) })
    ),
  },

  /* ── Placed Students ──────────────────────────────────────── */
  placedStudents: {
    headingLight: 'Where Learning',
    headingBold:  'Gets You Hired',
    subtext:      'Take a look at what happens when classroom knowledge meets industry relevance.',
    students: Array.from({ length: 15 }, (_, i) => ({
      name:    'AIMS IBS Student',
      company: 'Leading Company',
      image:   img(`images/home/placement-img-${i + 1}.webp`, `Placed student ${i + 1}`),
    })),
  },

  /* ── Why Choose ───────────────────────────────────────────── */
  whyChoose: {
    headingLine1: '21 Reasons:',
    headingLine2: 'Why Choose',
    headingBold:  'AIMS IBS',
    subtext:
      'Still hesitant? Here is a <strong>list of reasons</strong> why students consider us the best <strong>business school in Bangalore</strong>.',
    videoUrl:    '/images/home/reasons-video.mp4',
    videoPoster: img('images/home/reasons-video-poster.webp', 'Why choose AIMS IBS'),
  },

  /* ── Life at IBS ──────────────────────────────────────────── */
  lifeAtIBS: {
    headingLight: 'Life at',
    headingBold:  'AIMS IBS',
    subtext:
      "Students don't call us the top B school in Bangalore for academics. They say that because of the overall experience.",
    photos: Array.from({ length: 30 }, (_, i) =>
      img(`images/home/life-at-ibs-img-${i + 1}.webp`, `Life at AIMS IBS, photo ${i + 1}`)
    ),
  },

  /* ── SPARK Model ──────────────────────────────────────────── */
  sparkModel: {
    headingLight: 'Our Secret Sauce:',
    headingBold:  'The SPARK Model',
    subtext:      'AIMS IBS offers a 360° training ecosystem that builds everything from core skills to confidence.',
    panels: [
      {
        label: 'Skills',
        desc:  'MS Office, Advanced Excel, AI/ML, Investment Banking, Digital Marketing',
        image: img('images/home/skills-img-bg.webp', 'Skills'),
      },
      {
        label: 'Practical Exposure',
        desc:  'Industry visits, live projects, real-world internships and case-study immersions that bridge the gap between classroom and corporate life.',
        image: img('images/home/skills-img-bg.webp', 'Practical Exposure'),
      },
      {
        label: 'Attitude & Personality',
        desc:  'Soft-skill workshops, leadership bootcamps, communication labs, and professional grooming sessions that shape a confident, work-ready graduate.',
        image: img('images/home/skills-img-bg.webp', 'Attitude & Personality'),
      },
      {
        label: 'Recreation',
        desc:  'Sports tournaments, cultural festivals, student clubs, and wellness activities that nurture a balanced and energetic campus life.',
        image: img('images/home/skills-img-bg.webp', 'Recreation'),
      },
      {
        label: 'Knowledge',
        desc:  'Academic rigour, management research, global business knowledge, and 15+ industry certifications built into every programme.',
        image: img('images/home/skills-img-bg.webp', 'Knowledge'),
      },
    ],
  },

  /* ── Join CTA ─────────────────────────────────────────────── */
  joinCta: {
    headingLine1: 'Ready to join the',
    headingBold:  'Top Business School',
    headingLine2: 'in Bangalore?',
    ctaLabel:     'Apply Now',
    ctaHref:      '/apply-now',
    bgImage:      img('images/home/cta-bg-img-aiims.webp', 'AIMS IBS campus'),
  },
};

/* ═══════════════════════════════════════════════════════════════
   Also seed the SEO document for the home page
   ═══════════════════════════════════════════════════════════════ */
const HOME_SEO_SEED = {
  slug:          'home',
  pageName:      'Home',
  title:         'MBA & PGDM in Bangalore | AIMS IBS Business School',
  description:   'AIMS IBS is a top-ranked business school in Bangalore offering MBA, PGDM and executive management programs with global collaborations and 100% placement support.',
  keywords:      'MBA Bangalore, PGDM Bangalore, business school Bangalore, AIMS IBS, management college, top B-school Bangalore',
  ogImage:       img('images/home/life-at-ibs-img-21.webp', 'AIMS IBS Business School Bangalore'),
  canonicalPath: '/',
  index:         true,
  isActive:      true,
};

/* ═══════════════════════════════════════════════════════════════
   Runner
   ═══════════════════════════════════════════════════════════════ */
const FORCE   = process.argv.includes('--force');
const PUBLISH = process.argv.includes('--publish');

async function seed() {
  console.log('\n🌱  AIMS IBS — Home Page Seed');
  console.log('────────────────────────────────');
  console.log('Connecting to MongoDB…');

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName:                    'aims-ibs-db',
    serverSelectionTimeoutMS:  10000,
    socketTimeoutMS:           30000,
    family:                    4,
    replicaSet:                'atlas-4r1fif-shard-0',
    tls:                       true,
    authSource:                'admin',
  });

  console.log('✓ Connected!');
  const db = mongoose.connection.db;

  /* ── HomePage ──────────────────────────────────────────────── */
  const existingPage = await db.collection('homepages').findOne({ _key: 'home' });

  if (existingPage && !FORCE) {
    console.log('\n⚠  HomePage document already exists.');
    console.log('   Pass --force to overwrite:  node scripts/seed-homepage.js --force');
  } else {
    if (PUBLISH) HOME_SEED.isPublished = true;

    if (existingPage) {
      await db.collection('homepages').replaceOne({ _key: 'home' }, {
        ...HOME_SEED,
        createdAt:  existingPage.createdAt || new Date(),
        updatedAt:  new Date(),
      });
      console.log('\n✓ HomePage document REPLACED (--force was set)');
    } else {
      await db.collection('homepages').insertOne({
        ...HOME_SEED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('\n✓ HomePage document CREATED');
    }
    console.log(`  isPublished : ${PUBLISH ? 'true (--publish flag)' : 'false (draft)'}`);
  }

  /* ── PageSeo (home) ────────────────────────────────────────── */
  const existingSeo = await db.collection('pageSeos').findOne({ slug: 'home' });

  if (existingSeo && !FORCE) {
    console.log('\n⚠  Home PageSeo document already exists.');
    console.log('   Pass --force to overwrite:  node scripts/seed-homepage.js --force');
  } else {
    if (existingSeo) {
      await db.collection('pageSeos').replaceOne({ slug: 'home' }, {
        ...HOME_SEO_SEED,
        createdAt: existingSeo.createdAt || new Date(),
        updatedAt: new Date(),
      });
      console.log('✓ Home PageSeo document REPLACED');
    } else {
      await db.collection('pageSeos').insertOne({
        ...HOME_SEO_SEED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✓ Home PageSeo document CREATED');
    }
  }

  /* ── Summary ───────────────────────────────────────────────── */
  console.log('\n📋  What was seeded:');
  console.log('  Hero section         — heading, subtext, CTA, video, 12 company logos');
  console.log('  Stats bar            — 4 stat items');
  console.log('  Programs             — Masters (MBA+PGPM) + 3 Bachelor programs');
  console.log('  Ranked section       — 4 ranking items with logos');
  console.log('  Global Collaborations — 8 university partners');
  console.log('  Global Exposure      — 5 photos in 3 columns');
  console.log('  Placements           — stats, 2 video placeholders, 12 company logos');
  console.log('  Placed Students      — 15 student photos');
  console.log('  Why Choose           — video + poster');
  console.log('  Life at IBS          — 30 gallery photos');
  console.log('  SPARK Model          — 5 panels');
  console.log('  Join CTA             — heading + CTA + background image');
  console.log('  SEO (home)           — title, description, keywords, OG image');

  console.log('\n📌  Next steps:');
  console.log('  1. Open /admin/pages/home in your browser');
  console.log('  2. Each section shows the seeded data — edit & save section by section');
  console.log('  3. Upload images via the admin image pickers (they\'ll replace static paths)');
  console.log('  4. Click "Publish" when ready to go live');
  console.log('  5. Run  node scripts/seed-homepage.js --publish  to auto-publish');

  await mongoose.disconnect();
  console.log('\n✅  Done!\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
